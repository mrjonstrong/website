---
title: "The Trivy Compromise"
description: "A practical walkthrough of how I checked whether the March 2026 Trivy supply chain attack affected my local Mac and GitHub Actions workflows."
publishDate: "2026-03-25"
tags: ["cyber-security", "supply-chain", "github-actions", "trivy"]
---

On 19 March 2026, Trivy — the most popular open-source container security scanner — was compromised. The irony is hard to miss: organisations running Trivy to improve their security posture had the greatest exposure.

I use Trivy in two ways: locally on my Mac via Homebrew, and in GitHub Actions to scan my projects. When I heard the news, my first question was simple: am I affected?

This post walks through what happened, what I checked, and what I'm doing differently going forward. If you use Trivy in any capacity, this should help you figure out where you stand.

## What actually happened

An AI-powered bot called hackerbot-claw found a `pull_request_target` misconfiguration in Trivy's GitHub Actions workflow. This trigger runs with the base repo's secrets, and when combined with checking out the PR head, it executes code from untrusted forks — a well-documented anti-pattern that has been exploited before in SpotBugs and Nx.

The attackers stole the aqua-bot Personal Access Token — a single credential that could push code, create releases, and modify any repository under the Aqua Security organisation.

Aqua Security detected the breach and rotated credentials on 1 March. But the rotation was not atomic. The attacker was watching, captured the refreshed tokens during the gap between issuing new credentials and revoking old ones, and maintained access.

On 19 March, they weaponised it. They force-pushed 76 of 77 version tags in the trivy-action repository to malicious commits. All 7 setup-trivy tags were poisoned too. Only version 0.35.0 was left untouched. A backdoored Trivy v0.69.4 binary was shipped to GitHub Releases, Docker Hub, GHCR, and Amazon ECR.

The payload — "TeamPCP Cloud Stealer" — scraped CI/CD runner memory via `/proc/PID/mem`, swept 50+ filesystem paths for credentials, encrypted everything with AES-256 and RSA-4096, and exfiltrated to a typosquatted domain. Then it ran the real Trivy scan so victims saw green checkmarks.

It cascaded from there. Stolen npm tokens spawned a self-propagating worm called CanisterWorm across 66+ packages. On 22 March, malicious Docker images (v0.69.5, v0.69.6) were pushed and 44 Aqua Security repos were defaced. By 23 March, Checkmarx KICS and AST Actions were hijacked. On 24 March, LiteLLM was compromised on PyPI — 3.6 million downloads per day, roughly a 3-hour exposure window.

One stolen token, five ecosystems.

## Was I affected? Checking my Mac

My first concern was the Homebrew install. The compromised v0.69.4 binary was published to GitHub Releases and Homebrew picked it up automatically. Anyone who ran `brew upgrade trivy` between 19–20 March would have pulled it.

I checked my installed version:

```bash
brew info trivy
```

The output showed I was on v0.69.3, installed on 3 March. I never pulled v0.69.4. Safe by luck.

I also checked my shell history to see when I last actually ran trivy:

```bash
grep -i trivy ~/.zsh_history
```

The only recent execution was a filesystem scan from well before 19 March. The rest were these diagnostic checks themselves.

If you're not sure about your version, these are the commands to run:

```bash
trivy --version
brew info trivy
ls -la $(which trivy)
```

You want to be on v0.69.3 or earlier. If you see v0.69.4, v0.69.5, or v0.69.6 — assume compromise.

For network-level IOCs, the C2 domain was `scan.aquasecurtiy[.]org` (note the typosquat — missing 'i' in "security"). There are a few places to check depending on your setup:

If you use NextDNS, check your logs for that domain — it's one of the advantages of running a DNS-level filter, you get a searchable query history. Little Snitch will also show outbound connection attempts if you have it installed.

Also check your GitHub account for a repository named `tpcp-docs` — that's the fallback exfiltration method if the C2 domain was unreachable.

## Was I affected? Checking my GitHub Actions

This is where things got more interesting. My website repo uses trivy-action in CI. But when I checked my workflow, I found I was already protected:

```yaml
uses: aquasecurity/trivy-action@57a97c7e7821a5776cebc9bb87c984fa69cba8f1
```

That SHA corresponds to v0.35.0 — the one version the attackers didn't touch. And I'm pinning to the commit SHA, not a mutable tag. If I'd been using `@v0` or `@0.24.0`, the force-pushed tags would have silently redirected my workflows to malicious code with no warning.

My workflows also use StepSecurity's harden-runner for network egress monitoring, and all other actions are similarly SHA-pinned. I'd previously run zizmor across all my workflows to audit for exactly these kinds of issues — it flags unpinned actions, dangerous triggers, and other workflow security problems. These practices were already in place before the attack — not a response to it.

One thing I did tighten up in response to this incident: I added `persist-credentials: false` to checkout steps that don't push. This reduces token exposure by not persisting `GITHUB_TOKEN` in the local git config for workflows that only read code.

I also switched Dependabot from daily to weekly updates. This is a static site hosted on Cloudflare Pages — most CVEs that turn up in dependencies aren't relevant to my threat model, and daily PRs just create noise. Weekly gives me time to review changes properly rather than rubber-stamping them.

The core issue is that git tags are mutable pointers. Anyone with write access can do `git tag -f v0.24.0 <malicious-commit>` and `git push -f origin refs/tags/v0.24.0`. GitHub Actions resolves those tags silently. No warning, no audit log on the free tier, no transparency.

The fix is to pin to full commit SHAs, which are immutable. Use Dependabot or Renovate to manage the updates so you're not stuck on old versions forever.

## What about my secrets?

The malware targeted environment variables, SSH keys, AWS/GCP/Azure credentials, Kubernetes tokens, Docker configs, database credentials, and more. So even after confirming I didn't run a compromised binary, I wanted to audit what would have been exposed if I had.

