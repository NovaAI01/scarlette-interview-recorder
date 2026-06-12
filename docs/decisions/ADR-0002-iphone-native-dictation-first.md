# ADR-0002: iPhone Native Dictation First

Status: Accepted

## Context

The V1 prototype includes field-level browser speech recognition where `SpeechRecognition` or `webkitSpeechRecognition` is available. Browser Web Speech API support is inconsistent and can be unreliable on iPhone Safari or installed PWAs. A freezing or unstable dictation feature is unacceptable during a live interview.

iPhone users already have a reliable platform-level dictation path through the native keyboard microphone. Text inserted that way appears in the selected textarea and can be edited like typed text.

## Decision

V2 will make native iPhone keyboard dictation the preferred iPhone workflow.

The iPhone workflow is:

Tap textarea -> use native iPhone keyboard microphone -> editable text appears in the selected box.

V2 must not rely on browser Web Speech API recognition on iPhone. Browser `SpeechRecognition` may be considered later as an optional desktop/Android enhancement, but it must never be required for capture and must never block typing or app navigation.

## Consequences

Positive consequences:

- Reduces risk of iPhone dictation freeze during interviews.
- Keeps evidence fields editable and simple.
- Preserves typing, paste, and native dictation as one consistent text-input model.
- Avoids building core capture on a browser API with uneven support.

Negative consequences:

- The app cannot directly control native keyboard dictation state.
- The app may not know whether text came from typing or native dictation.
- Browser, operating-system, or keyboard dictation processing happens outside the app's control; the app only receives inserted text.
- Desktop browser speech enhancement is deferred or must be isolated later.
- Some users may expect an in-app dictation button and need clear product guidance.
