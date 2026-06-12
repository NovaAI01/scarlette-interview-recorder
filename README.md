# Scarlette Interview Recorder

Scarlette Interview Recorder is a static Progressive Web App for capturing raw evidence during business workflow discovery interviews. The interviewer selects a prepared template, records one spoken answer for each question, captures structured written evidence, reviews missing evidence, and exports the session for later review.

This app deliberately does not analyse, summarise, score, transcribe, upload, or extract insights. It only captures interview evidence on the user's device.

## User Mode

Use the hosted app like a normal application:

1. Open the hosted Scarlette Interview Recorder URL.
2. Install the app from the browser.
3. Launch Scarlette Interview Recorder from the application icon.
4. Capture and export interview evidence.

Users do not need a terminal, localhost URL, port number, development command, background process, backend service, database, Docker container, or build tool.

The root hosted URL opens the app automatically. The direct app path is also available at `/src/`.

## Install On Desktop

Use a desktop browser that supports installing PWAs, such as Chrome, Edge, or Brave.

1. Open the hosted Scarlette Interview Recorder URL.
2. Use the browser install control, usually shown in the address bar or browser menu as **Install app**.
3. Confirm installation.
4. Launch **Scarlette Interview Recorder** from the operating system applications menu, start menu, dock, or launcher.

Expected desktop flow:

```text
Applications Menu
  -> Scarlette Interview Recorder
  -> Application Opens
```

## Install On iPhone

Use Safari on iPhone.

1. Open the hosted Scarlette Interview Recorder URL in Safari.
2. Tap **Share**.
3. Tap **Add to Home Screen**.
4. Confirm the name.
5. Launch **Scarlette** from the Home Screen.

## Install On Android

Use Chrome, Edge, or another Android browser with PWA install support.

1. Open the hosted Scarlette Interview Recorder URL.
2. Tap the browser install prompt or open the browser menu and tap **Install app**.
3. Confirm installation.
4. Launch **Scarlette** from the Home Screen or app launcher.

## Offline Behaviour

After the first successful hosted load, the service worker caches the static application shell:

- root launcher page
- app page
- interview templates
- manifest
- app icons
- previously loaded static assets

Local interview details, structured evidence fields, question progress, and recording metadata are stored in `localStorage`, so the active session can continue offline in the same browser profile.

The app has no backend dependency. It does not upload, sync, or permanently store interview data outside the user's browser.

## Limitations

Audio recording requires:

- HTTPS hosting, or localhost only during development
- browser support for `MediaRecorder`
- browser support for `navigator.mediaDevices.getUserMedia`
- microphone permission

Large audio blobs are kept as in-memory Blob/Object URL files during the active browser session. Download audio files before closing or reloading the page. After reload, the app can show saved recording metadata, but the actual audio file may no longer be available.

Data is local to the browser profile and device. There is no cross-device sync or account recovery.

## Development Mode

Development mode is only for local testing and editing. It is not required for normal user operation.

No package manager, framework, backend, database, Docker service, or build step is required.

From the repository root, run either:

```bash
python3 -m http.server 8000
```

or:

```bash
npx serve
```

Then open the local app URL shown by the server. For the Python server, use:

```text
http://127.0.0.1:8000/
```

The root page redirects to `/src/`, matching hosted user mode.

## Deployment

The application must be deployed as static files over HTTPS. Commit and publish the repository contents as-is.

### GitHub Pages

1. Push this repository to GitHub.
2. In the repository settings, open **Pages**.
3. Set the source to the main branch and repository root.
4. Wait for Pages to publish.
5. Open the published root URL, for example:

```text
https://YOUR-USER.github.io/scarlette-interview-recorder/
```

### Cloudflare Pages

1. Create a Cloudflare Pages project from this repository.
2. Leave the build command empty.
3. Set the output directory to `/`.
4. Deploy the project.
5. Open the deployed root URL, for example:

```text
https://scarlette-interview-recorder.pages.dev/
```

## Verification Checklist

Use a hosted HTTPS deployment for end-user verification:

1. Open the hosted root URL without running any local server.
2. Confirm the app opens from the root URL and redirects into the recorder.
3. Install the app on desktop and launch it from the application icon.
4. Install the app on iPhone with **Add to Home Screen** and launch it from the Home Screen.
5. Install the app on Android with **Install app** and launch it from the Home Screen.
6. Start a session, enter structured evidence, refresh the page, and confirm the session persists.
7. Turn off network access after the first successful load and confirm the app shell and templates still open.
8. Export JSON, Markdown, and available audio before closing or reloading after recording.
9. Confirm no backend, database, API server, Docker container, or permanent local service is required.

See [docs/manual_test_plan.md](docs/manual_test_plan.md) for the full functional checklist.