A few things worked in my favour here. I use 1Password CLI with `op run` to inject secrets at runtime. They never sit in plaintext environment variables. For AWS, I use SSO with Identity Centre — short-lived tokens, no long-lived static credentials in `~/.aws/credentials`. For server access I use AWS SSM rather than SSH keys, so there are no private keys sitting on my filesystem for the malware to find.

Importantly, the secrets I do use are tightly scoped and regularly rotated. A GitHub token that can only read packages is a lot less dangerous than one with full repo admin access. Short-lived credentials that expire in hours limit the window an attacker has even if they do grab them.

This matters because the Trivy malware specifically scraped environment variables and file paths for credentials. If your secrets are injected ephemerally via `op run`, your AWS access comes through SSO, and you're using SSM instead of SSH, the attack surface is dramatically smaller than having `export AWS_SECRET_ACCESS_KEY=...` in your `.zshrc`.

You should also make sure secrets don't end up in your shell history. In zsh you can add this to your `.zshrc`:

```bash
setopt HIST_IGNORE_SPACE
```

Then prefix any command containing a secret with a leading space (e.g. `export SECRET=...`) and it won't be recorded in your history. It's a small thing but it reduces the number of places credentials can leak from.

To check your own exposure:

```bash
# Look for secrets in env vars
env | grep -iE 'key|token|secret|pass|cred|auth|api'

# Check shell configs for exported secrets
grep -iE 'export.*(key|token|secret|pass|cred|auth|api)' ~/.zshrc ~/.zprofile ~/.zshenv ~/.profile 2>/dev/null

# Check for static AWS credentials
cat ~/.aws/credentials
```

For a more thorough scan, use trufflehog to search your home directory for secrets:

```bash
brew install trufflehog
trufflehog filesystem ~/ --only-verified
```

This uses regex and entropy analysis to find credentials that a simple grep would miss — things like base64-encoded tokens or keys in config files you've forgotten about.

If you find long-lived secrets in any of those places, this incident is a good reason to move them into a password manager CLI or switch to short-lived credential mechanisms.

## What I'm doing differently

I was lucky this time — safe by luck on the brew side and safe by design on the GitHub Actions side. But luck isn't a strategy. Here's what I'm taking away:

**SHA pinning works.** This is the single most effective defence against GitHub Actions supply chain attacks. My workflows were pinned before this happened. If yours aren't, start now. Use Dependabot or Renovate to keep the SHAs current.

**Secret hygiene matters before the incident.** 1Password CLI and AWS SSO meant that even in the worst case, my exposure would have been limited. The time to set this up is before you need it.

**Monitor your CI/CD egress.** StepSecurity's harden-runner baselines normal network behaviour and alerts on anomalies. This is actually how the Trivy attack was initially detected — anomalous outbound connections from CI runners.

**Hunt down `pull_request_target` and remove it.** This was the initial entry point for the entire attack. It runs with the base repo's secrets, and when workflows check out the PR head, it executes untrusted code — it's a footgun. If you have it in any of your workflows, replace it with `pull_request` or at minimum ensure you never check out the PR head when running with secrets. Search your repos now:

```bash
grep -r "pull_request_target" .github/workflows/
```

**Audit your workflows with zizmor.** Rather than relying on manual grep checks, run zizmor across your workflows. It catches unpinned actions, dangerous triggers like `pull_request_target`, template injection risks, and more. This is what I used to harden my workflows before this incident, and it's the quickest way to find the issues that matter.

**Review your dependencies.** GitHub's dependency-review-action runs on pull requests and flags new dependencies with known vulnerabilities before they're merged. It's another layer that helps catch problems before they reach your main branch.

## The bigger picture

This wasn't an isolated event. Supply chain attacks are evolving: from SolarWinds (2020, nation-state, 9-month stealth) to Codecov (2021) to tj-actions (2025) to this. The pattern is getting faster, more automated, and now self-propagating.

The Trivy compromise is particularly notable because it spawned a worm. Stolen npm tokens were used to automatically publish backdoored versions of 66+ packages, which in turn stole more tokens and propagated further. That's a new capability we haven't seen before in this space.

GitHub Actions has architectural problems that make this class of attack easy: mutable tags with no transparency logs, overpermissive default `GITHUB_TOKEN` permissions on pre-2023 repos, the dangerous `pull_request_target` trigger, and no formal publication controls for Actions.

Until GitHub makes secure defaults the norm rather than the opt-in, the responsibility falls on us as users to pin our actions, monitor our CI/CD, and keep our secrets out of environment variables.

## Resources

- [Aqua Security: Trivy Supply Chain Attack — What You Need to Know](https://www.aquasec.com/blog/trivy-supply-chain-attack-what-you-need-to-know/)
- [GitHub Advisory: GHSA-69fq-xp46-6x23](https://github.com/advisories/GHSA-69fq-xp46-6x23)
- [StepSecurity: trivy-compromise-scanner](https://github.com/step-security/trivy-compromise-scanner)
- [SANS: When the Security Scanner Became the Weapon](https://www.sans.org/webcasts/when-security-scanner-became-weapon/) — webcast covering the full attack chain
- [Semgrep: The TeamPCP Credential Infostealer Chain Attack Reaches Python's LiteLLM](https://semgrep.dev/blog/2026/the-teampcp-credential-infostealer-chain-attack-reaches-pythons-litellm/)
- [GitGuardian: Trivy's March Supply Chain Attack Shows Where Secret Exposure Hurts Most](https://blog.gitguardian.com/trivys-march-supply-chain-attack-shows-where-secret-exposure-hurts-most/)

*This post was written with the help of Claude.*
