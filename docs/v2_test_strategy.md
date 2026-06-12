# V2 Test Strategy

This document defines the proposed V2 verification strategy. It does not add CI or test tooling in this task.

Related documents:

- [V2 Product Specification](v2_product_spec.md)
- [V2 Technical Architecture](v2_technical_architecture.md)
- [V2 Implementation Plan](v2_implementation_plan.md)
- [Known Risks](known_risks.md)

## Test Principles

- Test capture reliability before analysis features.
- Treat iPhone Safari/Home Screen PWA as a primary target, not an afterthought.
- Verify storage persistence with reload, app close, and browser relaunch.
- Verify exports by opening and inspecting the files.
- Test failure modes deliberately.
- Keep automated checks small and suitable for a static PWA.

## Manual Tests

Core manual flow:

- Open the hosted HTTPS app, currently https://novaai01.github.io/scarlette-interview-recorder/.
- Install the PWA where supported.
- Launch from the installed icon.
- Select each prepared template.
- Create a session.
- Acknowledge note capture consent.
- Enter participant/contact metadata.
- Capture main response, follow-up answers, and additional notes for every question.
- Leave selected fields blank and confirm review warnings.
- Return from review to edit evidence.
- Reopen the session from the local archive.
- Export JSON and Markdown.
- Clear or delete a session only after confirmation.

## Smoke Tests

Minimum local smoke checks:

```bash
python3 -m http.server 8000
curl -I http://127.0.0.1:8000/
find docs -maxdepth 3 -type f | sort
```

Hosted smoke check:

```bash
curl -I https://novaai01.github.io/scarlette-interview-recorder/
```

If V2 adopts Vite + TypeScript, proposed checks:

```bash
npm run build
npm run typecheck
npm run test
```

These commands are proposed only. Do not assume they exist until the build setup is implemented.

## Browser Tests

Desktop browsers:

- Chrome current
- Edge current
- Brave current
- Safari on macOS where available
- Firefox as a non-PWA or limited-PWA reference where appropriate

Browser checks:

- App loads from root URL.
- Manifest is detected.
- App shell renders.
- Text input works.
- IndexedDB opens.
- Sessions persist after reload.
- Export downloads files.
- Unsupported features show visible messages.
- Service worker registration does not break app load.

## iPhone Tests

Target:

- iPhone Safari hosted URL
- iPhone Home Screen installed PWA

Required checks:

- Open hosted app in Safari.
- Add to Home Screen.
- Launch from Home Screen icon.
- Create a session.
- Tap each evidence textarea.
- Use native iPhone keyboard microphone.
- Confirm dictated text appears in the active field.
- Correct dictated text manually.
- Navigate between questions.
- Reload/relaunch and confirm text persists.
- Confirm the app does not expose browser `SpeechRecognition` as the primary iPhone workflow.
- Confirm microphone denial for optional audio does not block text capture.
- Confirm keyboard and viewport changes do not hide the active textarea or primary navigation.
- Confirm product/release notes do not imply the app controls browser, operating-system, or keyboard dictation processing.

## PWA Install Tests

Desktop:

- Open hosted HTTPS URL.
- Install through browser UI.
- Launch from OS launcher/dock/menu.
- Confirm app opens at expected route.
- Confirm app version is visible or inspectable.

iPhone:

- Open Safari.
- Use Share -> Add to Home Screen.
- Launch from Home Screen.
- Confirm app opens without localhost or a development server.

Android:

- Open Chrome/Edge.
- Use install prompt/menu.
- Launch from Home Screen/app launcher.

## Offline Tests

Required checks:

- Load hosted app online once.
- Create or reopen a session.
- Disable network.
- Launch installed app.
- Confirm app shell opens.
- Confirm local archive list opens.
- Confirm existing session opens.
- Enter text while offline.
- Reload while offline and confirm text remains.
- Re-enable network and confirm no data is uploaded automatically.

## Storage Persistence Tests

IndexedDB checks:

- Create three sessions.
- Edit answers in each session.
- Reload after every edit.
- Close browser and reopen.
- Confirm all sessions remain.
- Confirm session order and titles are stable.
- Inspect IndexedDB stores in devtools.
- Confirm no interview evidence is stored in `localStorage`.
- Trigger storage quota estimate where supported.
- Test behavior in private/incognito mode and document limitations.

