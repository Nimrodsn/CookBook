import { Client, Databases } from "node-appwrite";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const REQUIRED_RECIPE_ATTRS = [
  "title",
  "type",
  "url",
  "image_url",
  "image_file_id",
  "image_urls",
  "image_file_ids",
  "category",
  "tags",
  "ingredients",
  "instructions",
  "custom_notes",
];

const REQUIRED_CATEGORY_ATTRS = ["slug", "label_en", "label_he", "sort_order"];

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  const content = readFileSync(envPath, "utf8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return { env, envPath, content };
}

function setEnvValue(content, key, value) {
  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (pattern.test(content)) {
    return content.replace(pattern, `${key}=${value}`);
  }
  return `${content.trimEnd()}\n${key}=${value}\n`;
}

async function wait(ms) {
  return new Promise((resolveWait) => setTimeout(resolveWait, ms));
}

async function ensureAttributesReady(databases, databaseId, collectionId, keys) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const attrs = await databases.listAttributes(databaseId, collectionId);
    const available = new Set(
      attrs.attributes
        .filter((attr) => attr.status === "available")
        .map((attr) => attr.key),
    );
    if (keys.every((key) => available.has(key))) {
      return;
    }
    await wait(1000);
  }
  throw new Error(`Timed out waiting for attributes on ${collectionId}`);
}

const { env, envPath, content: initialContent } = loadEnv();
const client = new Client()
  .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(env.APPWRITE_API_KEY);

const databases = new Databases(client);
const databaseId = env.APPWRITE_DATABASE_ID;
const recipesCollectionId = env.APPWRITE_RECIPES_COLLECTION_ID;
const categoriesCollectionId = "categories";

let content = initialContent;

try {
  const collections = await databases.listCollections(databaseId);
  const recipes = collections.collections.find((c) => c.$id === recipesCollectionId);
  if (!recipes) {
    throw new Error(`Recipes collection "${recipesCollectionId}" not found.`);
  }

  const recipeAttrs = await databases.listAttributes(databaseId, recipesCollectionId);
  const recipeKeys = new Set(recipeAttrs.attributes.map((attr) => attr.key));
  const missingRecipeAttrs = REQUIRED_RECIPE_ATTRS.filter((key) => !recipeKeys.has(key));
  if (missingRecipeAttrs.length > 0) {
    console.warn("Missing recipes attributes:", missingRecipeAttrs.join(", "));
  } else {
    console.log("Recipes collection schema looks good.");
  }

  let categories = collections.collections.find((c) => c.$id === categoriesCollectionId);
  if (!categories) {
    console.log("Creating categories collection...");
    categories = await databases.createCollection(
      databaseId,
      categoriesCollectionId,
      "categories",
      undefined,
      false,
      true,
    );
  } else {
    console.log("Categories collection already exists.");
  }

  const categoryAttrs = await databases.listAttributes(databaseId, categoriesCollectionId);
  const categoryKeys = new Set(categoryAttrs.attributes.map((attr) => attr.key));

  if (!categoryKeys.has("slug")) {
    await databases.createStringAttribute(
      databaseId,
      categoriesCollectionId,
      "slug",
      64,
      true,
    );
  }
  if (!categoryKeys.has("label_en")) {
    await databases.createStringAttribute(
      databaseId,
      categoriesCollectionId,
      "label_en",
      128,
      true,
    );
  }
  if (!categoryKeys.has("label_he")) {
    await databases.createStringAttribute(
      databaseId,
      categoriesCollectionId,
      "label_he",
      128,
      true,
    );
  }
  if (!categoryKeys.has("sort_order")) {
    await databases.createIntegerAttribute(
      databaseId,
      categoriesCollectionId,
      "sort_order",
      false,
      0,
      undefined,
      0,
    );
  }

  await ensureAttributesReady(
    databases,
    databaseId,
    categoriesCollectionId,
    REQUIRED_CATEGORY_ATTRS,
  );

  content = setEnvValue(content, "APPWRITE_CATEGORIES_COLLECTION_ID", categoriesCollectionId);
  writeFileSync(envPath, content, "utf8");

  console.log(`Updated .env.local: APPWRITE_CATEGORIES_COLLECTION_ID=${categoriesCollectionId}`);
  console.log("Appwrite setup complete.");
} catch (error) {
  console.error("Setup failed:", error.message || error);
  process.exit(1);
}
