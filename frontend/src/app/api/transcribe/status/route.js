import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getTranscriptionStatus } from '@/lib/speech';

const QuerySchema = z.object({
  operationName: z.string().min(1, 'operationName is required'),
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = QuerySchema.parse({ operationName: searchParams.get('operationName') });
    const status = await getTranscriptionStatus({ operationName: parsed.operationName });
    return NextResponse.json({ ok: true, ...status }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to get status' },
      { status: 400 },
    );
  }
}


