# Scarlette Interview Recorder

Scarlette Interview Recorder is a static Progressive Web App for capturing structured interview evidence during business workflow discovery.

The app is designed for internal Scarlette discovery work. It prioritises reliable raw capture, local storage, review, and export. It does not add backend services, cloud transcription, AI extraction, scoring, proposal generation, or account-based storage.

## Live App

Live app URL:

```text
TODO: add deployed HTTPS URL
```

Direct app path after deployment:

```text
/src/
```

## Screenshot

Screenshot placeholder:

```text
TODO: add current desktop and mobile screenshots after deployment verification.
```

## Current Capabilities

- Template-based discovery interviews for HR, shop floor, manager, and maintenance workflows.
- Structured evidence fields for Main Response, Follow-up Answers, and Additional Notes.
- Field-level browser dictation controls for editable evidence fields when `SpeechRecognition` or `webkitSpeechRecognition` is available.
- Manual typing and device keyboard dictation fallback when browser speech recognition is unavailable.
- Optional full-question MediaRecorder audio backup.
- Local autosave of interview details, progress, structured evidence, dictated text, and recording metadata in `localStorage`.
- Review screen with missing evidence warnings.
- JSON and Markdown export.
- Individual and batch download of available backup audio blobs.
- Static PWA installation on supported desktop and mobile browsers.
- Offline app shell after the first successful hosted load.

## Deliberately Out Of Scope

- Backend services, databases, accounts, authentication, and server-side storage.
- Cloud transcription, AI transcription, AI extraction, scoring, summaries, or proposal generation.
- Cross-device sync or account recovery.
- Package managers, build tools, frameworks, Docker services, or long-running local processes for normal use.
- Permanent storage of audio blobs after reload or browser close.

See [Product Brief](docs/product_brief.md) and [Roadmap](docs/roadmap.md) for the v1 product boundary.

## User Workflow

1. Open the hosted Scarlette Interview Recorder URL.
2. Install the app if using it repeatedly on desktop or phone.
3. Select the relevant discovery template.
4. Enter interview details.
5. Capture each question using structured evidence fields.
6. Use field-level dictation where supported, or type/use keyboard dictation manually.
7. Optionally record a full audio backup for the question.
8. Review missing evidence warnings.
9. Export JSON, Markdown, and any available backup audio before closing or reloading.

## Install And Use

### Desktop

Use a browser with PWA installation support, such as Chrome, Edge, or Brave.

1. Open the hosted HTTPS URL.
2. Use the browser install control, usually shown in the address bar or browser menu.
3. Launch **Scarlette Interview Recorder** from the operating system application menu, dock, or launcher.

### iPhone

Use Safari.

1. Open the hosted HTTPS URL.
2. Tap **Share**.
3. Tap **Add to Home Screen**.
4. Launch **Scarlette** from the Home Screen.

If the browser does not expose Web Speech API dictation, tap inside the textarea and use the iPhone keyboard microphone dictation button.

### Android

Use Chrome, Edge, or another browser with PWA installation support.

1. Open the hosted HTTPS URL.
2. Use the browser install prompt or browser menu.
3. Launch **Scarlette** from the Home Screen or app launcher.

## Field-Level Dictation

Every editable evidence textarea has its own dictation control:

- Main Response
- each Follow-up Answer
- Additional Notes

Support is detected with:

```js
window.SpeechRecognition || window.webkitSpeechRecognition
```

When supported, **Start dictation** listens for the selected field only. Final recognized speech is appended to the existing textarea value, the text remains editable, and the updated field is persisted to `localStorage` immediately.

Starting dictation for another field stops the active field first. The active field is visually highlighted and the control changes to **Stop dictation**.

When unsupported, the app shows:

```text
Speech-to-text is not supported in this browser. Use keyboard dictation or type manually.
```

All textareas remain usable manually.

## Optional Full Audio Backup

The MediaRecorder control is retained below the evidence fields as **Optional full audio backup**.

