import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSignedUploadUrl } from '@/lib/storage';
import { createConversationShape, ConversationStatus } from '@/lib/types';

const BodySchema = z.object({
  contentType: z.string().default('audio/webm'),
  fileName: z.string().default('audio.webm'),
  languageCode: z.string().default('en-US'),
});

export async function POST(request) {
  try {
    const json = await request.json();
    const body = BodySchema.parse(json);

    const { uploadUrl, gcsUri } = await createSignedUploadUrl({
      contentType: body.contentType,
      fileName: body.fileName,
    });

    // For now, return a stub conversation object (DB integration later)
    const conversation = createConversationShape({
      id: crypto.randomUUID(),
      languageCode: body.languageCode,
      audioGcsUri: gcsUri,
      status: ConversationStatus.PendingUpload,
    });

    return NextResponse.json(
      {
        ok: true,
        uploadUrl,
        gcsUri,
        conversation,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to init upload' },
      { status: 400 },
    );
  }
}


