# Jurisdiction and Cross-Border Resolver

This is an engineering applicability aid, not legal, tax, privacy, or certification advice. Identify triggers, retrieve current authoritative sources, and require qualified owners to decide applicability.

## Starter authorities

| Candidate | Current official starting point | Engineering concern |
|---|---|---|
| Indonesia | [UU 27/2022](https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022) | Roles, rights, security, incidents, retention, and transfer outside Indonesia; verify implementing rules |
| EU/EEA | [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj) | Establishment, offering/monitoring, controller/processor duties, rights, Chapter V transfers |
| EU AI | [Regulation 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) | Provider/deployer role, risk class, transparency, technical evidence, phased dates |
| US | [FTC privacy/security guidance](https://www.ftc.gov/business-guidance/privacy-security) | Federal/sector obligations and representations; add exact state authority |
| California | [CPPA laws and regulations](https://cppa.ca.gov/regulations/) | Thresholds, rights, opt-outs, ADMT, risk/cybersecurity rules, effective dates |
| UK | [ICO international transfers](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/) | Restricted-transfer test, adequacy, safeguards, exceptions, UK-specific assessment |
| Singapore | [PDPC obligations](https://www.pdpc.gov.sg/overview-of-pdpa/the-legislation/personal-data-protection-act/data-protection-obligations) | Purpose, protection, retention, rights, breach, overseas transfer limitation |
| Canada | [PIPEDA](https://laws-lois.justice.gc.ca/ENG/ACTS/P-8.6/index.html) | Federal/provincial/sector scope, safeguards, access, breach, accountability |
| Brazil | [ANPD LGPD publication](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/outros-documentos-e-publicacoes-institucionais/lgpd-en-lei-no-13-709-capa.pdf/@@display-file/file) | Territorial scope, bases, rights, incidents, transfers; Portuguese original controls |
| Australia | [OAIC Privacy Act](https://www.oaic.gov.au/privacy/privacy-legislation/the-privacy-act) | APP scope, cross-border disclosure, breach, health/credit/state overlays |
| Japan | [Japan PPC](https://www.ppc.go.jp/en/) | APPI scope, sensitive data, third-party provision, transfers, current reform status |

These are starter sources, not a global law database. For any other territory or sector, use its official regulator, legislature, gazette, or court source. The offline provenance ledger lives at `assets/sources.json`; run `python3 scripts/audit-sources.py` to flag missing, stale, or superseded records without network credentials or silent requirement changes.

## Applicability record

```markdown
### JUR-<code>-<n> — <decision>
- Trigger facts: CTX-*
- Authority/source: <official URL, section, version/status>
- Publication/effective/retrieval dates: <dates>
- Decision: Applies | Does not apply | Unknown
- Qualified owner: <legal/privacy/tax/security role>
- Engineering impact: PRIV-*, SEC-*, LOC-*, API-*, DATA-*
- Recheck trigger: <event/date>
```

## Transfer record

Record exporter/importer legal roles and locations, data subjects/categories, purpose, storage and remote access, mechanism review, safeguards, onward transfers, retention/deletion, evidence, owner, and status. A database staying in one region does not eliminate transfers caused by support access, logs, analytics, backups, email, subprocessors, or model APIs. Do not reuse an EU transfer mechanism as proof for UK, Indonesia, or another jurisdiction.

## Localization contract

Use explicit locale identifiers and fallback. Test Unicode/normalization, pluralization, text expansion, RTL, flexible names/addresses/phones/postcodes, timezone/DST/calendar, numbers, ISO currency/minor units/rounding/tax/FX, units, regional content, legal copy, and accessibility. Indonesian content uses Bahasa Indonesia, not Malay; technical English remains when it improves precision.
