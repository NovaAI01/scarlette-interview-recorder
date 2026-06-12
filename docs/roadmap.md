# Roadmap

This roadmap keeps Scarlette Interview Recorder focused on disciplined evidence capture. It should be updated when the product boundary changes.

Related documents:

- [Product Brief](product_brief.md)
- [Access Layer Standard](access_layer_standard.md)
- [Data Privacy](data_privacy.md)
- [Manual Test Plan](manual_test_plan.md)
- [README](../README.md)

## Now: Reliable Structured Capture

Current focus:

- stable static PWA access
- clear template selection
- structured evidence fields
- field-level dictation where browser support exists
- manual and keyboard dictation fallback
- optional full audio backup
- local autosave
- review before export
- JSON and Markdown export
- clear privacy and access documentation
- repeatable manual verification

Success criteria:

- interviewers can capture evidence in the correct fields
- field text persists immediately
- optional backup audio is clearly secondary
- unsupported browsers remain usable
- exported files contain the structured evidence needed for later review

## Next: Session Archive

Potential next scope:

- local session list
- named saved sessions
- reopen previous sessions from the same browser profile
- export archive bundle guidance
- clearer handling of metadata-only audio after reload
- improved manual archive workflow

This should remain local-first unless a backend storage decision is made explicitly.

## Later: Follow-Up Interview Builder

Potential later scope:

- build follow-up question sets from manually reviewed evidence
- duplicate an existing interview into a follow-up session
- track unresolved follow-up prompts
- export follow-up interview plans

This should still preserve the raw evidence record and avoid premature automation.

## Not Yet

The following are deliberately not in scope:

- AI extraction
- AI transcription
- scoring
- summaries
- proposal generation
- CRM integration
- automated recommendations
- cloud sync
- multi-user collaboration

These capabilities require stronger data governance, archive design, review workflows, and user consent decisions before implementation.
