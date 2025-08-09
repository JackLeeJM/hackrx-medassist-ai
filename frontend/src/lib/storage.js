import { Storage } from '@google-cloud/storage';
import crypto from 'node:crypto';
import { getServerEnv, getServiceAccountObject } from '@/lib/env';

let cachedStorage = null;

function getStorage() {
  if (cachedStorage) return cachedStorage;
  const env = getServerEnv();
  const credentials = getServiceAccountObject();
  cachedStorage = new Storage({
    projectId: env.GCP_PROJECT_ID,
    credentials,
  });
  return cachedStorage;
}

export async function createSignedUploadUrl({ contentType, fileName }) {
  const env = getServerEnv();
  const storage = getStorage();

  const cleanName = fileName?.replace(/[^a-zA-Z0-9_.-]/g, '_') || 'audio.webm';
  const unique = crypto.randomUUID();
  const objectName = `audio/${unique}-${cleanName}`;

  const bucket = storage.bucket(env.GCS_BUCKET);
  const file = bucket.file(objectName);

  const expires = Date.now() + 15 * 60 * 1000; // 15 minutes
  const [url] = await file.getSignedUrl({
    action: 'write',
    expires,
    contentType: contentType || 'audio/webm',
    version: 'v4',
  });

  const gcsUri = `gs://${env.GCS_BUCKET}/${objectName}`;
  return { uploadUrl: url, gcsUri, objectName };
}


