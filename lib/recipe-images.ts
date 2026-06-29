import { MAX_RECIPE_IMAGES } from "@/lib/constants";
import type { RecipeImage } from "@/lib/utils";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function validateRecipeUploadFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Image must be JPEG, PNG, or WebP.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return "Image must be under 5 MB.";
  }
  return null;
}

export function syncLegacyPrimaryFields(
  urls: string[],
  fileIds: (string | null)[],
): {
  image_url: string | null;
  image_file_id: string | null;
  image_urls: string[];
  image_file_ids: string[];
} {
  return {
    image_url: urls[0] ?? null,
    image_file_id: fileIds[0] ?? null,
    image_urls: urls,
    image_file_ids: fileIds.map((id) => id ?? ""),
  };
}

export function parseKeptImagesFromFormData(formData: FormData): RecipeImage[] {
  const urls = formData.getAll("image_urls").map(String).filter(Boolean);
  const fileIds = formData.getAll("image_file_ids").map(String);

  return urls.map((url, index) => ({
    url,
    fileId: fileIds[index]?.trim() ? fileIds[index] : null,
  }));
}

export function parseRemovedFileIds(formData: FormData): string[] {
  return formData.getAll("removed_file_ids").map(String).filter(Boolean);
}

export function parseNewImageFiles(formData: FormData): File[] {
  return formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0);
}

export function parseExternalImageUrls(formData: FormData): string[] {
  return formData
    .getAll("image_urls")
    .map(String)
    .map((url) => url.trim())
    .filter(Boolean);
}

export function assertMaxImages(count: number): string | null {
  if (count > MAX_RECIPE_IMAGES) {
    return `Maximum ${MAX_RECIPE_IMAGES} photos allowed.`;
  }
  return null;
}
