# V2 Data Model

This document defines the planned V2 local-first schema. It is a product and engineering contract for the rebuild, not a statement of what the current V1 prototype already stores.

All JSON records in this document are illustrative planned V2 examples. They are not current repository data and do not imply that V2 persistence has already been implemented.

Related documents:

- [V2 Product Specification](v2_product_spec.md)
- [V2 Technical Architecture](v2_technical_architecture.md)
- [ADR-0003: IndexedDB For Session Archive](decisions/ADR-0003-indexeddb-for-session-archive.md)

## Design Goals

The V2 data model must:

- preserve raw evidence before analysis
- support local session archives
- separate templates from interview sessions
- separate structured text evidence from audio blobs
- support schema versioning and migrations
- support export/import
- record consent/capture acknowledgement
- avoid `localStorage` for interview evidence
- avoid AI extraction, scoring, proposal, recommendation, cloud sync, account, or backend entities in the V2 capture schema

## Storage Target

V2 should use IndexedDB with object stores for durable local data. Store names may change during implementation, but the logical entities below should remain represented.

Suggested database:

- name: `scarlette_interview_recorder`
- schema version: integer, starting at `2` for the V2 archive schema
- primary keys: stable string IDs
- timestamps: ISO 8601 strings
- text encoding: UTF-8 JSON-compatible strings

## Entity Overview

| Entity | Purpose |
| --- | --- |
| App metadata | Current app/schema state, install info, migration state |
| Interview template | Prepared interview type and ordered questions |
| Interview session | A single interview instance and archive record |
| Participant/contact | Person or role involved in the interview |
| Question | Template question snapshot used by a session |
| Answer | Main response and question-level evidence metadata |
| Follow-up answer | Individual follow-up prompt response |
| Audio recording | Optional audio blob metadata and storage link |
| Export bundle | Record of a generated export/import bundle |
| App version/schema version | Version identifiers attached to stored records |

## App Metadata

Tracks global local app state.

```json
{
  "id": "app",
  "appVersion": "2.0.0",
  "schemaVersion": 2,
  "createdAt": "2026-06-12T09:00:00.000Z",
  "lastOpenedAt": "2026-06-12T09:15:00.000Z",
  "lastMigrationAt": "2026-06-12T09:00:00.000Z",
  "installId": "install_01jz0m7w9gqf8a6m4y3t7k2h1p",
  "preferredLocale": "en-GB"
}
```

Notes:

- `installId` identifies the local browser install/profile, not a user account.
- No account ID or remote user ID is stored.

## Interview Template

Defines a reusable prepared interview template.

```json
{
  "id": "template_hr_discovery_v2",
  "schemaVersion": 2,
  "templateVersion": "2.0.0",
  "title": "HR Discovery",
  "description": "Internal admin, chasing, duplication, and staff time evidence.",
  "status": "active",
  "createdAt": "2026-06-12T09:00:00.000Z",
  "updatedAt": "2026-06-12T09:00:00.000Z",
  "questions": [
    {
      "id": "question_hr_1",
      "order": 1,
      "section": "Staff time",
      "prompt": "What process or task consumes more staff time than it should?",
      "followUpPrompts": [
        {
          "id": "followup_hr_1_1",
          "order": 1,
          "prompt": "Who is involved?"
        }
      ]
    }
  ]
}
```

Notes:

- Templates should be versioned.
- A session should snapshot the question prompts it used so old sessions remain stable when templates change.

## Interview Session

Represents one interview and its archive state.

```json
{
  "id": "session_01jz0mp0h3s6j4v8b2x9c1d5e7",
  "schemaVersion": 2,
  "appVersionCreated": "2.0.0",
  "appVersionLastEdited": "2.0.0",
  "templateId": "template_hr_discovery_v2",
  "templateVersion": "2.0.0",
  "title": "Spooner Metals - HR Discovery - 2026-06-12",
  "status": "in_progress",
  "createdAt": "2026-06-12T09:05:00.000Z",
  "startedAt": "2026-06-12T09:08:00.000Z",
  "completedAt": null,
  "lastEditedAt": "2026-06-12T09:40:00.000Z",
  "currentQuestionId": "session_question_01jz0mq3",
  "businessName": "Spooner Metals",
  "department": "HR",
  "location": "Main office",
  "interviewerName": "Scarlette interviewer",
  "interviewerNotes": "Interview conducted in person.",
  "consent": {
    "notesAcknowledged": true,
    "notesAcknowledgedAt": "2026-06-12T09:07:00.000Z",
    "audioAcknowledged": true,
    "audioAcknowledgedAt": "2026-06-12T09:10:00.000Z",
    "captureNoticeVersion": "2026-06-12"
  },
  "tags": ["workflow-discovery"],
  "deletedAt": null
}
```

