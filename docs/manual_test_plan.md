# Scarlette Interview Recorder Manual Test Plan

This checklist verifies the static PWA manually. It covers the user access model in [Access Layer Standard](access_layer_standard.md), the privacy position in [Data Privacy](data_privacy.md), and the current v1 scope in [Product Brief](product_brief.md).

This is the V1 prototype checklist. The planned V2 release checklist is defined in [V2 Test Strategy](v2_test_strategy.md).

Use hosted HTTPS for final user verification. Localhost is acceptable for development verification.

## 1. Desktop Static Test

- [ ] Start a local static server from the repository root: `python3 -m http.server 8000`.
- [ ] Open `http://127.0.0.1:8000/`.
- [ ] Confirm the root page redirects to `/src/`.
- [ ] Confirm the app loads without a backend, package manager, build step, database, or API service.
- [ ] Confirm the header shows browser support status.
- [ ] Confirm the template list shows HR Discovery, Shop Floor Discovery, Manager Discovery, and Maintenance Discovery.
- [ ] Confirm each template shows a description and `5 questions`.
- [ ] Select a template and confirm the interview details form opens.

## 2. Phone PWA Install Test

- [ ] Deploy the app as static files over HTTPS.
- [ ] Open the hosted root URL on iPhone Safari.
- [ ] Use **Share > Add to Home Screen**.
- [ ] Launch **Scarlette** from the Home Screen.
- [ ] Confirm the app opens without a desktop development server.
- [ ] Open the hosted root URL on Android Chrome or Edge.
- [ ] Use the browser install prompt or menu install action.
- [ ] Launch **Scarlette** from the Home Screen or app launcher.
- [ ] Confirm normal users do not need a terminal, localhost URL, port number, package manager, or background process.

## 3. Offline Test

- [ ] Open the hosted app online once.
- [ ] Close the app.
- [ ] Disable network access.
- [ ] Launch the installed app from the desktop or phone app icon.
- [ ] Confirm the app shell opens offline.
- [ ] Confirm templates are visible offline.
- [ ] Start or resume an interview and enter structured evidence.
- [ ] Refresh while offline and confirm the app shell still opens.
- [ ] Confirm existing local session metadata remains available in the same browser profile.
- [ ] Confirm unavailable browser speech recognition does not become available because of offline mode.

## 4. Interview Details Test

- [ ] Confirm Business name defaults to `Spooner Metals`.
- [ ] Confirm Interview date/time defaults to the current local date/time.
- [ ] Enter Department.
- [ ] Enter Person spoken to.
- [ ] Enter Role.
- [ ] Add interviewer notes.
- [ ] Start the interview.
- [ ] Confirm question 1 shows the section, question number, total questions, main question, Main Response, Follow-up Answers, Additional Notes, and Optional full audio backup.

## 5. Field-Level Dictation Test

Use a browser/context that exposes `SpeechRecognition` or `webkitSpeechRecognition`.

- [ ] Confirm Main Response has its own Start dictation button directly associated with the textarea.
- [ ] Confirm every Follow-up Answer textarea has its own Start dictation button directly associated with that textarea.
- [ ] Confirm Additional Notes has its own Start dictation button directly associated with the textarea.
- [ ] Tap Start dictation for Main Response.
- [ ] Allow microphone permission if prompted.
- [ ] Confirm Main Response is visually highlighted.
- [ ] Confirm the active field status shows Listening.
- [ ] Speak a short phrase.
- [ ] Tap Stop dictation.
- [ ] Confirm dictated text is appended into Main Response.
- [ ] Type additional text into Main Response and confirm the field remains editable.
- [ ] Start Main Response dictation again, speak another phrase, and confirm the new phrase appends rather than overwriting existing text.
- [ ] Start dictation for a Follow-up Answer while Main Response dictation is active.
- [ ] Confirm Main Response dictation stops before the Follow-up Answer begins listening.
- [ ] Speak a follow-up answer and confirm it appears only in the selected follow-up textarea.
- [ ] Start dictation for Additional Notes and confirm dictated text appears only in Additional Notes.
- [ ] Reload the page and confirm dictated Main Response, Follow-up Answer, and Additional Notes text persists from `localStorage`.

## 6. Fallback Keyboard Dictation Test

Use a browser/context where Web Speech API recognition is unavailable.

