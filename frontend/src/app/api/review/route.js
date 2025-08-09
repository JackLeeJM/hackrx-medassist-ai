import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getVertexModel, extractJson, getTextFromGenResponse } from '@/lib/vertex';
import fs from 'node:fs/promises';
import path from 'node:path';

const BodySchema = z.object({
  transcript: z.string().min(1),
  proposedJson: z.any(),
});

function loadPrompt(file) {
  return fs.readFile(path.join(process.cwd(), 'docs', file), 'utf8');
}

export async function POST(req) {
  try {
    const body = BodySchema.parse(await req.json());
    const systemPrompt = await loadPrompt('ai-documentation-reviewer.md');
    const model = getVertexModel(undefined, systemPrompt);

    const user = `Transcript:\n"""\n${body.transcript}\n"""\n\nProposed JSON from the summarizer:\n\n\`\`\`json\n${JSON.stringify(
      body.proposedJson,
      null,
      2,
    )}\n\`\`\``;

    const resp = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: user }] }] });
    const text = getTextFromGenResponse(resp);
    const json = extractJson(text);
    return NextResponse.json({ ok: true, review: json }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message || 'review failed' }, { status: 400 });
  }
}


