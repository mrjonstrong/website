/**
 * Post-build script that verifies the inline script SHA-512 hashes in
 * public/_headers match what Astro actually produced in dist/.
 *
 * Exits with code 1 (failing the build) if there is a mismatch.
 * Run automatically via the "postbuild" npm script.
 */

import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";

const DIST_DIR = "dist";
const HEADERS_FILE = "public/_headers";

/* ------------------------------------------------------------------ */
/*  1. Collect inline-script hashes from the built HTML               */
/* ------------------------------------------------------------------ */

/** Recursively find all .html files under a directory. */
function findHtmlFiles(dir) {
	const results = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			results.push(...findHtmlFiles(full));
		} else if (full.endsWith(".html")) {
			results.push(full);
		}
	}
	return results;
}

/**
 * Return the set of SHA-512 hashes (base64) for every inline <script>
 * in the given HTML string that is subject to CSP script-src enforcement.
 * This includes:
 *   - Inline JavaScript scripts with no type attribute (defaults to JS)
 *   - Inline scripts whose type is one of the two canonical JS MIME types
 *     recognised here: "text/javascript" or "application/javascript"
 *   - <script type="module"> (ES module scripts)
 *   - <script type="speculationrules"> (subject to script-src per CSP spec)
 * Skips:
 *   - scripts with a src= attribute (external files)
 *   - non-executable data blocks like <script type="application/ld+json">
 *
 * Note: browsers also accept legacy JS MIME type aliases (e.g. text/ecmascript,
 * application/x-javascript) but Astro never emits those, so they are not
 * listed in CSP_GOVERNED_TYPES.  If that ever changes, add them here.
 */
function extractInlineScriptHashes(html) {
	const hashes = new Set();
	const root = parse(html);
	const scriptTags = root.querySelectorAll("script");

	// Types subject to CSP script-src enforcement
	// (classic JS types, module, and speculationrules per spec)
	const CSP_GOVERNED_TYPES = new Set([
		"text/javascript",
		"application/javascript",
		"module",
		"speculationrules",
	]);

	for (const script of scriptTags) {
		// Skip external scripts (those with src attribute)
		if (script.getAttribute("src")) continue;

		// Only hash scripts that are subject to script-src CSP enforcement.
		// Scripts with no type default to JS. Scripts with a non-governed type
		// (e.g. application/ld+json) are data blocks not subject to script-src.
		const type = script.getAttribute("type")?.toLowerCase().trim();
		if (type && !CSP_GOVERNED_TYPES.has(type)) continue;

		// Get the text content of the script
		const body = script.textContent || "";
		if (!body.trim()) continue;

		const hash = createHash("sha512").update(body).digest("base64");
		hashes.add(`sha512-${hash}`);
	}
	return hashes;
}

let htmlFiles;
try {
	htmlFiles = findHtmlFiles(DIST_DIR);
} catch (error) {
	console.error(`ERROR: Cannot access ${DIST_DIR} directory: ${error.message}`);
	process.exit(1);
}

if (htmlFiles.length === 0) {
	console.error("ERROR: No HTML files found in dist/. Was the build successful?");
	process.exit(1);
}

const buildHashes = new Set();
for (const file of htmlFiles) {
	let html;
	try {
		html = readFileSync(file, "utf-8");
	} catch (error) {
		console.error(`ERROR: Cannot read HTML file ${file}: ${error.message}`);
		process.exit(1);
	}
	for (const h of extractInlineScriptHashes(html)) {
		buildHashes.add(h);
	}
}

if (buildHashes.size === 0) {
	console.warn(
		"WARNING: No inline scripts found in build output. This may indicate an issue with the build or hash extraction.",
	);
}
/* ------------------------------------------------------------------ */
/*  2. Extract sha512-* hashes from the CSP in public/_headers        */
/* ------------------------------------------------------------------ */

let headersContent;
try {
	headersContent = readFileSync(HEADERS_FILE, "utf-8");
} catch (error) {
	console.error(`ERROR: Cannot read ${HEADERS_FILE}: ${error.message}`);
	process.exit(1);
}

/**
 * Extract the full CSP value, handling multi-line headers.
 * HTTP headers can span multiple lines when continuation lines start with
 * whitespace (space or tab) per RFC 7230 (obsoletes RFC 2616).
 *
 * A line is considered a new header if it contains a colon after non-whitespace
 * characters, indicating a "Header-Name: value" pattern.
 */
function extractCspValue(content) {
	const lines = content.split(/\r?\n/);
	let cspValue = null;
	let inCsp = false;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// Start of CSP header
		if (/^\s*Content-Security-Policy:\s*/i.test(line)) {
			cspValue = line.replace(/^\s*Content-Security-Policy:\s*/i, "");
			inCsp = true;
			continue;
		}

		// If we're processing CSP
		if (inCsp) {
			// Check if this line looks like a new header (has header-name: pattern)
			// after trimming leading whitespace
			const trimmed = line.trim();
			if (trimmed && /^[A-Za-z0-9-]+:\s+/.test(trimmed)) {
				// This is a new header, stop processing CSP
				break;
			}

			// Continuation line (starts with whitespace and is not a new header)
			if (/^[\s\t]/.test(line) && trimmed) {
				cspValue += ` ${trimmed}`;
				continue;
			}

			// Empty line or non-continuation line ends the CSP
			if (trimmed === "") {
				break;
			}
		}
	}

	return cspValue;
}

