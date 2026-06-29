import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { MAX_RECIPE_IMAGES } from "@/lib/constants";
import {
  BUCKET_ID,
  getEndpoint,
  getProjectId,
  isAppwriteConfigured,
  storage,
} from "./server";

export function getFilePreviewUrl(fileId: string): string {
  const endpoint = getEndpoint();
  const projectId = getProjectId();
  return `${endpoint}/storage/buckets/${BUCKET_ID}/files/${fileId}/preview?project=${projectId}`;
}

export async function uploadRecipeImage(file: File): Promise<{
  fileId: string;
  previewUrl: string;
}> {
  if (!isAppwriteConfigured()) {
    throw new Error("Appwrite is not configured");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const inputFile = InputFile.fromBuffer(buffer, file.name);

  const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), inputFile);

  return {
    fileId: uploaded.$id,
    previewUrl: getFilePreviewUrl(uploaded.$id),
  };
}

export async function uploadRecipeImages(
  files: File[],
): Promise<Array<{ fileId: string; previewUrl: string }>> {
  if (files.length > MAX_RECIPE_IMAGES) {
    throw new Error(`Maximum ${MAX_RECIPE_IMAGES} photos allowed`);
  }

  const uploads: Array<{ fileId: string; previewUrl: string }> = [];
  for (const file of files) {
    uploads.push(await uploadRecipeImage(file));
  }
  return uploads;
}

export async function deleteRecipeImage(fileId: string): Promise<void> {
  if (!isAppwriteConfigured() || !fileId) return;
  try {
    await storage.deleteFile(BUCKET_ID, fileId);
  } catch {
    // File may already be deleted
  }
}
