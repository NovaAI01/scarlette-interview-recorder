# Known Risks

This register captures product and engineering risks for Scarlette Interview Recorder V2. It should be updated as implementation decisions are made.

Related documents:

- [V2 Product Specification](v2_product_spec.md)
- [V2 Technical Architecture](v2_technical_architecture.md)
- [V2 Data Model](v2_data_model.md)
- [V2 Test Strategy](v2_test_strategy.md)

## iOS PWA Quirks

Risk:

iPhone Safari and Home Screen PWAs can differ in storage behavior, viewport behavior, install behavior, file handling, keyboard behavior, and media permissions.

Mitigations:

- Treat iPhone Home Screen PWA testing as a release gate.
- Keep text input textarea-first.
- Avoid relying on browser `SpeechRecognition` on iPhone.
- Test hosted HTTPS, not only localhost.
- Keep controls visible above safe areas and keyboard changes.
- Document known iOS limitations in README/release notes.

## SpeechRecognition Unreliability

Risk:

Browser Web Speech API recognition varies by browser and can be unavailable, network-dependent, permission-sensitive, or unstable. On iPhone it can freeze or fail in ways that harm live capture.

Mitigations:

- Make native keyboard dictation and typing the primary input methods.
- Do not call browser `SpeechRecognition` on iPhone.
- Keep future browser speech controls optional and disableable.
- Add timeout/abort handling before reintroducing browser speech enhancement.
- Never block manual text input when dictation fails.

## Browser And Native Dictation Processing

Risk:

Browser speech recognition and native keyboard dictation may involve browser, operating-system, or vendor processing outside the app's control. The app only receives inserted text after the platform returns it.

Mitigations:

- Do not claim the app controls or audits vendor dictation processing.
- Keep typing and paste fully supported.
- Direct iPhone users to native keyboard dictation as the reliability target, not as an app-controlled privacy guarantee.
- Document that users remain responsible for following browser, device, and organizational dictation policy.

## Microphone Permissions

Risk:

Microphone permission may be denied, unavailable, revoked, or different between Safari, installed PWA, and desktop browsers.

Mitigations:

- Request microphone only when the user starts optional audio recording.
- Show specific permission recovery messages.
- Keep audio optional.
- Require explicit audio consent acknowledgement.
- Verify denied-permission paths in release testing.

## IndexedDB And Browser Storage Eviction

Risk:

IndexedDB is more appropriate than `localStorage`, but browser storage can still be cleared by the user, private browsing, device storage pressure, browser policy, or site data cleanup.

Mitigations:

- Use IndexedDB for sessions, answers, and audio blobs if optional audio remains in scope.
- Show local-first storage limitations clearly.
- Provide export/import.
- Warn when storage estimate/quota indicates pressure.
- Avoid claiming account recovery or cloud backup.
- Include storage persistence tests in release checklist.

## Audio Storage Size

Risk:

Audio blobs can become large and may exhaust browser storage, especially on phones. Large audio exports can be awkward on iPhone.

Mitigations:

- Keep audio optional and secondary.
- Store audio in a separate IndexedDB object store.
- Show size/duration metadata.
- Add recording length guidance or limits.
- Warn on quota pressure.
- Prefer a single export bundle where possible.
- Defer audio from first V2 release if persistence/export is not reliable.

## Sensitive Interview Data

Risk:

Interview evidence can include personal data, commercially sensitive workflow details, operational weaknesses, and employee comments.

Mitigations:

- Keep data local-first by default.
- Do not add backend/cloud/account storage without a future explicit decision.
- Add consent/capture acknowledgement.
- Include privacy model in README and docs.
- Remind users that exported files are outside app control.
- Avoid analytics or telemetry that could capture interview content.

## Stale Service Worker Cache

Risk:

Installed PWAs can keep running stale cached code, causing users to miss fixes or schema changes.

Mitigations:

- Use explicit app and schema versions.
- Add visible update prompt.
- Do not force reload during active capture.
- Test update flow before release.
- Keep service worker cache strategy documented.
- Include stale-version recovery in release checklist.

## Accidental Deletion

Risk:

Users may clear a session, delete local site data, overwrite audio, or remove exports unintentionally.

Mitigations:

- Confirm destructive actions.
- Prefer soft deletion for local sessions.
- Warn before replacing audio.
- Provide export prompts before destructive recovery.
- Document that browser site data deletion cannot be recovered locally.

## Export Handling

Risk:

Exports can be incomplete, hard to find on phones, blocked by browser download rules, or mishandled after download.

Mitigations:

- Make export status explicit.
- Prefer one user-initiated archive bundle when possible.
- Include a manifest with schema/app version and audio inclusion status.
- Test iPhone export/share behavior.
- Clearly state that exported files are outside app control.

## Future Cloud Sync Risks

Risk:

Cloud sync would change the privacy, security, consent, identity, retention, and compliance model. Adding it casually would undermine the local-first product promise.

Mitigations:

- Keep cloud sync out of V2.
- Require a future ADR and product/privacy review before any backend.
- Define encryption, authentication, access control, deletion, retention, and audit requirements before implementation.
- Preserve local export/import even if sync is introduced later.

## Single-File App Maintenance

Risk:

The current `src/index.html` combines rendering, styles, state, persistence, audio, dictation, export, and PWA registration. Continued patching increases regression risk.

Mitigations:

- Use the V2 architecture plan before rebuilding.
- Move to modular source files.
- Use TypeScript for domain and storage shapes if the Vite recommendation is adopted.
- Add focused tests for migration, export, and review rules.

## No Explicit Consent Capture In V1

Risk:

The current prototype starts note/audio capture without storing explicit capture acknowledgement metadata.

Mitigations:

- Add consent/capture acknowledgement in V2 before note capture.
- Require separate acknowledgement before optional audio recording.
- Store consent timestamps with the session.
- Include consent metadata in exports.
