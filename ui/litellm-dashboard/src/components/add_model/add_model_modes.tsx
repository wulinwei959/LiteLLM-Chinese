// Define the available test modes
export const TEST_MODES = [
  { value: "chat", labelKey: "testModeChat" },
  { value: "completion", labelKey: "testModeCompletion" },
  { value: "embedding", labelKey: "testModeEmbedding" },
  { value: "audio_speech", labelKey: "testModeAudioSpeech" },
  { value: "audio_transcription", labelKey: "testModeAudioTranscription" },
  { value: "image_generation", labelKey: "testModeImageGeneration" },
  { value: "image_edit", labelKey: "testModeImageEdit" },
  { value: "video_generation", labelKey: "testModeVideoGeneration" },
  { value: "rerank", labelKey: "testModeRerank" },
  { value: "realtime", labelKey: "testModeRealtime" },
  { value: "batch", labelKey: "testModeBatch" },
  { value: "ocr", labelKey: "testModeOcr" },
] as const;
