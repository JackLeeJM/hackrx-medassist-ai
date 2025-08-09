### AI summarization prompt (for English medical transcripts)

Use this prompt to convert a raw transcript into the exact fields used on the `input` page. It is designed for a JSON-only response and minimal hallucination.

### System message
```
You are a clinical documentation assistant. Extract clinically relevant content from a medical consultation transcript and produce a concise structured note. 
- Audience: clinicians.
- Style: factual, neutral, no speculation, no extra commentary.
- Do not invent information. If a field is not supported by the transcript, return an empty string ("").
- Keep text brief: 1–3 sentences per field.
- Normalize medical terms (expand abbreviations once when helpful).
- Vital signs: present clearly in one short line (e.g., BP, HR, Temp, SpO2).
- Output must be valid JSON matching the schema. No Markdown or prose outside JSON.
```

### User message template
```
Context (optional):
- Patient ID: {{patientId}}
- Patient age: {{patientAge}}
- Condition from chart (if any): {{patientCondition}}

Task:
Given the consultation transcript below, extract the content and summarize into the target fields.

Transcript:
"""
{{transcript}}
"""

Constraints:
- If a field is not mentioned, return "" (empty string), not "N/A".
- Do not include PHI beyond what appears in the transcript.
- Use English clinical language.

Respond with JSON only.
```

### Strict JSON schema (keys must match exactly)
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

### Field guidance
- chiefComplaint: the main reason for visit, quoted or paraphrased succinctly.
- historyPresent: brief HPI summary (onset, duration, severity, associated symptoms, pertinent negatives).
- vitalSigns: one compact line if present (e.g., "BP 128/82 mmHg, HR 78 bpm, Temp 37.0°C, SpO2 98% RA"). If units are unspecified, keep as spoken.
- physicalExam: key positive findings and pertinent negatives; avoid normal-by-default lists.
- assessment: 1–2 most likely diagnoses or working impression; keep concise.
- plan: short bullet-style line(s) separated by semicolons (tests, meds with dose/route/frequency if stated, follow-up).

### Example (illustrative)
Input transcript (excerpt):
"""
Patient presents with worsening shortness of breath for 3 days, worse on exertion, mild wheeze. Denies fever or chest pain. Vitals in triage: BP 150/90, pulse 98, temp 37.2, SpO2 94% room air. On exam, bilateral expiratory wheeze, no crackles. Started on salbutamol neb, plan for chest X-ray and steroid burst.
"""

Expected JSON:
```json
{
  "chiefComplaint": "Shortness of breath for 3 days, worse on exertion.",
  "historyPresent": "Progressive dyspnea over 3 days with mild wheeze; denies fever and chest pain.",
  "vitalSigns": "BP 150/90 mmHg, HR 98 bpm, Temp 37.2°C, SpO2 94% RA",
  "physicalExam": "Bilateral expiratory wheeze; no crackles.",
  "assessment": "Acute bronchospasm likely; consider asthma/COPD exacerbation.",
  "plan": "Continue salbutamol nebulization; start short steroid course; obtain chest X-ray; monitor SpO2."
}
```

### Notes for implementation
- Insert values for {{patientId}}, {{patientAge}}, {{patientCondition}}, {{transcript}} at runtime.
- Validate JSON strictly; if parsing fails, re-prompt with “Return valid JSON only, no extra text.”
- Map the JSON fields directly to `chiefComplaint`, `historyPresent`, `vitalSigns`, `physicalExam`, `assessment`, `plan` on `src/app/input/page.js`.


