# Application security source ledger

Use primary standards and platform/provider documentation. These links anchor control intent; they do not override the repository's installed versions, deployment topology, or specialist skills.

Last source check: 2026-10-02.

## Freshness rule

Application frameworks, provider signature formats, browser behavior, cryptographic recommendations, security headers, package-manager audit output, and CI features are volatile. Before giving exact configuration or API syntax, check the installed version and retrieve its current official documentation. Record the version/date in findings. Never infer a provider command, header directive, algorithm, or framework option from this ledger alone.

When citing OWASP ASVS, include the release in the identifier (for example, `v5.0.0-x.y.z`) because requirement numbering can change.

## Baseline standards and testing

- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/) — current stable verification requirements and versioned requirement identifiers.
- [OWASP ASVS official repository](https://github.com/OWASP/ASVS) — release artifacts, machine-readable requirements, and version history.
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) — authorized verification techniques and test categories.
- [OWASP ASVS project page](https://owasp.org/www-project-application-security-verification-standard/) — states 5.0.0 as the latest stable release (accessed 2026-10-02).
- [OWASP Top 10:2025](https://top10.owasp.org/2025) — A01 Broken Access Control, A02 Security Misconfiguration, A03 Software Supply Chain Failures, A04 Cryptographic Failures, A05 Injection, A06 Insecure Design, A07 Authentication Failures, A08 Software or Data Integrity Failures, A09 Security Logging and Alerting Failures, A10 Mishandling of Exceptional Conditions (accessed 2026-10-02). Supersedes the 2021 list; old `A0x:2021` IDs do not map one-to-one.
- [OWASP API Security Top 10](https://api-security.owasp.org/) — 2023 is still the latest edition (accessed 2026-10-02): API1 BOLA, API2 Broken Authentication, API3 Broken Object Property Level Authorization, API4 Unrestricted Resource Consumption, API5 BFLA, API6 Unrestricted Access to Sensitive Business Flows, API7 SSRF, API8 Security Misconfiguration, API9 Improper Inventory Management, API10 Unsafe Consumption of APIs.
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) — concise defensive implementation guidance. Retrieve the relevant sheet rather than relying on memory.
- [NIST Secure Software Development Framework, SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final) — secure-development practices and supply-chain context.

ASVS is a requirements catalog, WSTG is a verification guide, and the Top 10 projects are awareness/prioritization aids. None is a substitute for tracing the application's actual trust boundary.

## LLM and agent features

- [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/llm-top-10/) — LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure, LLM03 Supply Chain, LLM04 Data and Model Poisoning, LLM05 Improper Output Handling, LLM06 Excessive Agency, LLM07 System Prompt Leakage, LLM08 Vector and Embedding Weaknesses, LLM09 Misinformation, LLM10 Unbounded Consumption (accessed 2026-10-02).
- [OWASP Top 10 for Agentic Applications for 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) — published 2025-12-09; ASI01–ASI10 cover agent goal hijack, tool misuse, identity/privilege abuse, agentic supply chain, unexpected code execution, memory/context poisoning, insecure inter-agent communication, cascading failures, human-agent trust exploitation, rogue agents (accessed 2026-10-02; entry names confirmed via secondary summaries, download the PDF for exact wording before citing).
- [OWASP LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

## Borrowed methodology

- [Trail of Bits skills](https://github.com/trailofbits/skills) (CC BY-SA 4.0, accessed 2026-10-02) — `insecure-defaults` (refute each fail-open candidate before reporting) and `variant-analysis` (search for the same root pattern after a confirmed finding). Paraphrased into the inspect-first workflow; no text copied. Also `supply-chain-risk-auditor` (unassessable data is not a verdict) paraphrased into `references/supply-chain.md` (accessed 2026-10-08).
- [getsentry/skills `secret-serialization`](https://github.com/getsentry/skills) (Apache-2.0, accessed 2026-10-08) — holder/sink model for credentials leaking through whole-object serialization; paraphrased into the sink table.

## Threat modeling, identity, and authorization

- [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP IDOR Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)
- [OWASP Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
- [OWASP Transaction Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html)

Use these to distinguish identity from permission, place object/function checks at the authoritative server boundary, constrain writable fields, and protect approvals. Tenant isolation is an authorization invariant across every storage, cache, queue, search, file, and export path—not a single middleware checkbox.

## Validation, encoding, and injection

- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [OWASP OS Command Injection Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)
- [OWASP Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html)
- [OWASP Prototype Pollution Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html)

Validation constrains the data contract; parameterization or context-specific output handling protects the sink. Do not claim that a generic sanitizer solves SQL, command, template, URL, HTML, and log contexts.

## Network requests, files, and webhooks

- [OWASP SSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [GitHub: Validating webhook deliveries](https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries) — an official example of raw-body MAC verification and constant-time comparison; use only for GitHub's format.
- [Stripe webhook documentation](https://docs.stripe.com/webhooks) — Stripe signature, retry, ordering, and duplicate-event behavior; implementation belongs to `stripe-best-practices`.

Webhook formats are provider-specific. Always retrieve the exact provider and SDK version documentation. Do not generalize GitHub or Stripe header names, timestamp rules, or algorithms to another provider.

## Sessions, browser boundaries, and headers

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [MDN CORS guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) — current browser request/response behavior.
- [MDN Set-Cookie reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie) — cookie attribute behavior and prefix requirements.
- [W3C Content Security Policy Level 3](https://www.w3.org/TR/CSP3/) — normative CSP processing model.

Framework/auth documentation owns exact cookie and CSRF APIs. Verify headers on the final browser-visible response because a CDN, proxy, static asset layer, or error handler can add, replace, or omit them.

## Secrets, cryptography, supply chain, and abuse

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP Denial of Service Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
- [OpenSSF Scorecard](https://scorecard.dev/) — dependency-project security signals; signals require context and are not vulnerability proof.
- [SLSA specification](https://slsa.dev/spec/) — build provenance and supply-chain integrity levels.
- [Supabase: npm security](https://supabase.com/docs/guides/security/npm-security) — package-manager install hardening settings (release age, script allowlists, exotic subdeps, trust policy); paraphrased into `references/supply-chain.md` (accessed 2026-10-08).
- [Spracklen et al., package hallucinations by code LLMs](https://arxiv.org/abs/2406.10279) — measured hallucinated package-name rates; basis for the new-package existence gate.
- [gitleaks](https://github.com/gitleaks/gitleaks), [OSV-Scanner](https://google.github.io/osv-scanner/) — pre-commit secret and dependency-advisory scanners used in `references/verification.md`.
- [GitHub dependency review documentation](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review) — GitHub-native pull-request dependency review; workflow details belong to `github-actions`.

Use the application's auth owner for password/session algorithms, the platform owner for secret stores, and `github-actions` for CI permissions and provenance. Advisory presence, package age, or a low project score does not prove application exploitability; establish reachability and affected behavior.

## Logging and errors

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [OWASP Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html)

Log security decisions without credentials, tokens, signature material, or unnecessary personal data. Client errors should be stable and minimal; protected server telemetry should retain enough context and a correlation identifier to investigate.
