import { VertexAI } from '@google-cloud/vertexai';
import { getServerEnv, getServiceAccountObject } from '@/lib/env';

let cached = null;

// If systemInstruction is provided, we return a fresh model instance (no caching)
export function getVertexModel(modelNameOverride, systemInstruction) {
  const env = getServerEnv();
  const credentials = getServiceAccountObject();

  const vertex = new VertexAI({
    project: env.GCP_PROJECT_ID,
    location: env.VERTEX_LOCATION || env.GCP_LOCATION,
    googleAuthOptions: { credentials },
  });

  const modelName = modelNameOverride || env.VERTEX_MODEL || 'gemini-1.5-pro-002';

  if (systemInstruction) {
    return vertex.getGenerativeModel({ model: modelName, systemInstruction });
  }

  if (cached && cached.modelName === modelName) {
    return cached.model;
  }

  const model = vertex.getGenerativeModel({ model: modelName });
  cached = { model, modelName };
  return model;
}

export function extractJson(text) {
  if (!text) throw new Error('Empty model response');
  // Remove code fences if present
  const trimmed = text.trim().replace(/^```json\n?|```$/g, '').trim();
  // Try direct parse
  try {
    return JSON.parse(trimmed);
  } catch (_) {
    // Fallback: find first '{' and last '}'
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      const candidate = trimmed.slice(start, end + 1);
      return JSON.parse(candidate);
    }
    throw new Error('Failed to parse JSON from model response');
  }
}

// Normalize text extraction across SDK response variants
export function getTextFromGenResponse(genResponse) {
  // Newer SDK: resp.response.candidates[*].content.parts[*].text
  const r = genResponse?.response || genResponse;
  if (!r) return '';
  if (typeof r.text === 'function') {
    try { return r.text(); } catch { /* fallthrough */ }
  }
  if (Array.isArray(r.candidates)) {
    let out = '';
    for (const cand of r.candidates) {
      const parts = cand?.content?.parts || [];
      for (const p of parts) {
        if (typeof p.text === 'string') out += p.text;
      }
    }
    return out.trim();
  }
  return '';
}


