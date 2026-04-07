---
title: "Is This Site Post-Quantum Ready?"
description: "A hands-on PQC readiness assessment of this blog — auditing TLS, CSP hashing, CI/CD supply chain, and every cryptographic dependency."
publishDate: "2026-04-07"
tags: ["cyber-security", "cryptography", "pqc"]
---

I write about security, so I should practise it. With NIST's post-quantum cryptography (PQC) standards now published and Cloudflare, Chrome, and OpenSSH already shipping hybrid PQC by default, I decided to run a proper readiness assessment against this site — the infrastructure, the build pipeline, and every cryptographic touchpoint in between.

Here's what I found.

## The cryptographic inventory

Before you can assess PQC readiness, you need to know where cryptography lives. For a static Astro site on Cloudflare Pages with GitHub Actions CI, the surface is smaller than a typical web application, but it's not zero.

### TLS (visitor connections)

This site is served through Cloudflare, which has negotiated hybrid PQC key exchange (`X25519MLKEM768`) for TLS by default since late 2024. Any visitor with a modern browser — Chrome 124+, Firefox 128+, Edge 124+ — is already getting post-quantum key agreement on every connection to this site.

I didn't have to configure anything. Cloudflare enables this at the edge automatically. You can verify it yourself:

```bash
openssl s_client -connect jonathanstrong.org:443 -groups X25519MLKEM768
```

**Verdict: PQC-ready.** Hybrid key exchange is active. Classical fallback (X25519) is available for older clients.

### CSP script hashes (SHA-256)

The site's Content Security Policy in `public/_headers` uses SHA-256 hashes to allowlist inline scripts:

```text
script-src 'self' 'sha256-OdbZQZXbUBJu+W/...' ...
```

A post-build verification script (`scripts/verify-csp-hashes.mjs`) recomputes these hashes using Node's `createHash("sha256")` and fails the build on mismatch.

SHA-256 is **quantum-resistant**. Grover's algorithm reduces brute-force search from 2²⁵⁶ to 2¹²⁸ operations, which is still computationally infeasible. NIST considers SHA-256 safe for the foreseeable quantum future, and CNSA 2.0 approves SHA-384 and SHA-512 but does not deprecate SHA-256 for hashing.

**Verdict: PQC-ready.** No changes needed.

### HSTS and transport security

The `_headers` file enforces:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

HSTS itself has no cryptographic algorithm dependency — it instructs browsers to use HTTPS, and the underlying TLS negotiation handles algorithm selection. Since Cloudflare's TLS is already hybrid-PQC, HSTS is fine as-is.

**Verdict: PQC-ready.**

### GitHub Actions supply chain

All workflows pin actions to full commit SHAs rather than mutable tags. This is a supply chain integrity measure, not a PQC concern directly — but the hashing matters.

Git uses SHA-1 for commit hashes. SHA-1 is **not quantum-resistant** (Grover's algorithm reduces it to 2⁸⁰, and classical collision attacks already exist). However:

- GitHub is migrating to SHA-256 for Git object hashing.
- The threat model for commit SHA pinning is collision attacks on the commit hash, which are already mitigated by GitHub's SHA-1 collision detection (shipped since the SHAttered attack in 2017).
- Quantum attacks on SHA-1 preimage resistance would require a fault-tolerant quantum computer that doesn't exist yet, and by the time it does, the Git SHA-256 migration should be complete.

The `step-security/harden-runner` in all workflows monitors egress and blocks unexpected network calls, adding defence-in-depth regardless of hash algorithm.

**Verdict: acceptable risk.** SHA-1 in Git commit pinning is a known limitation of the Git ecosystem, not something I can fix at the repository level. The SHA-256 migration is underway upstream.

### Trivy and dependency scanning

The `trivy.yml` workflow scans for known vulnerabilities and uploads SARIF results. Trivy's own integrity was a concern after the [March 2026 supply chain compromise](/posts/trivy-compromise), but the action is SHA-pinned and the binary integrity is verified.

No PQC-specific dependency scanning exists yet in any major tool. This is a gap across the industry, not specific to this site.

**Verdict: no PQC-specific action available.** Worth revisiting when tools add quantum-readiness checks.

### Webmention API calls

The site makes authenticated API calls to `webmention.io` using a server-side API key. The key is transmitted over HTTPS (TLS to webmention.io). Whether that connection uses hybrid PQC depends on webmention.io's server configuration, which I don't control.

The API key itself is a bearer token — a symmetric secret. Symmetric cryptography (AES, HMAC) is quantum-resistant with sufficient key length. The risk here is HNDL interception of the TLS session carrying the token, but since the token can be rotated and has no long-term confidentiality value, this is low risk.

**Verdict: low risk.** The token is short-lived and rotatable. Upstream TLS PQC support is outside my control.

### Node.js crypto usage

The build pipeline uses `createHash("sha256")` for CSP verification and `crypto.randomUUID()` for generating component IDs. Both are fine:

- SHA-256: quantum-resistant (as discussed above).
- `randomUUID()`: uses a CSPRNG. Quantum computers don't break random number generation.

**Verdict: PQC-ready.**

### No subresource integrity (SRI)

The site doesn't load external scripts, so SRI attributes aren't present. This is actually the most PQC-resilient approach — no external resources means no integrity hashes to worry about, and no third-party TLS connections to audit.

**Verdict: not applicable (and that's ideal).**

## Summary

| Component                  | Algorithm        | Quantum-safe? | Action needed        |
| -------------------------- | ---------------- | ------------- | -------------------- |
| TLS key exchange           | X25519MLKEM768   | Yes (hybrid)  | None                 |
| CSP script hashes          | SHA-256          | Yes           | None                 |
| HSTS                       | N/A              | Yes           | None                 |
| Git commit pinning         | SHA-1            | No            | Awaiting Git SHA-256 |
| Trivy / dependency scans   | N/A              | N/A           | Monitor tooling      |
| Webmention API (TLS)       | Upstream-depends | Unknown       | Low priority         |
| Build-time hashing         | SHA-256          | Yes           | None                 |
| Random ID generation       | CSPRNG           | Yes           | None                 |
| External script loading    | None             | N/A           | None (no externals)  |

## What this means

This site is in a strong position. The two most important cryptographic operations — TLS to visitors and integrity hashing in the build — are already quantum-resistant without any changes on my part.

The only area where a quantum-vulnerable algorithm is in use (SHA-1 in Git) is an ecosystem-wide limitation that GitHub is actively addressing. There's nothing to do at the repository level except keep actions SHA-pinned (which is already the practice) and move to SHA-256 commit hashes when Git and GitHub complete the migration.

For a static site with no server-side computation, no database, no user authentication, and no long-lived secrets, the attack surface for quantum threats is genuinely minimal. The real PQC work — migrating key exchange, certificates, and signatures — sits with Cloudflare and GitHub, both of whom are ahead of most of the industry.

If you're assessing your own systems, the approach is the same: inventory every cryptographic touchpoint, check whether each algorithm is quantum-resistant, and focus your energy on the gaps. For most people, the biggest win is confirming that their TLS provider already supports hybrid PQC key exchange — and in 2026, most major providers do.
