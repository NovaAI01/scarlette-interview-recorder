# ADR-0003: IndexedDB For Session Archive

Status: Accepted

## Context

The V1 prototype stores the active interview session in `localStorage`. This is sufficient for a prototype but not for a scalable local archive. `localStorage` is synchronous, limited, string-only, poorly suited to larger structured archives, and cannot reliably store audio blobs.

V2 needs multiple saved sessions, structured answers, optional audio backup persistence, schema versioning, export/import, and migration support.

## Decision

V2 will use IndexedDB as the primary local persistence layer for interview data.

IndexedDB will store:

- app metadata
- interview templates
- interview sessions
- participants/contacts
- session question snapshots
- answers
- follow-up answers
- optional audio recording blobs and metadata
- export bundle metadata
- migration records

`localStorage` may only be used for lightweight UI preferences and must not be used for interview evidence.

## Consequences

Positive consequences:

- Supports multiple archived sessions.
- Supports structured records and indexes.
- Supports blob storage for optional audio backup.
- Enables schema versioning and migrations.
- Provides a better foundation for export/import.

Negative consequences:

- IndexedDB code is more complex than `localStorage`.
- Browser storage can still be evicted or cleared.
- Migrations require careful testing.
- Audio blobs can still pressure storage quota.
- Private browsing and older browsers may behave differently.

