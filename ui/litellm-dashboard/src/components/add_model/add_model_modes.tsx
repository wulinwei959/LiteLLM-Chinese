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

// Define the available auto router routing strategies
export const AUTO_ROUTER_MODES = [
  { value: "simple-shuffle", label: "Simple Shuffle - Random selection from available models" },
  { value: "least-busy", label: "Least Busy - Route to model with lowest current load" },
  { value: "latency-based", label: "Latency Based - Route to model with best response time" },
  { value: "cost-based", label: "Cost Based - Route to most cost-effective model" },
  { value: "usage-based", label: "Usage Based - Route based on historical usage patterns" },
  { value: "custom", label: "Custom - Use custom routing logic defined in config" },
];