- [ ] Confirm the app shows exactly: `Speech-to-text is not supported in this browser. Use keyboard dictation or type manually.`
- [ ] Confirm all Main Response, Follow-up Answer, and Additional Notes textareas remain manually editable.
- [ ] Confirm disabled dictation controls do not block typing, navigation, review, or export.
- [ ] On iPhone, tap inside Main Response and use the iPhone keyboard microphone dictation button.
- [ ] Confirm keyboard dictation inserts text into the active textarea.
- [ ] Confirm inserted keyboard dictation text persists after reload.

## 7. Full Audio Backup Test

- [ ] Confirm the MediaRecorder control appears below the evidence fields and is labelled **Optional full audio backup**.
- [ ] Tap Record backup audio.
- [ ] Allow microphone permission if prompted.
- [ ] Confirm backup recording state is visible and the timer runs.
- [ ] Tap Stop backup recording.
- [ ] Confirm audio playback appears.
- [ ] Play the recorded audio.
- [ ] Tap Re-record backup audio.
- [ ] Confirm the replacement warning appears.
- [ ] Cancel once.
- [ ] Tap Re-record backup audio again and confirm replacement.
- [ ] Stop the new backup recording and confirm playback updates.
- [ ] Download backup audio for the current question and confirm a file downloads.

## 8. Structured Evidence Navigation Test

- [ ] Enter a Main Response for question 1.
- [ ] Enter an answer in every Follow-up Answer textarea for question 1.
- [ ] Enter Additional Notes for question 1.
- [ ] Tap Next.
- [ ] Confirm question progress updates.
- [ ] Enter different Main Response, Follow-up Answers, and Additional Notes values for question 2.
- [ ] Tap Previous.
- [ ] Confirm question 1 structured fields and backup recording status remain visible.
- [ ] Tap Next.
- [ ] Confirm question 2 structured fields remain visible.
- [ ] Continue to the final question.
- [ ] Tap Review.

## 9. Review Test

- [ ] Confirm each question is listed.
- [ ] Confirm questions with backup audio show playback and a Download backup audio button.
- [ ] Confirm questions without optional backup audio do not show missing evidence warnings for the absent backup.
- [ ] Confirm questions with backup recording metadata but no current audio blob show a backup audio missing-after-reload warning.
- [ ] Confirm questions without a main response show missing main response warnings.
- [ ] Confirm each question shows Main Response, every follow-up prompt and answer, and Additional Notes.
- [ ] Tap Edit evidence for a question.
- [ ] Confirm review edit fields remain manually editable.
- [ ] Confirm review edit fields have field-level dictation controls.
- [ ] Change the main response, one follow-up answer, and additional notes, then tap Done.
- [ ] Open a question from review and return to review.

## 10. Structured Export Test

- [ ] Tap Export JSON and confirm a `.json` file downloads.
- [ ] Open the JSON and confirm it includes template, business, department, person, role, question, section, recording timestamp, recording duration, audio filename when available, main response, follow-up answers, and additional notes.
- [ ] Confirm dictated text appears in the existing `mainResponse`, `followUpAnswers[].response`, and notes/additional notes fields.
- [ ] Tap Export Markdown and confirm a `.md` file downloads.
- [ ] Open the Markdown and confirm each question is structured with Main Response, Follow-up Answers, and Additional Notes sections.
- [ ] Confirm backup audio is not embedded in JSON or Markdown.
- [ ] Tap Download all backup audio and confirm available audio files download one by one.

## 11. Clear And Reset Test

- [ ] Reload the page after adding typed or dictated main response, follow-up answers, additional notes, and moving to another question.
- [ ] Confirm selected template, interview details, structured evidence fields, dictated text, progress, and backup recording metadata are restored.
- [ ] Confirm backup audio may show as metadata only after reload.
- [ ] Start backup recording and try to navigate away; confirm the app blocks leaving the question.
- [ ] Start field dictation and try to close or reload the page; confirm the browser warns before leaving.
- [ ] Tap Clear session.
- [ ] Confirm a warning appears.
- [ ] Confirm Clear session removes the active interview and returns to the template list.

## 12. Required String Checks

Run from the repository root:

```bash
rg "SpeechRecognition|mainResponse|followUpAnswers|Optional full audio backup|Data Privacy|Access Layer Standard"
```

Expected: each required string appears in application code or documentation.
