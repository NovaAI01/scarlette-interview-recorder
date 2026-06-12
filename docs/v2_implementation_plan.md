# V2 Implementation Plan

This plan phases the rebuild from prototype to durable local-first product. Each phase has a stop condition so implementation does not drift into deferred features.

Related documents:

- [V2 Product Specification](v2_product_spec.md)
- [V2 Technical Architecture](v2_technical_architecture.md)
- [V2 Data Model](v2_data_model.md)
- [V2 Test Strategy](v2_test_strategy.md)
- [Known Risks](known_risks.md)

## Phase 0 - Product Reset And Architecture Foundation

Objective:

Define the V2 product boundary, architecture direction, data model, risk register, and release checklist before rewriting the app.

Files likely affected:

- `README.md`
- `docs/v2_product_spec.md`
- `docs/v2_technical_architecture.md`
- `docs/v2_data_model.md`
- `docs/v2_implementation_plan.md`
- `docs/v2_test_strategy.md`
- `docs/known_risks.md`
- `docs/decisions/*.md`

Acceptance criteria:

- V2 principles are documented.
- Current prototype risks are explicitly captured.
- V2 storage, input, audio, service worker, and export direction are documented.
- README distinguishes current V1 prototype from planned V2.
- README records the current hosted GitHub Pages URL without implying V2 is deployed there.
- No runtime app behavior is changed.

Manual verification:

- Review docs for unsupported feature claims.
- Run `git status -sb`.
- Run `git diff --stat`.
- Run `find docs -maxdepth 3 -type f | sort`.

Risks:

- Documentation may over-specify implementation details too early.
- README may accidentally imply V2 exists.

Stop condition:

- Stop when docs are complete and no app rewrite has started.

## Phase 1 - App Shell And Modular Structure

Objective:

Create the V2 app skeleton with clean source boundaries while preserving static PWA deployment.

Files likely affected:

- `src/`
- `src/main.ts`
- `src/app/*`
- `src/ui/*`
- `src/styles/*`
- `src/pwa/*`
- `index.html`
- `manifest.webmanifest`
- future build config files if Vite + TypeScript is adopted

Acceptance criteria:

- App loads from the hosted root URL.
- Static build output can be deployed without a backend.
- UI shell renders a template list area and app version.
- Service worker registration is isolated from capture logic.
- No session archive logic is implemented yet beyond non-functional shell wiring.

Manual verification:

- Run local static preview/build preview according to the chosen setup.
- Open root URL and direct app URL.
- Confirm install manifest is valid.
- Confirm normal users still do not need developer commands.

Risks:

- Build setup could weaken the simple static deployment model.
- Early app shell work could start reimplementing features before storage design is ready.

Stop condition:

- Stop when the modular shell runs and deployment/access assumptions are proven.

## Phase 2 - Local Database/Session Archive

Objective:

Implement IndexedDB foundations, migrations, repository boundaries, and local session archive list.

Files likely affected:

- `src/storage/db.ts`
- `src/storage/repositories.ts`
- `src/storage/migrations.ts`
- `src/storage/quota.ts`
- `src/types/domain.ts`
- `src/types/storage.ts`
- archive view components

Acceptance criteria:

- IndexedDB database opens with schema versioning.
- Sessions can be created, listed, reopened, soft-deleted, and restored if supported.
- Structured records are stored in separate stores according to the V2 data model.
- V1 `localStorage` data is detected and offered for import.
- Storage write failures produce visible errors.
- `localStorage` is not used for interview evidence.

Manual verification:

- Create multiple sessions.
- Reload and confirm sessions remain.
- Close and reopen browser, then confirm sessions remain.
- Use browser devtools to inspect object stores.
- Simulate blocked/unavailable IndexedDB where practical.
- Confirm V1 localStorage migration does not delete source data without confirmation.

Risks:

- IndexedDB migrations can corrupt data if not transactional.
- Browser storage eviction can still remove local archive data.
- V1 migration may produce metadata-only audio records.

Stop condition:

- Stop when archive persistence is reliable enough to build capture flow on top of it.

## Phase 3 - Interview Template And Capture Flow

