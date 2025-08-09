import { getServerEnv, getServiceAccountObject } from '@/lib/env';

export async function GET() {
  try {
    const env = getServerEnv();
    const sa = getServiceAccountObject();
    const result = {
      ok: true,
      projectId: env.GCP_PROJECT_ID,
      bucket: env.GCS_BUCKET,
      vertexLocation: env.VERTEX_LOCATION || env.GCP_LOCATION,
      serviceAccountEmail: sa?.client_email || null,
      hasServiceAccountKey: Boolean(sa?.client_email && sa?.private_key),
    };
    return Response.json(result, { status: 200 });
  } catch (err) {
    return Response.json(
      {
        ok: false,
        error: err?.message || 'Invalid configuration',
      },
      { status: 500 },
    );
  }
}


