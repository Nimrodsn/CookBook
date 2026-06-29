import { Client, Databases, Storage } from "node-appwrite";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function isAppwriteConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT &&
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID &&
      process.env.APPWRITE_API_KEY &&
      process.env.APPWRITE_DATABASE_ID &&
      process.env.APPWRITE_RECIPES_COLLECTION_ID &&
      process.env.APPWRITE_CATEGORIES_COLLECTION_ID &&
      process.env.APPWRITE_STORAGE_BUCKET_ID,
  );
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
  return requireEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID");
}

export function getEndpoint(): string {
  return requireEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT");
}
