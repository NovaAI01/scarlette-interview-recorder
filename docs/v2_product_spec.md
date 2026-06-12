# V2 Product Specification

Scarlette Interview Recorder V2 is the planned rebuild direction for the current static PWA prototype. This document defines the product boundary before implementation work starts.

Related documents:

- [README](../README.md)
- [V2 Technical Architecture](v2_technical_architecture.md)
- [V2 Data Model](v2_data_model.md)
- [V2 Implementation Plan](v2_implementation_plan.md)
- [V2 Test Strategy](v2_test_strategy.md)
- [Known Risks](known_risks.md)
- [ADR-0001: Local-First Static PWA](decisions/ADR-0001-local-first-static-pwa.md)
- [ADR-0002: iPhone Native Dictation First](decisions/ADR-0002-iphone-native-dictation-first.md)
- [ADR-0003: IndexedDB For Session Archive](decisions/ADR-0003-indexeddb-for-session-archive.md)

## Current Prototype Audit

The current repository contains a working V1 static PWA prototype:

- The current V1 prototype is published at https://novaai01.github.io/scarlette-interview-recorder/.
- Root [index.html](../index.html) redirects to [src/index.html](../src/index.html).
- The app implementation is a single [src/index.html](../src/index.html) file with embedded CSS, templates, state management, recording, dictation, export, and service worker registration.
- The app uses prepared templates, structured fields, local autosave, review, JSON/Markdown export, and optional MediaRecorder audio backup.
- Session state is saved under `scarlette.interviewRecorder.session.v1` in `localStorage`.
- Audio blobs are held in memory and are deliberately removed from persisted session JSON.
- Browser speech recognition is enabled when `SpeechRecognition` or `webkitSpeechRecognition` exists.
- [service-worker.js](../service-worker.js) uses a cache-first app shell with a manually bumped cache name.

The prototype proves the workflow but is not the final product foundation. The largest product risks are iPhone speech reliability, weak archive storage, audio persistence, stale service worker behavior, missing explicit consent capture, and the maintenance cost of a single large HTML file.

## Governing Principles

### 1. Evidence First

The app captures raw interview evidence before analysis. V2 must not add AI extraction, scoring, summaries, proposal generation, or automated recommendations until capture and archive reliability are proven.

### 2. Local-First Privacy

Interview data stays on the user's device unless exported or deliberately shared. V2 must not add a backend, cloud upload, account system, sync, or recovery service unless explicitly approved in a future phase.

### 3. PWA Access Layer

Normal users must not need a terminal, localhost, port numbers, local servers, package commands, or background services. Normal use must be:

Hosted URL -> Install PWA -> Launch from icon.

### 4. iPhone Reliability

V2 must not rely on browser Web Speech API recognition on iPhone. The preferred iPhone workflow is:

Tap textarea -> use native iPhone keyboard microphone -> editable text appears in the selected box.

Custom browser `SpeechRecognition` can remain a later desktop/Android enhancement, but it must never freeze the app or block manual input.

The app cannot control or verify browser, operating-system, or keyboard dictation processing. It only receives the text inserted into the active field, so users must follow their browser, device, and organizational policy for dictation.

### 5. Structured Capture

Every question should support:

- main response
- follow-up answers
- additional notes
- optional full audio backup
- timestamps
- interview/session metadata

### 6. Scalable Local Storage

V2 must move beyond `localStorage` for interview archives. The target is IndexedDB for sessions, structured answers, and audio blobs if audio backup remains. `localStorage` may only be used for lightweight UI preferences.

### 7. Professional Engineering Standard

The repository must be understandable to an external reviewer. Documentation, architecture, privacy, access, roadmap, and testing are first-class deliverables.

## Product Purpose

Scarlette Interview Recorder helps an interviewer capture structured evidence during business workflow discovery interviews. The product exists to preserve raw answers, context, follow-ups, and optional audio backup in a consistent local archive that can be reviewed and exported later.

The immediate goal is reliable evidence capture. Later analysis depends on the quality of the captured evidence, so V2 prioritizes capture, persistence, review, and export over automation.

## Target User

The primary user is a Scarlette interviewer conducting discovery interviews with business staff, managers, operational teams, maintenance teams, or HR/admin teams.

The user may be working from a laptop or phone and may need to capture evidence live while speaking with someone. Phone use, especially iPhone Safari/Home Screen PWA use, is a primary reliability target.

## Primary Workflow

