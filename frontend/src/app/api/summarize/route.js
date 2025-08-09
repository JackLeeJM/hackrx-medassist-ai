import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getVertexModel, extractJson, getTextFromGenResponse } from '@/lib/vertex';
import fs from 'node:fs/promises';
import path from 'node:path';

const BodySchema = z.object({
  transcript: z.string().min(1, 'transcript required'),
  patientContext: z
    .object({ patientId: z.string().optional(), patientAge: z.number().optional(), patientCondition: z.string().optional() })
    .optional(),
});

function loadPrompt(file) {
  return fs.readFile(path.join(process.cwd(), 'docs', file), 'utf8');
}

export async function POST(req) {
  try {
    const body = BodySchema.parse(await req.json());
    const systemPrompt = await loadPrompt('ai-summarization-prompt.md');
    const model = getVertexModel(undefined, systemPrompt);

    const user = `Context (optional):\n- Patient ID: ${body.patientContext?.patientId || ''}\n- Patient age: ${
      body.patientContext?.patientAge ?? ''
    }\n- Condition from chart (if any): ${body.patientContext?.patientCondition || ''}\n\nTranscript:\n"""\n${body.transcript}\n"""`;

    const resp = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: user }] }] });
    const text = getTextFromGenResponse(resp);
    const json = extractJson(text);
    return NextResponse.json({ ok: true, summaryJson: json }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message || 'summarize failed' }, { status: 400 });
  }
}


