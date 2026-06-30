import { Client, Databases, ID } from "node-appwrite";
import { readFileSync } from "fs";
import { resolve } from "path";

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
  return env;
}

const env = loadEnv();
const required = [
  "NEXT_PUBLIC_APPWRITE_ENDPOINT",
  "NEXT_PUBLIC_APPWRITE_PROJECT_ID",
  "APPWRITE_API_KEY",
  "APPWRITE_DATABASE_ID",
  "APPWRITE_RECIPES_COLLECTION_ID",
  "APPWRITE_CATEGORIES_COLLECTION_ID",
  "APPWRITE_STORAGE_BUCKET_ID",
];

const configured = required.every((key) => Boolean(env[key]) && !String(env[key]).includes("your_"));
console.log("isAppwriteConfigured:", configured);
if (!configured) process.exit(1);

const client = new Client()
  .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(env.APPWRITE_API_KEY);
const databases = new Databases(client);

const db = env.APPWRITE_DATABASE_ID;
const categoriesCol = env.APPWRITE_CATEGORIES_COLLECTION_ID;
const recipesCol = env.APPWRITE_RECIPES_COLLECTION_ID;

const categoryDocs = await databases.listDocuments(db, categoriesCol, []);
console.log("category documents:", categoryDocs.total);

if (categoryDocs.total === 0) {
  const defaults = [
    { slug: "meat", label_en: "Meat", label_he: "בשרי", sort_order: 0 },
    { slug: "vegetarian", label_en: "Vegetarian", label_he: "צמחוני", sort_order: 1 },
    { slug: "dessert", label_en: "Dessert", label_he: "קינוח", sort_order: 2 },
    { slug: "gluten_free", label_en: "Gluten-Free", label_he: "ללא גלוטן", sort_order: 3 },
    { slug: "dairy", label_en: "Dairy", label_he: "חלבי", sort_order: 4 },
    { slug: "salad", label_en: "Salad", label_he: "סלט", sort_order: 5 },
    { slug: "soup", label_en: "Soup", label_he: "מרק", sort_order: 6 },
    { slug: "side_dish", label_en: "Side Dish", label_he: "תוספות", sort_order: 7 },
  ];
  for (const category of defaults) {
    await databases.createDocument(db, categoriesCol, category.slug, category);
  }
  console.log("Seeded 8 default categories.");
}

const recipeDocs = await databases.listDocuments(db, recipesCol, []);
console.log("recipe documents:", recipeDocs.total);
console.log("Verification passed.");
