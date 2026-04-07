---
title: "Assessing Post-Quantum Cryptography Readiness"
description: "A practical guide to evaluating your exposure to quantum threats and planning the migration to post-quantum cryptographic standards."
publishDate: "2026-04-07"
tags: ["cyber-security", "cryptography", "pqc"]
---

Quantum computers capable of breaking RSA and elliptic-curve cryptography don't exist yet. But the threat they pose is already real — and if you handle anything sensitive, waiting for Q-Day is too late to start preparing.

This post covers what post-quantum cryptography (PQC) is, why the timeline matters now, and how to run a practical readiness assessment for your systems.

## Why this matters today

The core problem is "harvest now, decrypt later" (HNDL). Adversaries — particularly state-level actors — are already collecting encrypted traffic with the expectation that future quantum computers will decrypt it. If the data you're protecting today still has value in 10–15 years (medical records, legal documents, trade secrets, national security), it's already at risk.

NIST estimates that a cryptographically relevant quantum computer (CRQC) could arrive between the early 2030s and mid-2040s. The US Government set a hard deadline: federal agencies must migrate to PQC by 2035. CNSA 2.0 timelines are even more aggressive for national security systems, with some requirements starting in 2025.

The migration itself will take years. Cryptographic transitions always do — we're still finding SHA-1 and 3DES in production systems decades after they were deprecated. Starting the assessment now is not premature; it's overdue.

## The new standards

In August 2024, NIST published three post-quantum standards. A fourth followed in March 2025:

- **ML-KEM** (FIPS 203) — key encapsulation based on Module-Lattice (formerly CRYSTALS-Kyber). This is the primary replacement for key exchange in TLS, VPNs, and anywhere you establish shared secrets.
- **ML-DSA** (FIPS 204) — digital signatures based on Module-Lattice (formerly CRYSTALS-Dilithium). The general-purpose replacement for RSA and ECDSA signatures.
- **SLH-DSA** (FIPS 205) — stateless hash-based signatures (formerly SPHINCS+). A conservative backup that relies only on hash function security — useful where you want defence in depth against lattice breakthroughs.
- **HBS** (FIPS 208) — stateful hash-based signatures (LMS and XMSS), published March 2025. Suitable for firmware signing and other use cases where state management is feasible.

For most organisations, ML-KEM and ML-DSA are the two that matter immediately.

## Running a PQC readiness assessment

A readiness assessment doesn't require quantum expertise. It's fundamentally a cryptographic inventory exercise with a migration lens. Here's how to approach it.

### 1. Build a cryptographic inventory

You can't migrate what you can't find. Catalogue every place your systems use cryptography:

- **TLS connections** — what cipher suites are negotiated? Check web servers, APIs, databases, message brokers, service-to-service communication.
- **Certificates** — what signature algorithms are your CA chains using? RSA-2048? ECDSA P-256?
- **VPN tunnels** — what key exchange and authentication algorithms are configured?
- **Code signing** — what algorithms sign your binaries, containers, packages?
- **Data at rest** — what encryption protects stored data? AES-256 is quantum-resistant; the key wrapping and key exchange around it probably isn't.
- **SSH keys** — what key types are in your `~/.ssh/` and `authorized_keys`?
- **Protocols and libraries** — what cryptographic libraries do your applications link against? What versions?

Tools that can help: `openssl s_client` for TLS inspection, `ssh -Q key` for supported SSH key types, `nmap --script ssl-enum-ciphers` for server cipher enumeration, and commercial tools like Venafi or Keyfactor for certificate inventory at scale.

### 2. Classify data by sensitivity lifetime

Not everything needs to migrate at the same pace. Prioritise based on how long the data needs to stay confidential:

- **High priority** — data with long confidentiality requirements (health records, legal, financial, IP, government). These are HNDL targets today.
- **Medium priority** — data that's sensitive now but not in a decade (session tokens, short-lived credentials). Still needs migration, but less urgently.
- **Lower priority** — integrity-only use cases (code signing, authentication). These only become vulnerable once a CRQC actually exists, since the attack requires real-time computation.

### 3. Assess your supply chain

Your own code is only part of the picture:

