# Scarlette Interview Recorder Manual Test Plan

Use a browser with microphone access. For mobile testing, use portrait orientation.

## User mode setup

- [ ] Open the hosted root URL without starting a local server.
- [ ] Confirm the root URL opens Scarlette Interview Recorder without requiring `/src/` to be typed manually.
- [ ] Confirm the browser shows installable app behaviour on a supported desktop browser.
- [ ] Install the app on desktop and launch it from the operating system application icon.
- [ ] Confirm the launched desktop app opens in standalone app mode.
- [ ] Open the hosted root URL on iPhone Safari.
- [ ] Tap Share, tap Add to Home Screen, and launch Scarlette from the Home Screen.
- [ ] Open the hosted root URL on Android.
- [ ] Use Install app and launch Scarlette from the Home Screen or app launcher.
- [ ] Confirm no terminal, localhost URL, port number, development command, or background process is needed for hosted use.

## Offline access

- [ ] After the first successful hosted load, close the app.
- [ ] Disable network access.
- [ ] Launch the installed app from the icon.
- [ ] Confirm the app shell opens offline.
- [ ] Confirm interview templates are visible offline.
- [ ] Start or resume an interview offline and enter structured evidence.
- [ ] Refresh while offline and confirm the app still opens.
- [ ] Confirm the local session data remains available in the same browser profile.

## Development setup

- [ ] Run `python3 -m http.server 8000` from the repository root.
- [ ] Open `http://127.0.0.1:8000/`.
- [ ] Confirm the root URL redirects to the app.
- [ ] Confirm the browser support status is visible in the header.
- [ ] Confirm the save/export warning is visible.

## Hosted phone setup

- [ ] Deploy the static repository to GitHub Pages or Cloudflare Pages.
- [ ] Open the hosted root URL in iPhone Safari.
- [ ] Tap Share.
- [ ] Tap Add to Home Screen.
- [ ] Open Scarlette Recorder from the Home Screen.
- [ ] Confirm the app loads without the desktop development server running after it has been opened once online.
- [ ] Record a short interview answer.
- [ ] Export evidence before clearing Safari data or website data.

## Template selection

- [ ] Confirm the template list shows HR Discovery, Shop Floor Discovery, Manager Discovery, and Maintenance Discovery.
- [ ] Confirm each template shows a description and `5 questions`.
- [ ] Select HR Discovery.

## Interview details

- [ ] Confirm Business name defaults to `Spooner Metals`.
- [ ] Confirm Interview date/time defaults to the current local date/time.
- [ ] Enter Department.
- [ ] Enter Person spoken to.
- [ ] Enter Role.
- [ ] Add interviewer notes.
- [ ] Start the interview.

## Recording flow

- [ ] Confirm question 1 shows the question number, total questions, section, main question, recorder controls, Main Response, Follow-up Answers, and Additional Notes.
- [ ] Tap Record answer.
- [ ] Allow microphone permission when prompted.
- [ ] Confirm the recording state is clear and the timer is running.
- [ ] Tap Stop recording.
- [ ] Confirm audio playback appears.
- [ ] Play the recorded audio.
- [ ] Tap Re-record answer.
- [ ] Confirm the replacement warning appears.
- [ ] Cancel once, then try again and confirm.
- [ ] Stop the new recording and confirm playback updates.

## Structured evidence and navigation

- [ ] Enter a Main Response for question 1.
- [ ] Enter an answer in every Follow-up Answers textarea for question 1.
- [ ] Enter Additional Notes for question 1.
- [ ] Tap Next.
- [ ] Confirm question progress updates.
- [ ] Enter different Main Response, Follow-up Answers, and Additional Notes values for question 2.
- [ ] Tap Previous.
- [ ] Confirm question 1 main response, every follow-up answer, additional notes, and recording status remain visible.
- [ ] Tap Next.
- [ ] Confirm question 2 main response, every follow-up answer, and additional notes remain visible.
- [ ] Continue to the final question.
- [ ] Tap Review.

## Review screen

- [ ] Confirm each question is listed.
- [ ] Confirm recorded questions show playback and a download audio button.
- [ ] Confirm unanswered questions show missing recording warnings.
- [ ] Confirm questions without a main response show missing main response warnings.
- [ ] Confirm each question shows Main Response, every follow-up prompt and answer, and Additional Notes.
- [ ] Tap Edit evidence for a question.
- [ ] Change the main response, one follow-up answer, and additional notes, then tap Done.
- [ ] Open a question from review and return to review.

## Export

- [ ] Tap Export JSON and confirm a `.json` file downloads.
- [ ] Open the JSON and confirm it includes template, business, department, person, role, question, section, recording timestamp, recording duration, audio filename when available, main response, follow-up answers, and additional notes.
- [ ] Tap Export Markdown and confirm a `.md` file downloads.
- [ ] Open the Markdown and confirm each question is structured with Main Response, Follow-up Answers, and Additional Notes sections.
- [ ] Tap Download audio for one recorded answer and confirm an audio file downloads.
- [ ] Tap Download all audio and confirm available audio files download one by one.

## Persistence and safety

- [ ] Reload the page after adding main response, follow-up answers, additional notes, and moving to another question.
- [ ] Confirm selected template, interview details, structured evidence fields, progress, and recording metadata are restored.
- [ ] Confirm audio may show as metadata only after reload.
- [ ] Start a recording and try to navigate away; confirm the app blocks leaving the question.
- [ ] Try clearing the session; confirm a warning appears.
- [ ] Confirm Clear session removes the active interview and returns to the template list.
