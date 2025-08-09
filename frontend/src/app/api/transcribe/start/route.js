import { NextResponse } from 'next/server';
import { z } from 'zod';
import { startMedicalTranscription } from '@/lib/speech';

const BodySchema = z.object({
  gcsUri: z.string().min(1, 'gcsUri is required'),
  languageCode: z.string().default('en-US'),
});

export async function POST(request) {
  try {
    const body = BodySchema.parse(await request.json());
    const operationName = await startMedicalTranscription({
      gcsUri: body.gcsUri,
      languageCode: body.languageCode,
    });

    return NextResponse.json({ ok: true, operationName }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to start transcription' },
      { status: 400 },
    );
  }
}


