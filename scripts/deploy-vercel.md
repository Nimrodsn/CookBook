# Vercel Deployment Checklist

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial family cookbook app"
git remote add origin <your-repo-url>
git push -u origin main
```

## 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository.
3. Framework preset: **Next.js** (auto-detected).
4. Root directory: `.` (default).

## 3. Environment Variables

Add these in **Project Settings → Environment Variables** for Production, Preview, and Development:

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | e.g. `https://cloud.appwrite.io/v1` |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | From Appwrite console |
| `APPWRITE_API_KEY` | Server API key — mark as sensitive |
| `APPWRITE_DATABASE_ID` | Database ID |
| `APPWRITE_RECIPES_COLLECTION_ID` | Collection ID |
| `APPWRITE_CATEGORIES_COLLECTION_ID` | Categories collection ID (e.g. `categories`) |
| `APPWRITE_STORAGE_BUCKET_ID` | Bucket ID |
| `GEMINI_API_KEY` | Google AI Studio API key — mark as sensitive (see `scripts/setup-ai-scan.md`) |
| `GEMINI_MODEL` | Optional — default `gemini-2.0-flash` |

## 4. Deploy

Click **Deploy**. Vercel runs `next build` automatically.

## 5. Post-Deploy Verification

- [ ] Dashboard loads without errors
- [ ] Add a local recipe with image upload
- [ ] Save an external link (test scrape API)
- [ ] Filters and search work on mobile viewport
- [ ] Edit and delete a recipe
- [ ] Scan a recipe photo from your phone (requires `GEMINI_API_KEY` — see `scripts/setup-ai-scan.md`)

## Notes

- The scrape API runs server-side on Vercel. Some websites block datacenter IPs — users can always enter title/image manually.
- Appwrite preview URLs require the project ID in the query string (handled automatically).
- For custom Appwrite Cloud regions, update `NEXT_PUBLIC_APPWRITE_ENDPOINT` accordingly.
- Recipe scanning uses Google Gemini API — works on Vercel with no home PC or tunnel required.