Session status values:

- `draft`
- `in_progress`
- `review`
- `completed`
- `archived`
- `deleted`

## Interview Participant/Contact

Stores participant/contact metadata for a session.

```json
{
  "id": "participant_01jz0mqz5br2n7a7h2x0k6g4c9",
  "sessionId": "session_01jz0mp0h3s6j4v8b2x9c1d5e7",
  "schemaVersion": 2,
  "name": "Jane Example",
  "role": "HR Manager",
  "department": "HR",
  "contactNotes": "Primary interviewee for HR workflow discovery.",
  "createdAt": "2026-06-12T09:06:00.000Z",
  "updatedAt": "2026-06-12T09:06:00.000Z"
}
```

Notes:

- Contact data is sensitive interview metadata.
- No remote contact lookup should be assumed.

## Question

Stores a session-specific snapshot of a template question.

```json
{
  "id": "session_question_01jz0mq3",
  "sessionId": "session_01jz0mp0h3s6j4v8b2x9c1d5e7",
  "templateQuestionId": "question_hr_1",
  "schemaVersion": 2,
  "order": 1,
  "section": "Staff time",
  "prompt": "What process or task consumes more staff time than it should?",
  "createdAt": "2026-06-12T09:08:00.000Z"
}
```

Notes:

- Session questions should not mutate when templates are updated later.

## Answer

Stores the main answer for one session question.

```json
{
  "id": "answer_01jz0mra6dh6w9v2b0c4f8k1qt",
  "sessionId": "session_01jz0mp0h3s6j4v8b2x9c1d5e7",
  "questionId": "session_question_01jz0mq3",
  "schemaVersion": 2,
  "mainResponse": "The starter checklist is copied into three different systems.",
  "additionalNotes": "Participant emphasized delays at month end.",
  "startedAt": "2026-06-12T09:12:00.000Z",
  "firstEditedAt": "2026-06-12T09:12:20.000Z",
  "lastEditedAt": "2026-06-12T09:18:45.000Z",
  "source": "typed_or_native_dictation",
  "requiredEvidenceState": {
    "mainResponsePresent": true,
    "followUpsComplete": false,
    "reviewed": false
  }
}
```

Recommended `source` values:

- `typed`
- `pasted`
- `native_dictation`
- `typed_or_native_dictation`
- `browser_speech_enhancement`
- `imported`

The source may be approximate. V2 does not need to distinguish typed text from native keyboard dictation at a technical level unless the platform exposes it reliably.

## Follow-Up Answer

Stores each follow-up prompt response separately.

```json
{
  "id": "followup_answer_01jz0ms4qyyg8zpzmpqf7c9xq6",
  "sessionId": "session_01jz0mp0h3s6j4v8b2x9c1d5e7",
  "questionId": "session_question_01jz0mq3",
  "answerId": "answer_01jz0mra6dh6w9v2b0c4f8k1qt",
  "schemaVersion": 2,
  "templateFollowUpId": "followup_hr_1_1",
  "order": 1,
  "prompt": "Who is involved?",
  "response": "HR admin, payroll, and line managers.",
  "firstEditedAt": "2026-06-12T09:13:00.000Z",
  "lastEditedAt": "2026-06-12T09:15:00.000Z",
  "source": "typed_or_native_dictation"
}
```

## Audio Recording

Stores optional audio backup metadata and, when enabled, the blob.

