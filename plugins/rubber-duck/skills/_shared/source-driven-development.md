# Source-Driven External API Checks

When a change depends on framework, library, cloud, browser, operating-system, protocol, or third-party API behavior, verify that behavior before encoding it in a plan, implementation, or review.

Use the strongest available source:

- Existing code and tests in the repository.
- Local package source, type definitions, generated clients, schemas, or vendored docs.
- Official documentation for the framework, library, service, or API.
- Release notes or migration guides when version-specific behavior matters.

Do not rely on memory for behavior that may have changed or is version-sensitive.

Record uncertainty when verification is unavailable:

- What behavior is assumed.
- Which package/service/version appears relevant.
- What focused test, manual check, or human confirmation should validate it.

Prefer source-driven checks for:

- Public API contracts and SDK method shapes.
- Framework routing, rendering, caching, lifecycle, and error behavior.
- Authentication, authorization, webhook, storage, and network integrations.
- Migration, deprecation, compatibility, and rollout behavior.
- Security-sensitive parsing, escaping, validation, logging, and secret handling.
