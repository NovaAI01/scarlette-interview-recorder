# Data Privacy

Scarlette Interview Recorder is designed as a local-first evidence capture tool. The application code may be public, while interview data remains local unless the user exports or shares it.

Related documents:

- [Product Brief](product_brief.md)
- [Access Layer Standard](access_layer_standard.md)
- [Roadmap](roadmap.md)
- [Manual Test Plan](manual_test_plan.md)
- [README](../README.md)

## Public Code, Private Interview Data

The repository can be hosted publicly because it contains app code, static assets, templates, and documentation.

Interview data is different. Interview details, answers, notes, dictated text, and recording metadata belong to the user and the interview context. They should be handled according to the sensitivity of the business conversation.

## No Backend

The app does not provide:

- backend storage
- server-side database
- Scarlette account storage
- API upload
- cloud sync
- remote recovery

The app runs in the user's browser. Session data is stored in the browser profile with `localStorage`.

## No Cloud Upload

The app does not upload interview content to a Scarlette service or third-party storage service.

Browser-provided speech recognition may have browser/vendor-specific processing behaviour outside this app's control. The app detects the browser speech recognition API and writes returned text into the selected field; it does not add a cloud transcription provider or AI transcription layer.

If browser speech recognition is unavailable or inappropriate for the interview, use manual typing or device keyboard dictation according to the user's device policy.

## Local Storage Contents

The app stores the following locally in `localStorage`:

- selected template
- current question index
- interview details
- Main Response text
- Follow-up Answers text
- Additional Notes
- dictated text after it is inserted into a textarea
- recording metadata

The app does not store audio blob contents permanently in `localStorage`.

## Audio Blob Limitation

Optional full audio backup uses browser `MediaRecorder` where supported.

Large audio blobs are held in memory through Blob/Object URL references during the active browser session. After reload, close, browser crash, or device cleanup, the app may only retain recording metadata. The actual audio file may no longer be available.

Users should download required backup audio before closing or reloading the browser.

## Exported Files

Exports are user-controlled downloads:

- JSON metadata/evidence export
- Markdown evidence export
- optional backup audio files

After download, exported files are outside the app's control. Users are responsible for storing, sharing, redacting, deleting, or securing those files according to the interview's confidentiality requirements.

## Clearing Data

The app provides a Clear session action. Clearing removes the active interview from local browser storage and returns to the template list.

Clearing browser site data or using a different browser profile can also remove locally stored sessions. There is no account recovery.