This backup records the full-question audio for later reference. It is separate from structured evidence entry and is not required for export. Backup audio blobs are held in memory by the current browser session and should be downloaded before closing or reloading.

## Privacy And Data Storage

The application code may be public. Interview data is not sent to a Scarlette backend by this app.

Stored locally in the browser profile:

- interview details
- selected template and current question
- structured evidence fields
- dictated text once inserted into textareas
- recording metadata

Not stored permanently by the app:

- backup audio blob contents after browser reload or close
- exported files after the browser hands them to the user

Users are responsible for handling exported JSON, Markdown, and audio files according to the sensitivity of the interview.

See [Data Privacy](docs/data_privacy.md) for the full privacy position.

## Browser Limitations

Field-level speech-to-text depends on browser support for Web Speech API recognition. Support varies by browser, device, installed PWA context, permissions, and network/runtime conditions. Browser speech recognition may be unavailable even when microphone recording is available.

Optional backup audio recording requires:

- HTTPS hosting, or localhost during development
- `MediaRecorder`
- `navigator.mediaDevices.getUserMedia`
- microphone permission

Offline mode applies to the cached app shell and local session metadata. It does not make unavailable browser speech recognition available, and it does not restore audio blobs after reload.

## Access Layer

Normal users should access Scarlette Interview Recorder through the hosted PWA. They should not need a terminal, local server, package manager, Docker, build command, or background service.

Local server use is only for development and manual verification.

See [Access Layer Standard](docs/access_layer_standard.md).

## Project Structure

```text
.
|-- index.html                  Root redirect to the app
|-- src/index.html              Static single-page application
|-- service-worker.js           App shell cache for PWA/offline access
|-- manifest.webmanifest        PWA metadata
|-- assets/icons/               PWA icons
|-- docs/manual_test_plan.md    Manual verification checklist
|-- docs/product_brief.md       Product scope and v1 boundary
|-- docs/access_layer_standard.md
|-- docs/data_privacy.md
|-- docs/roadmap.md
`-- README.md
```

## Development

No package manager, framework, backend, database, Docker service, or build step is required.

From the repository root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/
```

If port 8000 is in use, choose another port:

```bash
python3 -m http.server 8001
```

## Deployment

Deploy the repository as static files over HTTPS.

### GitHub Pages

1. Push the repository to GitHub.
2. Open repository **Settings > Pages**.
3. Set the source to the main branch and repository root.
4. Wait for Pages to publish.
5. Add the published URL to the **Live App** section above.

### Cloudflare Pages

1. Create a Cloudflare Pages project from this repository.
2. Leave the build command empty.
3. Set the output directory to `/`.
4. Deploy.
5. Add the deployed URL to the **Live App** section above.

## Verification

Static smoke test:

```bash
python3 -m http.server 8000
curl -I http://127.0.0.1:8000/
```

Embedded JavaScript syntax check:

```bash
node -e 'const fs = require("fs"); const html = fs.readFileSync("src/index.html", "utf8"); const match = html.match(/<script>([\s\S]*)<\/script>/); new Function(match[1]); console.log("embedded script parses");'
```

Required string checks:

```bash
rg "SpeechRecognition|mainResponse|followUpAnswers|Optional full audio backup|Data Privacy|Access Layer Standard"
```

Manual verification is required for microphone permission, Web Speech API dictation, PWA install, offline launch, and backup audio playback/download. Use [Manual Test Plan](docs/manual_test_plan.md).

## Documentation

- [Product Brief](docs/product_brief.md)
- [Access Layer Standard](docs/access_layer_standard.md)
- [Data Privacy](docs/data_privacy.md)
- [Roadmap](docs/roadmap.md)
- [Manual Test Plan](docs/manual_test_plan.md)

## Project Status

Status: v1 internal tool, static PWA.

The current priority is reliable structured capture and export. Future work should preserve the v1 boundary unless the product scope is explicitly changed.
