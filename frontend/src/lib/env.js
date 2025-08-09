// Server-side environment validation using zod
// Do not import this from client components
import { z } from 'zod';

const EnvSchema = z.object({
  GCP_PROJECT_ID: z.string().min(1, 'GCP_PROJECT_ID is required'),
  GCP_LOCATION: z.string().default('us-central1'),
  GCS_BUCKET: z.string().min(1, 'GCS_BUCKET is required'),
  // Base64-encoded JSON service account key
  GOOGLE_APPLICATION_CREDENTIALS_JSON: z.string().min(1, 'GOOGLE_APPLICATION_CREDENTIALS_JSON is required'),
  VERTEX_LOCATION: z.string().optional(),
  VERTEX_MODEL: z.string().default('gemini-1.5-pro-002'),
});

let cachedEnv = null;

export function getServerEnv() {
  if (cachedEnv) return cachedEnv;

  const parsed = EnvSchema.safeParse({
    GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
    GCP_LOCATION: process.env.GCP_LOCATION || 'us-central1',
    GCS_BUCKET: process.env.GCS_BUCKET,
    GOOGLE_APPLICATION_CREDENTIALS_JSON: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
    VERTEX_LOCATION: process.env.VERTEX_LOCATION || process.env.GCP_LOCATION || 'us-central1',
    VERTEX_MODEL: process.env.VERTEX_MODEL || 'gemini-1.5-pro-002',
  });

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid server environment configuration:\n${issues}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function getServiceAccountObject() {
  const { GOOGLE_APPLICATION_CREDENTIALS_JSON } = getServerEnv();
  try {
    const decoded = Buffer.from(GOOGLE_APPLICATION_CREDENTIALS_JSON, 'base64').toString('utf-8');
    const obj = JSON.parse(decoded);
    if (!obj.client_email || !obj.private_key) {
      throw new Error('Service account JSON missing client_email or private_key');
    }
    return obj;
  } catch (err) {
    throw new Error(`Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON: ${err?.message || err}`);
  }
}