Migration checks:

- Seed a V1 `localStorage` session.
- Open V2.
- Confirm import offer appears.
- Import into archive.
- Confirm text evidence is preserved.
- Confirm V1 audio is marked metadata-only.
- Confirm source `localStorage` remains until user confirms cleanup.

## Export/Import Tests

Single-session export:

- Export JSON.
- Export Markdown.
- Open both files.
- Confirm metadata, consent, questions, main responses, follow-up answers, notes, and timestamps are present.
- Confirm audio status is accurate.

Archive export:

- Export multiple sessions.
- Confirm manifest includes schema/app version.
- Confirm all selected session IDs are present.

Import:

- Use a fresh browser profile.
- Import a valid V2 export.
- Confirm sessions appear in archive.
- Confirm records match source export.
- Import an unsupported schema and confirm safe rejection.
- Import a malformed file and confirm existing archive remains intact.

iPhone export:

- Export from installed PWA.
- Confirm the file can be saved/shared.
- Avoid relying on uncontrolled repeated automatic downloads.

## Audio Tests

Only apply if V2 includes optional audio backup:

- Confirm audio recording requires explicit audio consent.
- Start recording for a question.
- Stop recording.
- Play recording.
- Reload and play again.
- Close and reopen app, then play again.
- Export with audio included.
- Export with audio excluded.
- Deny microphone permission and confirm recovery.
- Test unsupported microphone/browser path.
- Test long recording warning.
- Confirm storage size is displayed or available.

## Failure-Mode Tests

Required failure scenarios:

- IndexedDB open failure.
- IndexedDB write failure.
- Storage quota near full.
- Migration failure.
- Export creation failure.
- Import validation failure.
- Microphone permission denied.
- Microphone unavailable.
- Unsupported MediaRecorder.
- Unsupported audio MIME type.
- Service worker registration failure.
- New service worker waiting during active interview.
- Offline app launch before first successful online load.
- User attempts destructive delete.

Expected behavior:

- Captured text is preserved where possible.
- User sees a specific message.
- Optional features fail without blocking text capture.
- Destructive actions require confirmation.
- User is told when export is the safest recovery path.

## Minimal Automated Checks

Suitable automated checks for a static PWA:

- TypeScript typecheck if Vite + TypeScript is adopted.
- Unit tests for review warning rules.
- Unit tests for export JSON/Markdown builders.
- Unit tests for schema migration functions.
- Unit tests for storage repository mapping with fake IndexedDB.
- Static build check.
- HTML entrypoint smoke check.
- Service worker app-shell asset list check.
- Playwright smoke test for template selection and text persistence.

Proposed Playwright smoke coverage:

- load app
- select template
- acknowledge capture notice
- enter session metadata
- enter main response/follow-up/notes
- reload
- confirm text persists
- open review
- trigger JSON export in a controlled browser context

Do not automate real iPhone native dictation. Keep that as a required manual release gate.

## Release Checklist

Before a V2 release:

- [ ] Product boundary still matches [V2 Product Specification](v2_product_spec.md).
- [ ] No AI/cloud/account features were added by accident.
- [ ] README live URL opens the expected current hosted app.
- [ ] Hosted app opens over HTTPS.
- [ ] PWA install works on desktop.
- [ ] Add to Home Screen works on iPhone.
- [ ] Installed app launches from icon.
- [ ] App shell opens offline after first load.
- [ ] IndexedDB archive persists after reload and relaunch.
- [ ] V1 migration path was tested.
- [ ] iPhone native keyboard dictation was tested.
- [ ] Browser speech recognition is not required on iPhone.
- [ ] Consent/capture acknowledgement is required.
- [ ] Review warnings are accurate.
- [ ] JSON export inspected.
- [ ] Markdown export inspected.
- [ ] Import/round trip tested if import is in release scope.
- [ ] Audio persistence/export tested or audio clearly deferred.
- [ ] Service worker update prompt tested.
- [ ] Storage quota warning path reviewed.
- [ ] Browser storage limits, exported-file responsibility, and browser/vendor dictation limits are documented.
- [ ] README status and live URL are accurate.
- [ ] Screenshots, if present, are real and current.
- [ ] Known risks are updated.
