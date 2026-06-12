# Scarlette Interview Recorder

Scarlette Interview Recorder is a local-first Progressive Web App for capturing structured evidence during business workflow-discovery interviews.

The current app is a working V1 static prototype. V2 architecture planning is now in progress; V2 is not yet implemented.

## Current Status

- Current implementation: V1 static PWA prototype.
- Runtime model: static files only, no backend.
- Main app file: [src/index.html](src/index.html).
- V2 status: product reset and architecture foundation documented in [docs/](docs). V2 is not implemented or deployed yet.
- Live app URL: https://novaai01.github.io/scarlette-interview-recorder/ for the current V1 prototype.
- Screenshots: no verified screenshots are committed yet.

## Current Prototype Capabilities

The V1 prototype currently supports:

- prepared discovery templates for HR, shop floor, manager, and maintenance workflows
- structured fields for Main Response, Follow-up Answers, and Additional Notes
- manual typing and phone keyboard dictation through normal textareas
- browser speech recognition controls where `SpeechRecognition` or `webkitSpeechRecognition` is available
- optional full-question MediaRecorder audio backup
- local autosave of the active session in `localStorage`
- review screen with missing main-response warnings
- JSON and Markdown export
- individual and batch download of audio blobs that still exist in the current browser session
- PWA manifest and service worker for install/offline app shell behavior

Important V1 limitations:

- The app is mostly a single large HTML file.
- `localStorage` stores only the active session, not a scalable archive.
- Audio blobs are not reliably persisted across reloads.
- iPhone browser speech recognition is not reliable enough to be a product dependency.
- There is no explicit consent/capture acknowledgement stored before note or audio capture.
- Service worker cache updates require careful verification to avoid stale installed copies.

## V2 Direction

V2 will rebuild the product around reliable evidence capture and local archives.

V2 principles:

- Evidence first: capture raw evidence before analysis.
- Local-first privacy: interview data stays on the user's device unless exported or deliberately shared.
- PWA access: normal users open a hosted URL, install the PWA, and launch from the icon.
- iPhone reliability: use native keyboard dictation inside textareas; do not rely on browser Web Speech API on iPhone.
- Structured capture: every question supports main response, follow-up answers, notes, timestamps, metadata, and optional audio backup.
- Scalable local storage: move interview evidence from `localStorage` to IndexedDB.
- Professional engineering standard: docs, privacy, architecture, testing, and release checks are first-class deliverables.

V2 is not adding AI extraction, scoring, summaries, proposal generation, cloud sync, accounts, authentication, or backend storage.

## Privacy Model

The app is designed to be local-first.

The repository code and documentation may be public. Interview data is separate: it stays in the user's browser profile unless the user exports or shares it.

Current V1 storage:

- interview details, structured text evidence, progress, and recording metadata are stored in the browser profile using `localStorage`
- audio blobs are held in memory for the current browser session and should be downloaded before reload/close

Planned V2 storage:

- IndexedDB for sessions, structured answers, participants, templates, and optional audio blobs
- schema versioning and migration support
- export/import for deliberate backup or sharing
- `localStorage` only for lightweight UI preferences if needed

The app does not upload interview content to a Scarlette backend. Browser storage is not guaranteed permanent; browser/site-data cleanup, private browsing limits, storage pressure, profile changes, or device policy can remove local data.

Exported files are outside the app's control and should be handled according to the sensitivity of the interview. Browser, operating-system, and keyboard dictation processing behavior is also outside the app's control.

See [docs/data_privacy.md](docs/data_privacy.md) and [docs/known_risks.md](docs/known_risks.md).

## Access Model

Normal users should not need:

- a terminal
- localhost
- port numbers
- package commands
- local servers
- Docker
- background services

Normal use should be:

Hosted HTTPS URL -> Install PWA -> Launch from icon.

Local server use is for development and verification only.

See [docs/access_layer_standard.md](docs/access_layer_standard.md).

## iPhone Input Guidance

For iPhone use, the preferred workflow is:

1. Tap the relevant textarea.
2. Use the native iPhone keyboard microphone.
3. Edit the inserted text if needed.
4. Continue through the structured fields.

Browser Web Speech API recognition must not be treated as reliable on iPhone.

## Project Structure

```text
.
|-- index.html                    Root redirect to the current app
|-- src/index.html                Current V1 static single-page prototype
|-- service-worker.js             Current app shell cache
|-- manifest.webmanifest          PWA metadata
|-- assets/icons/                 PWA icons
|-- docs/                         Product, architecture, privacy, and test docs
`-- README.md
```

## Run Current Prototype Locally

No package manager, framework, backend, database, Docker service, or build step is required for the current prototype.

From the repository root:

```bash
python3 -m http.server 8000
```

Open:

```text
http://127.0.0.1:8000/
```

If port 8000 is in use:

```bash
python3 -m http.server 8001
```

## Deploy Current Static App

Deploy the repository as static files over HTTPS.

### GitHub Pages

Current GitHub Pages deployment:

```text
https://novaai01.github.io/scarlette-interview-recorder/
```

1. Push the repository to GitHub.
2. Open repository Settings > Pages.
3. Set the source to the main branch and repository root.
4. Wait for Pages to publish.
5. Confirm the published URL matches this README, or update the URL if deployment changes.

### Cloudflare Pages

1. Create a Cloudflare Pages project from this repository.
2. Leave the build command empty.
3. Set the output directory to `/`.
4. Deploy.
5. Record the deployed URL in this README.

## Documentation Index

Current V1 docs:

- [Product Brief](docs/product_brief.md)
- [Access Layer Standard](docs/access_layer_standard.md)
- [Data Privacy](docs/data_privacy.md)
- [Roadmap](docs/roadmap.md)
- [Manual Test Plan](docs/manual_test_plan.md)

V2 foundation docs:

- [V2 Product Specification](docs/v2_product_spec.md)
- [V2 Technical Architecture](docs/v2_technical_architecture.md)
- [V2 Data Model](docs/v2_data_model.md)
- [V2 Implementation Plan](docs/v2_implementation_plan.md)
- [V2 Test Strategy](docs/v2_test_strategy.md)
- [Known Risks](docs/known_risks.md)

Architecture decisions:

- [ADR-0001: Local-First Static PWA](docs/decisions/ADR-0001-local-first-static-pwa.md)
- [ADR-0002: iPhone Native Dictation First](docs/decisions/ADR-0002-iphone-native-dictation-first.md)
- [ADR-0003: IndexedDB For Session Archive](docs/decisions/ADR-0003-indexeddb-for-session-archive.md)

## Basic Verification

Hosted smoke test:

```bash
curl -I https://novaai01.github.io/scarlette-interview-recorder/
```

Static smoke test:

```bash
python3 -m http.server 8000
curl -I http://127.0.0.1:8000/
```

Embedded JavaScript syntax check for the current prototype:

```bash
node -e 'const fs = require("fs"); const html = fs.readFileSync("src/index.html", "utf8"); const match = html.match(/<script>([\s\S]*)<\/script>/); new Function(match[1]); console.log("embedded script parses");'
```

Documentation inventory:

```bash
find docs -maxdepth 3 -type f | sort
```

Manual verification is still required for microphone permission, iPhone native keyboard dictation, PWA install, offline launch, service worker update behavior, storage persistence, and export handling.

V2 is not ready for real discovery interviews until the V2 release checklist in [docs/v2_test_strategy.md](docs/v2_test_strategy.md) passes on the hosted app, iPhone/Home Screen PWA, offline behavior, storage persistence, audio decision path, and export flows.