```json
{
  "id": "audio_01jz0mt0t3dwhv1n6h4z9qe5mp",
  "sessionId": "session_01jz0mp0h3s6j4v8b2x9c1d5e7",
  "questionId": "session_question_01jz0mq3",
  "answerId": "answer_01jz0mra6dh6w9v2b0c4f8k1qt",
  "schemaVersion": 2,
  "status": "available",
  "filename": "spooner-metals_hr-discovery_q1_2026-06-12.webm",
  "mimeType": "audio/webm",
  "sizeBytes": 842120,
  "durationSeconds": 92,
  "startedAt": "2026-06-12T09:12:03.000Z",
  "stoppedAt": "2026-06-12T09:13:35.000Z",
  "blobStored": true,
  "blob": "<IndexedDB Blob value>",
  "createdAt": "2026-06-12T09:13:36.000Z",
  "lastVerifiedAt": "2026-06-12T09:13:37.000Z"
}
```

Audio status values:

- `available`
- `metadata_only`
- `deleted`
- `save_failed`
- `exported_external_only`

Notes:

- Store blobs in a dedicated object store.
- Never store blobs in `localStorage`.
- If the blob is missing, the UI and export must say so clearly.
- The `blob` field above represents an IndexedDB Blob value, not JSON that would be embedded directly in a structured export.

## Export Bundle

Tracks generated exports and imports.

```json
{
  "id": "export_01jz0mw4cgaj4xm97bz9k9md6r",
  "schemaVersion": 2,
  "type": "single_session",
  "format": "zip",
  "sessionIds": ["session_01jz0mp0h3s6j4v8b2x9c1d5e7"],
  "includesAudio": true,
  "includesMarkdown": true,
  "includesJson": true,
  "createdAt": "2026-06-12T10:00:00.000Z",
  "appVersion": "2.0.0",
  "schemaVersionExported": 2,
  "filename": "scarlette-export-2026-06-12-session_01jz0mp0.zip",
  "manifestHash": null,
  "notes": "User-generated download; file storage after download is outside app control."
}
```

Export types:

- `single_session`
- `archive`
- `audio_only`
- `imported_archive`

Notes:

- `manifestHash` should be set only when export hashing is implemented and computed during export generation.

## Export JSON Shape

A V2 session export should be self-contained for structured evidence:

```json
{
  "exportManifest": {
    "exportedAt": "2026-06-12T10:00:00.000Z",
    "appVersion": "2.0.0",
    "schemaVersion": 2,
    "exportType": "single_session",
    "includesAudio": true
  },
  "sessions": [
    {
      "id": "session_01jz0mp0h3s6j4v8b2x9c1d5e7",
      "businessName": "Spooner Metals",
      "templateTitle": "HR Discovery",
      "participants": [],
      "questions": [],
      "answers": [],
      "followUpAnswers": [],
      "audioRecordings": []
    }
  ]
}
```

## Schema Versioning

Every persisted entity should include:

- `schemaVersion`
- created timestamp where relevant
- last edited timestamp where relevant
- app version where relevant

The IndexedDB database version should be an integer. Entity `schemaVersion` should also be an integer so exported records can be migrated after import.

Recommended initial V2 values:

- IndexedDB database version: `2`
- entity schema version: `2`
- app version: from the deployed app build metadata

## Migration Notes

V2 should support these migration paths:

1. Fresh install with no V1 data.
2. Browser profile with current V1 `localStorage` session.
3. Import of V2 JSON/archive export.
4. Future V2 schema upgrades.

V1 migration guidance:

- Detect `scarlette.interviewRecorder.session.v1`.
- Offer to import it into the V2 archive.
- Preserve main responses, follow-up responses, notes, template ID, current question, and recording metadata.
- Mark V1 audio as `metadata_only` because V1 audio blobs are not persisted after reload.
- Do not delete V1 `localStorage` until the user confirms migration success.

Migration failure behavior:

- Leave the original data untouched.
- Show a visible error.
- Offer export of the raw V1 JSON when possible.
- Record failure in `migration_log`.

## Deletion And Retention

V2 should prefer soft deletion for sessions:

- Set `deletedAt` and `status: "deleted"` first.
- Provide a confirmable permanent delete action later if needed.
- Include clear warnings that browser storage and exported files are outside app recovery once deleted.

Audio deletion should update both audio metadata and blob storage in the same transaction where possible.