Objective:

Rebuild the core template selection, session metadata, question navigation, structured capture, review warnings, and autosave.

Files likely affected:

- `src/templates/*`
- `src/capture/captureSession.ts`
- `src/capture/captureViews.ts`
- `src/capture/reviewRules.ts`
- `src/capture/consent.ts`
- `src/ui/forms.ts`
- `src/storage/repositories.ts`

Acceptance criteria:

- User can select a prepared template.
- Session captures participant/contact metadata.
- Consent/capture acknowledgement is required before note capture.
- Each question has main response, follow-up answers, and additional notes.
- Text persists after input, navigation, reload, and app relaunch.
- Review screen reports missing required evidence.
- Navigation cannot lose unsaved text.

Manual verification:

- Complete one session across all questions.
- Leave some fields blank and verify warnings.
- Edit evidence from review.
- Reload after each major step and confirm state is correct.
- Confirm session list shows meaningful titles and timestamps.

Risks:

- Autosave timing could miss rapid phone dictation updates.
- Template edits could affect existing sessions if prompts are not snapshotted.

Stop condition:

- Stop when structured text capture and review are reliable without audio or browser speech recognition.

## Phase 4 - iPhone-Safe Input Workflow

Objective:

Optimize phone input, especially iPhone Safari/Home Screen PWA, around textarea focus and native keyboard dictation.

Files likely affected:

- `src/capture/inputStrategy.ts`
- `src/capture/captureViews.ts`
- `src/ui/forms.ts`
- `src/styles/capture.css`
- `docs/v2_test_strategy.md`

Acceptance criteria:

- iPhone capture flow uses normal textareas.
- Native keyboard microphone inserts editable text into the active textarea.
- Text autosaves after native dictation insertion.
- No Web Speech API button is shown as the primary iPhone path.
- Manual typing always works even if microphone permission is denied.
- App does not freeze when browser speech APIs are absent or unreliable.

Manual verification:

- Install hosted app on iPhone Safari.
- Launch from Home Screen.
- Tap each evidence textarea and use native keyboard microphone.
- Correct dictated text manually.
- Navigate, reload, and relaunch to confirm persistence.
- Deny microphone permission for optional audio and confirm text input still works.

Risks:

- iOS PWA keyboard behavior may differ from Safari tab behavior.
- Native dictation may insert text after a delayed input event.
- Viewport resizing can hide controls while the keyboard is open.

Stop condition:

- Stop when iPhone text capture is reliable enough for real interviews without browser `SpeechRecognition`.

## Phase 5 - Optional Audio Backup Persistence

Objective:

Either implement reliable optional audio persistence in IndexedDB or explicitly defer audio backup from the first V2 release.

Files likely affected:

- `src/audio/audioRecorder.ts`
- `src/audio/audioRepository.ts`
- `src/audio/audioSupport.ts`
- `src/storage/quota.ts`
- `src/storage/repositories.ts`
- capture/review/export views

Acceptance criteria if implemented:

- Audio recording requires explicit audio consent acknowledgement.
- Microphone support is detected before recording.
- Completed audio blobs are saved to IndexedDB.
- Audio remains playable after reload and app relaunch where browser storage persists.
- Audio records display size, duration, and status.
- Quota warnings appear before large recordings become risky.
- Export can include audio or clearly report exclusion.

Acceptance criteria if deferred:

- Audio controls are not shown as implemented.
- Product copy clearly states audio backup is deferred.
- Data model still reserves audio extension points.

Manual verification:

- Record, stop, reload, and replay.
- Record multiple question backups.
- Deny microphone permission and recover.
- Fill storage where practical and verify warnings.
- Export with and without audio.

Risks:

- Audio blobs can exhaust IndexedDB quota.
- Safari codec and blob persistence behavior can differ by version.
- Long recordings may fail or become too large for phone export.

Stop condition:

- Stop when audio is either reliable and exportable or explicitly deferred.

## Phase 6 - Review/Export/Import

Objective:

Implement durable review, single-session export, archive export, and import path on top of the completed capture/archive foundation.

Files likely affected:

