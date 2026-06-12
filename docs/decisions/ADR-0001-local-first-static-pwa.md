# ADR-0001: Local-First Static PWA

Status: Accepted

## Context

Scarlette Interview Recorder is intended for structured workflow-discovery interview capture. The current prototype is a static PWA with no backend and works from hosted static files. The V2 product direction needs a clear access and privacy boundary before implementation.

Normal users must not need a terminal, localhost, port numbers, package commands, local servers, or background services. Interview data may be sensitive and should not be uploaded by default.

## Decision

V2 will remain a local-first static PWA at runtime.

Normal use will be:

Hosted HTTPS URL -> Install PWA -> Launch from icon.

V2 will not add backend storage, accounts, authentication, cloud upload, cloud sync, or server-side processing without a future explicit decision.

Development may use a lightweight build setup if needed, but the deployed runtime must remain static files that can be hosted over HTTPS.

## Consequences

Positive consequences:

- Simple user access model.
- Strong local-first privacy position.
- No operational backend to maintain.
- Static hosting remains inexpensive and portable.
- The app can work offline after the first successful load.

Negative consequences:

- No account recovery if browser storage is cleared.
- No cross-device sync.
- Browser storage limits and eviction remain user/device risks.
- Export/import must carry the burden of deliberate sharing and backup.
- Future cloud sync would require a separate product, privacy, and architecture decision.

