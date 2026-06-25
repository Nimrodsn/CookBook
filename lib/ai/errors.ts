export class AiError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "not_configured"
      | "invalid_key"
      | "quota_exceeded"
      | "timeout"
      | "invalid_response",
  ) {
    super(message);
    this.name = "AiError";
  }
}

export function getAiErrorMessage(error: unknown): string {
  if (error instanceof AiError) {
    return error.message;
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("api key") || msg.includes("api_key")) {
      return "Invalid Gemini API key. Check GEMINI_API_KEY in your environment.";
    }
    if (msg.includes("quota") || msg.includes("rate limit") || msg.includes("429")) {
      return "AI quota exceeded — try again later.";
    }
    return error.message;
  }
  return "Failed to transcribe recipe image.";
}
