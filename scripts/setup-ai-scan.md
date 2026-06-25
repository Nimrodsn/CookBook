# AI Recipe Scanning (Google Gemini)

The **Scan Recipe** feature uses the [Google Gemini API](https://ai.google.dev/) to read photos of handwritten or printed recipes. It works on Vercel production and from any phone — no local PC or Ollama required.

## 1. Get a Gemini API Key (Free Tier)

1. Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API key**
4. Copy the key

## 2. Environment Variables

Add to `.env.local` (local dev) and **Vercel → Project Settings → Environment Variables** (production):

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
```

Mark `GEMINI_API_KEY` as **sensitive** in Vercel.

Restart the dev server after updating `.env.local`.

## 3. Test Locally

1. Run `npm run dev`
2. Open **http://127.0.0.1:3048/recipes/scan** (or the **Phone** LAN URL from the terminal)
3. Take or upload a recipe photo
4. Click **Transcribe with AI**
5. Review fields and save

## 4. Test on Production (Vercel)

1. Add `GEMINI_API_KEY` and `GEMINI_MODEL` in Vercel env vars
2. **Redeploy** the project
3. Open `https://your-app.vercel.app/recipes/scan` from your phone (any network)

## Troubleshooting

| Error | Fix |
|-------|-----|
| AI scanning is not configured | Add `GEMINI_API_KEY` to env vars |
| Invalid Gemini API key | Regenerate key in Google AI Studio |
| AI quota exceeded | Wait and retry; check [Gemini pricing](https://ai.google.dev/pricing) |
| Could not parse recipe | Use a clearer, well-lit photo |
| Works on PC but not phone (local dev) | Use the LAN URL from terminal; same Wi-Fi required |

## Cost

Google AI Studio offers a free tier with rate limits. A family cookbook with occasional scans typically stays within free usage. No credit card required for basic API keys in most regions.

## Phone Access (Local Dev Only)

When running `npm run dev`, the terminal prints a **Phone** URL (`http://192.168.x.x:3048`). Your phone must be on the same Wi-Fi. Production uses your public Vercel URL instead.
