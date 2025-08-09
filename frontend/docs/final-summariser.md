### Final Summariser

Purpose: consume the output from `docs/ai-documentation-reviewer.md` and produce the final, UI-ready fields. Only auto-fill when the reviewer’s `verdict` is `pass`.

### System message
```
You are the finalisation step in a clinical documentation pipeline.
Input is the JSON produced by the AI Documentation Reviewer (verdict, issues, finalJson).

Rules:
- If `verdict` == `pass`, return `approved: true` and emit `fields` exactly equal to `finalJson`.
- If `verdict` != `pass` (review or fail), return `approved: false`, emit `fields` exactly equal to `finalJson` (with actual extracted data), and include a concise `notes` string describing that manual clinician review is required.
- Output must be valid JSON with the schema below. No extra commentary.
```

### User message template
```
Reviewer output JSON:
```json
{{reviewerOutputJson}}
```

Produce the final fields for the UI following the rules above.
Respond with JSON only.
```

### Output schema
```json
{
  "approved": false,
  "fields": {
    "chiefComplaint": "",
    "historyPresent": "",
    "vitalSigns": "",
    "physicalExam": "",
    "assessment": "",
    "plan": ""
  },
  "notes": ""
}
```

### Examples

Pass case (auto-fill):
Input reviewer output (abridged):
```json
{ "verdict": "pass", "finalJson": {"chiefComplaint":"…","historyPresent":"…","vitalSigns":"…","physicalExam":"…","assessment":"…","plan":"…"} }
```
Expected final output:
```json
{
  "approved": true,
  "fields": {
    "chiefComplaint": "…",
    "historyPresent": "…",
    "vitalSigns": "…",
    "physicalExam": "…",
    "assessment": "…",
    "plan": "…"
  },
  "notes": ""
}
```

Review/fail case (populate fields but require manual review):
Input reviewer output (abridged):
```json
{ "verdict": "review", "issues": [{"field":"assessment","type":"unsupported"}], "finalJson": {"chiefComplaint":"Patient reports chest pain","historyPresent":"Pain started 2 hours ago","vitalSigns":"BP 140/90, HR 85","physicalExam":"Chest clear, no distress","assessment":"Possible cardiac etiology","plan":"ECG, cardiac enzymes"} }
```
Expected final output:
```json
{
  "approved": false,
  "fields": {
    "chiefComplaint": "Patient reports chest pain",
    "historyPresent": "Pain started 2 hours ago",
    "vitalSigns": "BP 140/90, HR 85",
    "physicalExam": "Chest clear, no distress",
    "assessment": "Possible cardiac etiology",
    "plan": "ECG, cardiac enzymes"
  },
  "notes": "Reviewer verdict is not pass; manual clinician review required."
}
```


