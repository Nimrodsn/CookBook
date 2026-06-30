import { Client, Databases, Storage } from "node-appwrite";

const APPWRITE_ENV_KEYS = [
  "NEXT_PUBLIC_APPWRITE_ENDPOINT",
  "NEXT_PUBLIC_APPWRITE_PROJECT_ID",
  "APPWRITE_API_KEY",
  "APPWRITE_DATABASE_ID",
  "APPWRITE_RECIPES_COLLECTION_ID",
  "APPWRITE_CATEGORIES_COLLECTION_ID",
  "APPWRITE_STORAGE_BUCKET_ID",
] as const;

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  return value.includes("your_") || value === "your_project_id";
}

export function getAppwriteEnvStatus(): {
  configured: boolean;
  missing: string[];
} {
  const missing = APPWRITE_ENV_KEYS.filter((key) =>
    isPlaceholder(process.env[key]),
  );
  return { configured: missing.length === 0, missing: [...missing] };
}

export function isAppwriteConfigured(): boolean {
  return getAppwriteEnvStatus().configured;
}

const client = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "https://cloud.appwrite.io/v1",
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "")
  .setKey(process.env.APPWRITE_API_KEY ?? "");

export const databases = new Databases(client);
export const storage = new Storage(client);

export const DB_ID = process.env.APPWRITE_DATABASE_ID ?? "";
export const RECIPES_COL = process.env.APPWRITE_RECIPES_COLLECTION_ID ?? "";
export const CATEGORIES_COL = process.env.APPWRITE_CATEGORIES_COLLECTION_ID ?? "";
export const BUCKET_ID = process.env.APPWRITE_STORAGE_BUCKET_ID ?? "";

export function getProjectId(): string {
  const value = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  if (!value) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_APPWRITE_PROJECT_ID");
  }
  return value;
}

export function getEndpoint(): string {
  const value = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  if (!value) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_APPWRITE_ENDPOINT");
  }
  return value;
}