1. Open the hosted HTTPS app URL.
2. Install the app as a PWA when using it repeatedly.
3. Launch the app from the installed icon.
4. Select a prepared interview template.
5. Review and accept the consent/capture notice before recording or note capture.
6. Enter session metadata and participant/contact details.
7. Move through questions in order.
8. Capture main response, follow-up answers, and additional notes in editable text fields.
9. On iPhone, use native keyboard dictation inside the active textarea when desired.
10. Optionally record full-question audio backup when supported and consented.
11. Review missing evidence before ending the session.
12. Save the session in the local archive.
13. Export JSON/Markdown and optional audio/export bundles for later analysis.
14. Reopen previous local sessions from the same browser profile.

## Non-Goals

V2 must not include:

- backend storage
- authentication
- account management
- cloud upload
- cloud sync
- multi-user collaboration
- AI transcription
- AI extraction
- scoring
- automatic summaries
- proposal generation
- CRM integration
- automated recommendations
- follow-up interview generation in the initial V2 release

## User Stories

- As an interviewer, I can select a prepared template so that I ask consistent workflow-discovery questions.
- As an interviewer, I can capture a main response for each question so that the core evidence is not lost.
- As an interviewer, I can capture follow-up answers separately so that prompts and responses remain traceable.
- As an interviewer, I can add additional notes so that context, observations, and unresolved items are preserved.
- As an interviewer using an iPhone, I can tap a textarea and use the native keyboard microphone so that dictation does not depend on unstable browser recognition.
- As an interviewer, I can see missing evidence warnings before export so that gaps are visible while the conversation is still fresh.
- As an interviewer, I can optionally attach audio backup to a question when consent and browser support allow it.
- As an interviewer, I can reopen a saved local session so that an accidental app close does not destroy evidence.
- As an interviewer, I can export a session as structured data so that later analysis can happen outside the app.
- As an interviewer, I can export or import a local archive bundle so that evidence can be moved deliberately without cloud sync.
- As an external reviewer, I can understand the app boundary, privacy model, storage model, and release checks from the repository docs.

## Acceptance Criteria

V2 is acceptable for real discovery interviews only when:

- A normal user can open the hosted HTTPS app, install it, and launch it from the installed icon.
- The app works without a backend, account, local server, package command, or terminal for normal use.
- A user can create a new session from a prepared template.
- Explicit consent/capture acknowledgement is required before note capture or audio recording.
- Every question supports main response, follow-up answers, additional notes, timestamps, and session metadata.
- Text fields remain editable after typing, paste, mobile keyboard dictation, and reload.
- iPhone use does not depend on browser `SpeechRecognition`.
- Browser speech recognition, if present in a future enhancement, can fail without freezing the app or blocking manual input.
- Sessions persist in IndexedDB and can be reopened from an archive list in the same browser profile.
- Structured answers persist separately from transient UI state.
- Audio backup, if enabled, is either persisted in IndexedDB with clear size limits or clearly disabled/deferred until reliable.
- The review screen reports missing main responses and other defined required evidence.
- Export produces structured JSON and readable Markdown.
- Export does not silently omit available audio or falsely claim missing audio exists.
- Import can restore exported structured sessions when that feature is included.
- The service worker has an update strategy that avoids trapping users on stale app code.
- The manual release checklist has been passed on desktop, iPhone, installed PWA, offline mode, storage persistence, and export flows.
- The docs and release notes clearly state browser storage limits, exported-file responsibility, and browser/vendor dictation limits.

## V2 Boundaries

V2 includes:

- static hosted PWA access
- modular app structure
- prepared local templates
- local session archive
- IndexedDB persistence
- structured capture fields
- consent/capture acknowledgement
- review of missing evidence
- JSON/Markdown export
- archive export/import design
- iPhone-native dictation workflow
- optional audio backup only if persistence and export are reliable
- clearer service worker update handling
- professional documentation and release checklist

V2 excludes:

- cloud sync
- account recovery
- shared team archive
- AI extraction or analysis
- scoring or recommendations
- proposal generation
- automated follow-up interview builder

## Reliability Requirements Before Real Interviews

The following must be reliable before using V2 for real interviews:

- hosted PWA install and launch
- session creation and reopen
- autosave of every text field
- reload recovery
- iPhone textarea entry and native keyboard dictation
- explicit consent/capture acknowledgement
- storage quota messaging
- export of structured answers
- review of missing evidence
- stale-service-worker recovery
- clear user warnings for unsupported microphone/audio features
- deletion confirmation and recovery/export guidance

## Deliberately Deferred

The following are deliberately deferred until capture and archive reliability are proven:

- AI transcription
- AI extraction
- answer scoring
- summaries
- proposal generation
- automatic recommendations
- follow-up interview builder
- backend storage
- cloud sync
- authentication
- collaboration
- analytics dashboards
