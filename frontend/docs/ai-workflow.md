### Speech → Summary → Review → Finalise workflow

This document describes the end‑to‑end pipeline used by the input page.

High level steps
1) Speech is recorded and uploaded; Google Medical STT transcribes it
2) `ai-summarization-prompt.md` converts the transcript into the required fields
3) `ai-documentation-reviewer.md` validates the summary against the transcript (no hallucinations)
4) `final-summariser.md` emits final UI fields: auto‑fill only when the review verdict is `pass`; otherwise return fields as "Data not mentioned" and require manual review

Current implementation
- Done
  - Upload signed URL: `POST /api/audio/upload-init`
  - Start transcription: `POST /api/transcribe/start`
  - Poll status: `GET /api/transcribe/status?operationName=...`
  - UI: `Start Recording` card and `Conversation Transcription` card on `src/app/input/page.js`

- Next endpoints (to be added)
  - `POST /api/summarize`
    - Input: `{ conversationId?, transcript }`
    - Action: call Vertex AI with the prompt from `docs/ai-summarization-prompt.md`
    - Output: `{ ok, summaryJson }` matching the strict schema
  - `POST /api/review`
    - Input: `{ transcript, proposedJson }`
    - Action: call Vertex AI with `docs/ai-documentation-reviewer.md`
    - Output: `{ ok, review }` where `review.verdict in {pass,review,fail}` and `review.finalJson` holds corrected fields
  - `POST /api/finalise`
    - Input: `{ review }`
    - Action: apply `docs/final-summariser.md`
    - Output: `{ ok, approved, fields, notes }`

UI orchestration (input page)
- After `transcription: done`:
  - Call `/api/summarize` with transcript
  - Call `/api/review` with transcript + proposed JSON
  - Call `/api/finalise` with reviewer output
  - If `approved: true` → auto‑fill all fields
  - Else → set all fields to "Data not mentioned" and show a banner: "Manual clinician review required"

JSON contracts
- Summary JSON (from summarizer and reviewer.finalJson):
```json
{
  "chiefComplaint": "",
  "historyPresent": "",
  "vitalSigns": "",
  "physicalExam": "",
  "assessment": "",
  "plan": ""
}
```
- Reviewer output (see `docs/ai-documentation-reviewer.md`)
- Final output (see `docs/final-summariser.md`)

Operational notes
- CORS: bucket must allow browser PUT/OPTIONS from the app origin(s)
- Regions: STT and Vertex should use the same region (e.g., `asia-southeast1`)
- Privacy: service account used server‑side only; no secrets in client

Error handling
- Upload: show retry, keep transcript state untouched
- STT: if failed, display error and allow re‑record/retry
- Summarize/Review/Finalise: on any failure, do not auto‑fill; show banner for manual review