const cspValue = extractCspValue(headersContent);
if (!cspValue) {
	console.error("ERROR: No Content-Security-Policy found in", HEADERS_FILE);
	process.exit(1);
}

/**
 * Extract SHA-512 hashes from script-src related directives, falling back
 * to default-src when no script-src* directives are present.
 *
 * CSP directives are semicolon-separated. This function parses the CSP
 * to find script-src, script-src-elem, and script-src-attr directives and
 * extracts only the hashes from those directives. If none of those
 * directives are present, it falls back to extracting hashes from the
 * default-src directive, which governs scripts in that case.
 *
 * @param {string} cspValue - The full Content-Security-Policy header value
 * @returns {Set<string>} Set of SHA-512 hashes relevant for scripts
 */
function extractScriptSrcHashes(cspValue) {
	const hashes = new Set();
	// Split CSP into directives (semicolon-separated)
	const directives = cspValue.split(";").map((d) => d.trim());

	// Helper regex to extract SHA-512 hashes from a directive value
	const hashRe = /["'](sha512-[A-Za-z0-9+/]+=*)["']/g;

	let hasScriptDirective = false;

	// First pass: collect hashes from script-src* directives
	for (const directive of directives) {
		// Skip empty directives that can appear due to trailing semicolons
		if (!directive) continue;

		const directiveLower = directive.toLowerCase();
		const isScriptDirective =
			directiveLower === "script-src" ||
			directiveLower.startsWith("script-src ") ||
			directiveLower === "script-src-elem" ||
			directiveLower.startsWith("script-src-elem ") ||
			directiveLower === "script-src-attr" ||
			directiveLower.startsWith("script-src-attr ");

		if (!isScriptDirective) {
			continue;
		}

		hasScriptDirective = true;

		// Reset regex state before reusing it for this directive
		hashRe.lastIndex = 0;
		let match;
		// biome-ignore lint/suspicious/noAssignInExpressions: Standard regex matching pattern
		while ((match = hashRe.exec(directive)) !== null) {
			hashes.add(match[1]);
		}
	}

	// If no script-src* directives are present, fall back to default-src
	if (!hasScriptDirective) {
		for (const directive of directives) {
			if (!directive) continue;

			const directiveLower = directive.toLowerCase();
			const isDefaultSrc =
				directiveLower === "default-src" || directiveLower.startsWith("default-src ");

			if (!isDefaultSrc) {
				continue;
			}
			// Reset regex state before reusing it for this directive
			hashRe.lastIndex = 0;
			let match;
			// biome-ignore lint/suspicious/noAssignInExpressions: Standard regex matching pattern
			while ((match = hashRe.exec(directive)) !== null) {
				hashes.add(match[1]);
			}
		}
	}

	return hashes;
}

const cspHashes = extractScriptSrcHashes(cspValue);

/* ------------------------------------------------------------------ */
/*  3. Extract edge-injected hashes (exempt from build check)         */
/* ------------------------------------------------------------------ */

/**
 * Parse "# edge-injected-hash: sha512-..." comments from the _headers file.
 * These hashes belong to scripts that Cloudflare (or another CDN) injects at
 * the edge — they are intentionally absent from the static build output and
 * must be excluded from the "hash in CSP but not in build" error.
 */
function extractEdgeInjectedHashes(content) {
	const hashes = new Set();
	for (const line of content.split(/\r?\n/)) {
		const match = line.match(/^\s*#\s*edge-injected-hash:\s*(sha512-[A-Za-z0-9+/]+=*)\s*$/);
		if (match) hashes.add(match[1]);
	}
	return hashes;
}

const edgeHashes = extractEdgeInjectedHashes(headersContent);

/* ------------------------------------------------------------------ */
/*  4. Compare                                                        */
/* ------------------------------------------------------------------ */

const inBuildNotCsp = [...buildHashes].filter((h) => !cspHashes.has(h));
// Edge-injected hashes are expected to be absent from the build output.
const inCspNotBuild = [...cspHashes].filter((h) => !buildHashes.has(h) && !edgeHashes.has(h));

if (inBuildNotCsp.length === 0 && inCspNotBuild.length === 0) {
	console.log(`CSP hash check passed — ${buildHashes.size} inline script hash(es) verified.`);
	process.exit(0);
}

console.error("CSP hash mismatch detected!\n");

if (inBuildNotCsp.length > 0) {
	console.error("Inline scripts in build output missing from CSP (add these):");
	for (const h of inBuildNotCsp) console.error(`  '${h}'`);
}

if (inCspNotBuild.length > 0) {
	console.error("Hashes in CSP that no longer match any inline script (remove these):");
	for (const h of inCspNotBuild) console.error(`  '${h}'`);
}

console.error("\nUpdate the sha512 hashes in public/_headers to match the build output.");
process.exit(1);
