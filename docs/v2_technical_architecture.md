# V2 Technical Architecture

This document defines the recommended architecture for the Scarlette Interview Recorder V2 rebuild. It is intentionally written before implementation. No build tools, frameworks, or runtime features are added by this document.

Related documents:

- [V2 Product Specification](v2_product_spec.md)
- [V2 Data Model](v2_data_model.md)
- [V2 Implementation Plan](v2_implementation_plan.md)
- [V2 Test Strategy](v2_test_strategy.md)
- [Known Risks](known_risks.md)

## Current Architecture Audit

Current V1 state:

- [src/index.html](../src/index.html) is a single embedded HTML/CSS/JavaScript app.
- Templates, rendering, event handling, recording, dictation, persistence, export, and service worker registration all live in one file.
- Session state is serialized into `localStorage`.
- Audio blobs are held in memory and object URLs. Only metadata survives reload.
- Browser speech recognition is detected and used directly when available.
- The service worker uses a cache-first strategy and `skipWaiting()`/`clients.claim()`.

This is acceptable for a prototype, but it creates maintenance and reliability risks for V2.

## Recommended App Structure

V2 should separate product concerns into modules. A suggested source structure:

```text
src/
|-- index.html
|-- main.ts
|-- app/
|   |-- appState.ts
|   |-- router.ts
|   |-- events.ts
|   `-- errors.ts
|-- templates/
|   |-- templateRegistry.ts
|   `-- workflowDiscoveryTemplates.ts
|-- capture/
|   |-- captureSession.ts
|   |-- captureViews.ts
|   |-- consent.ts
|   |-- inputStrategy.ts
|   `-- reviewRules.ts
|-- storage/
|   |-- db.ts
|   |-- repositories.ts
|   |-- migrations.ts
|   |-- quota.ts
|   `-- exportImport.ts
|-- audio/
|   |-- audioRecorder.ts
|   |-- audioRepository.ts
|   `-- audioSupport.ts
|-- pwa/
|   |-- registerServiceWorker.ts
|   |-- updatePrompt.ts
|   `-- installState.ts
|-- ui/
|   |-- components.ts
|   |-- forms.ts
|   |-- layout.ts
|   `-- accessibility.ts
|-- styles/
|   |-- base.css
|   |-- layout.css
|   |-- components.css
|   `-- capture.css
`-- types/
    |-- domain.ts
    `-- storage.ts
```

The exact structure can change during implementation, but these boundaries should remain:

- Domain data is separate from rendered HTML.
- Storage code is separate from UI event handlers.
- Audio code is isolated and optional.
- PWA install/update code is isolated.
- Review rules are testable without DOM setup.
- Export/import code uses domain objects rather than scraping rendered text.

## Static PWA Model

V2 should remain a static PWA at runtime:

- no backend
- no server-side rendering
- no account service
- no cloud database
- no API dependency for normal capture
- deployable as static files over HTTPS

The app can use a build step during development if the build output remains static files that can be hosted on GitHub Pages, Cloudflare Pages, Netlify, or equivalent static hosts.

## Build Setup Recommendation

Recommendation: move V2 development to a lightweight Vite + TypeScript setup, but keep runtime deployment static.

Do not install tools in this documentation task. This is a future implementation decision captured here for planning.
No package manager, framework, or build configuration is approved or added by Phase 0 documentation alone. A later implementation phase must choose the build setup explicitly before creating package or build files.

### Option A: Continue No-Build Static HTML/JS/CSS

Benefits:

- simplest deployment model
- no package manager needed for development
- easy to inspect directly in a browser
- fewer dependency risks

Costs:

- the current app is already 2,910 lines in one HTML file
- hard to test domain logic without the DOM
- weak type safety for storage migrations and export shapes
- higher risk of regressions when modifying capture, audio, and archive logic
- harder for external reviewers to understand ownership boundaries

### Option B: Vite + TypeScript With Static Output

Benefits:

- modular code without changing the user access model
- TypeScript types for schema, migrations, exports, and repository methods
- easier unit tests for review rules, data migrations, and export builders
- easier future split between capture UI, storage, audio, and PWA update handling
- standard static deployment output

Costs:

- introduces development dependencies and package manager files
- requires a documented build/deploy command for developers
- requires dependency maintenance
- must avoid creating a runtime server expectation for normal users

### Decision Direction

Use Vite + TypeScript for V2 development unless a later implementation spike shows that the dependency cost is not justified. The access model remains unchanged: normal users use the hosted PWA and never run package commands.

## Access Layer

The normal user access path is:

Hosted HTTPS URL -> browser install prompt or Add to Home Screen -> launch installed PWA.

Current V1 hosted URL:

```text
https://novaai01.github.io/scarlette-interview-recorder/
```

V2 must preserve this hosted static access model. If the deployment URL changes, README and release verification must be updated together.

Requirements:

- The root hosted URL must reach the app.
- The manifest must use stable scope and start URL values.
- The app must work without localhost.
- The README must identify the live URL once deployment is known.
- Local server commands are only for development and verification.

## Service Worker And Update Strategy

The current cache-first service worker can leave installed users on stale versions if update flow is not visible. V2 should use an explicit update strategy:

