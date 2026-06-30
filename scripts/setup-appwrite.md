# Appwrite Setup Guide

Follow these steps in the [Appwrite Console](https://cloud.appwrite.io) to configure the backend for the Digital Recipe Book.

## 1. Create a Project

1. Sign in to Appwrite Cloud (Free Tier).
2. Create a new project named **CookBook** (or any name).
3. Copy the **Project ID** for your environment variables.

## 2. Create an API Key

1. Go to **Overview → API Keys → Create API Key**.
2. Name it `cookbook-server`.
3. Enable these scopes:
   - `databases.read`
   - `databases.write`
   - `collections.read`
   - `collections.write`
   - `documents.read`
   - `documents.write`
   - `files.read`
   - `files.write`
   - `buckets.read`
   - `buckets.write`
4. Copy the API key — it is shown only once. Store it as `APPWRITE_API_KEY`.

## 3. Create the Database

1. Go to **Databases → Create Database**.
2. Name: `cookbook`
3. Copy the **Database ID** → `APPWRITE_DATABASE_ID`

## 4. Create the `recipes` Collection

1. Inside the `cookbook` database, create a collection named `recipes`.
2. Copy the **Collection ID** → `APPWRITE_RECIPES_COLLECTION_ID`

### Collection Attributes

Create each attribute with these exact settings:

| Key | Type | Size / Config | Required |
|-----|------|---------------|----------|
| `title` | String | 512 | Yes |
| `type` | Enum | Elements: `local`, `external` | Yes |
| `url` | URL | 2048 | No |
| `image_url` | URL | 2048 | No |
| `image_file_id` | String | 64 | No |
| `image_urls` | String Array | Max 10 elements | No |
| `image_file_ids` | String Array | Max 10 elements, 64 chars each | No |
| `category` | String | 64 | Yes |
| `tags` | String Array | Max 20 elements, 64 chars each | No |
| `ingredients` | String | 10000 | No |
| `instructions` | String | 20000 | No |
| `custom_notes` | String | 10000 | No |

### Indexes

Create these indexes on the `recipes` collection:

| Key | Type | Attributes |
|-----|------|------------|
| `type_idx` | Key | `type` (ASC) |
| `category_idx` | Key | `category` (ASC) |

### Permissions

Leave **no** role permissions on the collection (no `Any` read/write). All access goes through the server API key.

## 5. Create the `categories` Collection

1. Inside the `cookbook` database, create a collection named `categories`.
2. Copy the **Collection ID** → `APPWRITE_CATEGORIES_COLLECTION_ID`

### Collection Attributes

| Key | Type | Size / Config | Required |
|-----|------|---------------|----------|
| `slug` | String | 64 | Yes |
| `label_en` | String | 128 | Yes |
| `label_he` | String | 128 | Yes |
| `sort_order` | Integer | min 0 | No |

Use each category's `slug` as the **document ID** when creating documents (the app does this automatically).

### Permissions

Leave **no** role permissions on the collection.

### Existing deployments

If `recipes.category` was created as an **Enum**, change it to **String** (64 chars) in Appwrite Console. Existing slug values (`meat`, `soup`, etc.) remain valid.

## 6. Create the Storage Bucket

1. Go to **Storage → Create Bucket**.
2. Name: `recipe-images`
3. Copy the **Bucket ID** → `APPWRITE_STORAGE_BUCKET_ID`
4. Settings:
   - **Maximum file size:** 5 MB
   - **Allowed file extensions:** `jpg`, `jpeg`, `png`, `webp`
5. Leave **no** public file permissions. The server API key handles uploads; preview URLs are stored in `image_url`.

## 7. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_server_api_key
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_RECIPES_COLLECTION_ID=your_collection_id
APPWRITE_CATEGORIES_COLLECTION_ID=your_categories_collection_id
APPWRITE_STORAGE_BUCKET_ID=your_bucket_id
```

Restart the dev server after updating `.env.local`.

You can also run the automated setup script (creates the `categories` collection and updates `.env.local`):

```bash
node scripts/setup-appwrite.mjs
node scripts/verify-appwrite.mjs
```

## 8. Verify

1. Run `npm run dev`.
2. Add a local recipe with an image.
3. Add an external link recipe.
4. Confirm both appear on the dashboard.
