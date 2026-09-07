import {
  BUCKET_ID,
  isAppwriteConfigured,
  storage,
} from "@/lib/appwrite/server";

type RouteContext = {
  params: Promise<{ fileId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  if (!isAppwriteConfigured()) {
    return new Response("Appwrite not configured", { status: 503 });
  }

  const { fileId } = await context.params;
  if (!fileId) {
    return new Response("Missing file id", { status: 400 });
  }

  try {
    const file = await storage.getFile({ bucketId: BUCKET_ID, fileId });
    const buffer = await storage.getFileView({ bucketId: BUCKET_ID, fileId });

    return new Response(buffer, {
      headers: {
        "Content-Type": file.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Image not found", { status: 404 });
  }
}