- Version the app shell and schema independently.
- Precache only the app shell and required static assets.
- Prefer network-first or stale-while-revalidate for HTML/app shell requests when online.
- Provide an in-app "Update available" prompt when a new service worker is waiting.
- Avoid silently replacing code during an active interview.
- Apply updates on user confirmation or on next clean launch.
- Record the app version used to create and last edit each session.
- Keep old schema migrations available until all supported sessions can migrate.
- Provide a visible fallback when the service worker fails to register.

Recommended behavior:

- During active capture, do not force refresh.
- On template list/archive screen, prompt to update when a new app shell is ready.
- After update, reload once and confirm the displayed app version changed.

## Storage Architecture

V2 must use IndexedDB for durable local archive data. `localStorage` may be used only for lightweight preferences such as last selected view, theme, dismissed notices, or dev flags.

Recommended stores:

- `app_metadata`
- `templates`
- `sessions`
- `participants`
- `questions`
- `answers`
- `follow_up_answers`
- `audio_recordings`
- `export_bundles`
- `migration_log`

Storage requirements:

- Store structured answers separately from transient UI state.
- Store each session with a schema version and app version.
- Write small updates frequently.
- Use transactions for multi-record changes.
- Keep audio blobs in a separate store from text evidence.
- Track storage estimate/quota where supported.
- Warn users before storage pressure becomes critical.
- Handle IndexedDB open/migration failures with a clear export/retry path.

## Export Architecture

Exports are deliberate user actions. V2 should support:

- single-session JSON export
- single-session Markdown export
- full local archive export
- import from a prior V2 export
- optional audio export when audio backup exists

Recommended export bundle structure:

```text
scarlette-export-<date>-<session-or-archive>.zip
|-- manifest.json
|-- sessions/
|   `-- <session-id>.json
|-- markdown/
|   `-- <session-id>.md
`-- audio/
    `-- <audio-id>.<ext>
```

If zip generation is deferred, V2 can initially export JSON/Markdown and audio files separately, but the data model should still support bundle metadata.

iPhone export constraints:

- Multiple automatic downloads may be awkward or blocked.
- Prefer one explicit bundle download when possible.
- If multiple files are unavoidable, show a clear sequence and user-controlled buttons.
- Always report whether audio is included, unavailable, or deferred.

## Audio Strategy

Audio backup is optional and secondary to structured text evidence. It should not block the core capture flow.

V2 has two acceptable paths:

1. Persist audio blobs in IndexedDB with size/quota warnings and export support.
2. Defer audio backup from the first V2 release until persistence and export are reliable.

If audio backup remains in V2, requirements are:

- Explicit consent/capture acknowledgement before recording.
- Browser support detection before showing recording actions.
- Microphone permission errors are recoverable.
- One active recording at a time.
- Recording state survives navigation constraints.
- Completed blobs are saved to IndexedDB, not just memory.
- Audio is linked to session/question/answer records.
- Export includes or clearly excludes audio by user choice.
- Storage usage and file sizes are visible.
- The app handles unavailable codecs across Safari/Chrome/Edge.

The app must never imply that audio is safely archived unless the blob is actually persisted.

## Input And Dictation Strategy

V2 input strategy is textarea-first:

- All evidence fields are ordinary editable textareas.
- Typing, paste, and mobile keyboard dictation are primary input paths.
- Autosave happens on text input.
- Focus is stable and predictable on phone screens.
- Textareas have enough height and tap area for live interview use.

iPhone strategy:

- Do not call browser `SpeechRecognition` on iPhone.
- Do not show browser speech recognition as the primary path on iPhone.
- In product copy and test plans, direct users to tap the textarea and use the native iPhone keyboard microphone.
- Treat inserted dictated text the same as typed text.

Future desktop/Android browser speech enhancement:

- Feature-detect support.
- Keep it optional and field-scoped.
- Add timeout and abort controls.
- Never block manual input.
- Never block navigation permanently.
- Disable automatically in contexts known to freeze or behave unreliably.

## Consent Strategy

V2 must add explicit consent/capture acknowledgement before note capture or recording.

Minimum consent model:

- Show a clear capture notice before starting a session.
- Capture acknowledgement timestamp, app version, and session ID.
- Distinguish note capture from audio recording consent.
- Require a separate explicit action before enabling audio recording.
- Store consent records locally with the session.
- Include consent metadata in exports.

This is not a substitute for legal policy, but the app must make the capture state explicit.

## Error Handling Strategy

Errors should be visible, recoverable, and specific.

Required error categories:

- IndexedDB unavailable
- storage quota near full
- storage write failed
- migration failed
- microphone permission denied
- microphone unavailable
- audio codec unsupported
- audio blob save failed
- export failed
- import failed
- stale app version detected
- service worker update failed
- unsupported browser feature

Error handling rules:

- Preserve already captured text whenever possible.
- Offer export before destructive recovery actions.
- Do not hide errors in `console.warn` only.
- Avoid blocking manual text input because optional audio or dictation failed.
- Use confirmations for destructive actions such as deleting a session.

## Future Extension Points

Design extension points, but do not implement deferred product features early. These are not approved V2 release features:

- Template authoring/import
- Follow-up interview builder
- Manual evidence tagging
- Redaction before export
- Archive search/filter
- Optional encrypted local archive
- Cloud sync only after a future explicit architecture, privacy, and product decision
- AI extraction, scoring, summaries, proposal generation, or recommendations only after a future explicit product and privacy decision

Any future AI or cloud feature must preserve the raw evidence archive and require a separate privacy/storage decision.