- `src/storage/exportImport.ts`
- `src/capture/reviewRules.ts`
- `src/ui/exportViews.ts`
- `src/types/domain.ts`
- `docs/v2_test_strategy.md`

Acceptance criteria:

- JSON export includes schema/app version, session metadata, participant data, questions, answers, follow-up answers, consent metadata, and audio metadata.
- Markdown export is readable and complete.
- Archive export includes all selected sessions.
- Audio inclusion/exclusion is explicit.
- Import validates schema version and migrates supported exports.
- Failed imports do not damage existing archive data.
- iPhone export flow is usable and avoids uncontrolled multiple downloads where possible.
- Export/import does not perform AI extraction, scoring, summaries, recommendations, proposal generation, or cloud sync.

Manual verification:

- Export a complete session.
- Export an incomplete session with warnings.
- Import into a fresh browser profile.
- Compare imported records to source records.
- Test iPhone download/share behavior.

Risks:

- Zip support may require a dependency.
- Browser download behavior varies on iPhone.
- Import validation can be too permissive or too strict.

Stop condition:

- Stop when structured export/import can round-trip at least one representative session.

## Phase 7 - PWA Install/Offline/Update Reliability

Objective:

Make install, offline launch, cache update, and stale version handling reliable.

Files likely affected:

- `service-worker.js` or generated service worker source
- `src/pwa/registerServiceWorker.ts`
- `src/pwa/updatePrompt.ts`
- `manifest.webmanifest`
- `README.md`
- `docs/v2_test_strategy.md`

Acceptance criteria:

- Hosted app installs on supported desktop browsers and iPhone Safari.
- Installed app launches from icon.
- App shell opens offline after first successful load.
- IndexedDB archive remains available offline.
- New app versions surface an update prompt.
- Active interviews are not interrupted by forced reload.
- App version is visible in an appropriate place.

Manual verification:

- Install on desktop.
- Install on iPhone.
- Launch offline.
- Update deployment and confirm update prompt appears.
- Accept update from a safe screen and confirm new version.

Risks:

- Service worker scope/start URL mistakes can break install.
- Cache-first behavior can keep stale code alive.
- Update prompts can disrupt active capture.

Stop condition:

- Stop when install/offline/update behavior passes the release checklist.

## Phase 8 - Release Polish And Documentation

Objective:

Prepare V2 for real-world use with polished docs, screenshots, status, and release checks.

Files likely affected:

- `README.md`
- `docs/manual_test_plan.md`
- `docs/v2_test_strategy.md`
- `docs/data_privacy.md`
- `docs/access_layer_standard.md`
- screenshots or assets once real screenshots exist

Acceptance criteria:

- README states current status accurately.
- Live URL is included once known.
- Real screenshots are added only after verification.
- Privacy model is clear.
- Access model is clear.
- Manual release checklist is complete.
- Known risks and mitigations are up to date.
- No unsupported feature claims remain.
- Real-interview readiness is gated on manual hosted PWA, iPhone, offline, storage, audio decision, service worker, and export verification.

Manual verification:

- External reviewer can follow README to open/use/deploy the app.
- Release checklist passes on target browsers/devices.
- Docs match the implemented app.

Risks:

- Docs can drift from implementation.
- Screenshots can become stale.
- Release pressure can skip iPhone checks.

Stop condition:

- Stop when V2 is documented and verified for its release boundary.

## Phase 9 - Later Follow-Up Interview Builder

Objective:

Plan a later feature that helps create follow-up interview plans from manually reviewed evidence.

Files likely affected:

- future planning docs
- future template/follow-up modules
- export/import modules if plans become exportable

Acceptance criteria:

- The feature remains manual and evidence-first unless a future AI decision is approved.
- Follow-up plans link back to original raw evidence.
- No automated recommendations are added without a separate product decision.

Manual verification:

- Build a follow-up plan from a completed archived session.
- Confirm source evidence links are preserved.
- Export the follow-up plan.

Risks:

- Follow-up planning can turn into premature analysis.
- Users may mistake planning prompts for validated recommendations.

Stop condition:

- Stop when follow-up planning has its own approved scope and does not weaken the evidence archive.
