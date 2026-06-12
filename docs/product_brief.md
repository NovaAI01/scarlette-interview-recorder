# Product Brief

Scarlette Interview Recorder is a v1 internal tool for capturing raw discovery evidence during business workflow interviews.

Related documents:

- [Access Layer Standard](access_layer_standard.md)
- [Data Privacy](data_privacy.md)
- [Roadmap](roadmap.md)
- [Manual Test Plan](manual_test_plan.md)
- [README](../README.md)

## Problem

Discovery interviews often produce useful operational evidence, but the evidence can be lost or weakened when it is captured as loose notes, scattered audio files, or post-call summaries. Interviewers need a simple way to collect answers against a consistent question set while the conversation is happening.

The immediate problem is capture reliability, not analysis.

## Target User

The primary user is a Scarlette interviewer conducting business workflow discovery with staff, managers, or operational teams.

The user needs to:

- follow a prepared question template
- capture raw answers in the right place
- collect follow-up evidence consistently
- retain optional full audio backup where useful
- review missing evidence before ending the session
- export the session for later internal review

## Use Case

Scarlette uses the app during discovery interviews to capture evidence about workflow friction, delays, duplication, handovers, approvals, reporting, and operational admin.

The app supports interview capture during or immediately after the conversation. It is not a CRM, research repository, analytics platform, proposal system, or transcription service.

## Evidence-Capture Model

Each interview session is structured around:

- interview details
- selected discovery template
- ordered questions
- Main Response
- Follow-up Answers
- Additional Notes
- optional full audio backup metadata and downloadable audio blobs

Field-level dictation writes into the existing evidence fields:

- `mainResponse`
- `followUpAnswers[index].response`
- `notes`

This keeps export, review, and persistence behaviour simple. Dictated text is treated as field text once inserted.

## Why Raw Capture Comes Before Extraction

Reliable extraction depends on reliable source evidence. If the raw interview record is incomplete, ambiguous, or scattered across tools, later analysis becomes harder to trust.

The v1 product therefore focuses on:

- prompting consistent capture
- preserving answer context
- keeping evidence editable
- making missing evidence visible
- exporting structured records

Extraction, scoring, summaries, and proposal generation are deliberately deferred. They require a stronger archive and governance layer before they should be introduced.

## Current V1 Boundary

V1 includes:

- static PWA delivery
- prepared interview templates
- structured evidence fields
- field-level browser dictation where available
- manual typing and phone keyboard dictation fallback
- optional full audio backup
- local autosave
- review
- JSON and Markdown export

V1 excludes:

- backend storage
- cloud upload
- account login
- AI transcription
- AI extraction
- scoring
- summaries
- proposal generation
- cross-device sync

The app should remain small, reliable, and easy to deploy as static files until the archive and governance requirements are defined.
