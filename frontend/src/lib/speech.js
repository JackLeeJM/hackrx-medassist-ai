import speech from '@google-cloud/speech';
import { getServerEnv, getServiceAccountObject } from '@/lib/env';

let cachedClient = null;

function getSpeechClient() {
  if (cachedClient) return cachedClient;
  const credentials = getServiceAccountObject();
  cachedClient = new speech.SpeechClient({ credentials });
  return cachedClient;
}

export async function startMedicalTranscription({
  gcsUri,
  languageCode = 'en-US',
  enableDiarization = true,
  speechContexts = [],
}) {
  if (!gcsUri) throw new Error('gcsUri is required');
  const client = getSpeechClient();

  // Pick encoding based on the file extension; default to WEBM_OPUS
  const lower = gcsUri.toLowerCase();
  const encoding =
    lower.endsWith('.ogg') || lower.includes('.ogg?') ? 'OGG_OPUS' : 'WEBM_OPUS';
  const request = {
    config: {
      languageCode,
      model: 'medical_conversation',
      useEnhanced: true,
      enableAutomaticPunctuation: true,
      enableSpeakerDiarization: enableDiarization,
      diarizationSpeakerCount: enableDiarization ? 2 : undefined,
      speechContexts: speechContexts.length ? [{ phrases: speechContexts }] : undefined,
      // CRITICAL: tell STT this is Opus at 48 kHz
      encoding,
      sampleRateHertz: 48000,
    },
    audio: { uri: gcsUri },
  };

  const [operation] = await client.longRunningRecognize(request);
  return operation.name;
}

export async function getTranscriptionStatus({ operationName }) {
  if (!operationName) throw new Error('operationName is required');
  const client = getSpeechClient();

  // Use helper which decodes response without accessing internal protos
  const lro = await client.checkLongRunningRecognizeProgress(operationName);
  const isDone = Boolean(lro?.latestResponse?.done);
  if (!isDone) {
    return { done: false };
  }

  // Promise resolves immediately if already done
  const [response] = await lro.promise();

  // Concatenate best alternative transcripts
  let transcriptText = '';
  let totalConfidence = 0;
  let altCount = 0;
  for (const result of response.results || []) {
    const alt = result.alternatives?.[0];
    if (alt?.transcript) {
      transcriptText += (transcriptText ? '\n' : '') + alt.transcript;
      if (typeof alt.confidence === 'number') {
        totalConfidence += alt.confidence;
        altCount += 1;
      }
    }
  }
  const avgConfidence = altCount > 0 ? totalConfidence / altCount : null;

  return {
    done: true,
    transcript: transcriptText,
    confidence: avgConfidence,
    raw: response,
  };
}