- **Cloud providers** — are your providers offering PQC options? AWS KMS supports ML-KEM for key exchange. Cloudflare has been running PQC key agreement in TLS since late 2024. Google Cloud offers PQC in Cloud KMS.
- **TLS libraries** — OpenSSL 3.5 (April 2025) added ML-KEM and ML-DSA support. BoringSSL and AWS-LC have had hybrid support for longer. Check what your applications actually link against.
- **Certificate authorities** — your CA will need to issue PQC or hybrid certificates eventually. Check their roadmap.
- **Hardware** — HSMs, smart cards, and embedded devices may need firmware updates or replacement to support PQC algorithms.

### 4. Test hybrid deployments

The migration path is not a hard cutover. The industry consensus is hybrid mode: combining a classical algorithm with a post-quantum algorithm so that security is maintained even if one of them breaks.

For TLS, this is already happening. Chrome and Firefox negotiate `X25519Kyber768` (now `X25519MLKEM768`) hybrid key exchange by default. If you run web servers, check whether your TLS stack supports these:

```bash
# Check if a server supports hybrid PQC key exchange
openssl s_client -connect example.com:443 -groups X25519MLKEM768
```

For SSH, OpenSSH 9.x added hybrid key exchange using `sntrup761x25519-sha512@openssh.com`. If you're running a recent version, you may already be using PQC for key exchange without realising it:

```bash
# Check your SSH connection's key exchange algorithm
ssh -v yourserver 2>&1 | grep "kex:"
```

### 5. Identify blockers

Common issues that stall PQC migration:

- **Larger key and signature sizes** — ML-KEM public keys are ~1,200 bytes vs 32 bytes for X25519. ML-DSA signatures are ~2,400–4,600 bytes vs 64 bytes for Ed25519. This affects constrained environments, certificate chains, and protocols with tight size limits.
- **Performance** — ML-KEM is actually faster than ECDH for key exchange. But ML-DSA signature verification is slower than Ed25519, and certificate chain validation multiplies the cost.
- **Protocol limitations** — DNSSEC, some IoT protocols, and older embedded systems may struggle with PQC key/signature sizes.
- **Compliance and certification** — regulated industries need validated implementations. NIST's CMVP is working on validating PQC modules, but the queue takes time.

### 6. Write a migration roadmap

Based on your inventory and priorities:

1. Enable hybrid PQC key exchange in TLS where your stack supports it (this is often just a configuration change).
2. Rotate SSH keys to use hybrid or PQC-capable algorithms.
3. Engage your cloud and CA providers on their PQC timelines.
4. Plan hardware refresh cycles to include PQC support requirements.
5. Update procurement language to require PQC capability in new systems.
6. Set target dates aligned with CNSA 2.0 or your industry's regulatory guidance.

## What I'm doing

For this site specifically, the exposure is minimal — it's a static site served over Cloudflare, which already negotiates hybrid PQC key exchange for TLS by default. Visitors with modern browsers are already getting post-quantum key agreement without any action on my part.

But a personal site is not where the real work is. For professional environments, I'm advising teams to:

- Start the cryptographic inventory now, even if migration is years away. The inventory is the hardest part and it's never too early.
- Enable hybrid TLS key exchange on anything internet-facing. It's low risk and high value against HNDL.
- Watch OpenSSL 3.5 adoption and plan library upgrades.
- Treat PQC migration as a multi-year programme, not a single project. Get it on the roadmap and into procurement requirements.

The quantum threat is not a sudden cliff — it's a slow tide. The organisations that start assessing now will migrate smoothly. The ones that wait will be scrambling to replace cryptographic foundations under pressure, the same way too many scrambled with SHA-1 deprecation years after the writing was on the wall.

## Further reading

- [NIST Post-Quantum Cryptography Standards](https://csrc.nist.gov/projects/post-quantum-cryptography) — the primary source for FIPS 203, 204, 205, and 208.
- [CISA Post-Quantum Cryptography Initiative](https://www.cisa.gov/quantum) — US government guidance and migration resources.
- [Cloudflare: Post-Quantum Key Agreement](https://blog.cloudflare.com/post-quantum-to-origins/) — how Cloudflare deploys PQC in production.
- [CNSA 2.0 Algorithm Guidance](https://media.defense.gov/2022/Sep/07/2003071834/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS_.PDF) — NSA's timeline for national security systems.
