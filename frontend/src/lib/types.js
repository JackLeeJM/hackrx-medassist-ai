// Simple JS shapes for conversations, transcripts, and summaries

export const ConversationStatus = {
  PendingUpload: 'pending_upload',
  Processing: 'processing',
  Transcribed: 'transcribed',
  Summarized: 'summarized',
  Error: 'error',
};

export function createConversationShape(init) {
  const now = new Date().toISOString();
  return {
    id: init.id,
    createdAt: now,
    createdBy: init.createdBy || null,
    audioGcsUri: init.audioGcsUri || null,
    languageCode: init.languageCode || 'en-US',
    sttModel: init.sttModel || 'medical_conversation',
    status: init.status || ConversationStatus.PendingUpload,
    operationId: null,
    error: null,
  };
}

export function createTranscriptShape(init) {
  const now = new Date().toISOString();
  return {
    id: init.id,
    conversationId: init.conversationId,
    text: init.text || '',
    confidence: typeof init.confidence === 'number' ? init.confidence : null,
    wordsJson: init.wordsJson || null,
    diarization: init.diarization || null,
    createdAt: now,
  };
}

export function createSummaryShape(init) {
  const now = new Date().toISOString();
  return {
    id: init.id,
    conversationId: init.conversationId,
    structuredJson: init.structuredJson || {},
    rawSummaryText: init.rawSummaryText || '',
    model: init.model || 'vertex-gemini',
    createdAt: now,
    version: init.version || 1,
  };
}


