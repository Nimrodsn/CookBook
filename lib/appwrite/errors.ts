export function getAppwriteErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const err = error as { type?: string; message?: string; code?: number };

    if (err.type === "general_unauthorized_scope") {
      return (
        "Your Appwrite API key is missing required scopes. In Appwrite Console → " +
        "Overview → API Keys, edit (or recreate) your key and enable: documents.read, " +
        "documents.write, files.read, files.write, buckets.read, buckets.write, " +
        "databases.read, databases.write, collections.read, collections.write. " +
        "Update APPWRITE_API_KEY in .env.local and restart the dev server."
      );
    }

    if (err.message) {
      return err.message;
    }
  }

  return "Failed to connect to Appwrite. Check your .env.local configuration.";
}
