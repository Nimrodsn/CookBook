# Install on Android (Home Screen)

Turn the Family Cookbook website into an app icon on your Android phone. No Play Store or APK required.

## Requirements

- **Chrome** browser on Android
- Your **Vercel production URL** (HTTPS) — e.g. `https://your-app.vercel.app`
- Do **not** use `localhost` or a home Wi‑Fi IP for install; those only work in the browser tab.

## Steps

1. Open **Chrome** on your Android phone.
2. Go to your **Vercel production URL** for the cookbook.
3. Wait for the dashboard to load.
4. Tap the **menu** (⋮) in the top-right corner.
5. Tap **Install app** or **Add to Home screen** (wording varies by Chrome version).
6. Confirm the name **Cookbook** and tap **Install** or **Add**.
7. An icon appears on your home screen. Open it like any other app.

## What you get

- Full-screen experience (no browser address bar)
- Same features as the website: recipes, scan, categories, photos
- Camera scan works from the installed app
- Data syncs via Appwrite for everyone in the family

## Updating the app

When you deploy a new version to Vercel, open the installed app once while online. Chrome refreshes the PWA automatically; no reinstall needed.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| No "Install app" option | Use Chrome (not Samsung Internet/Firefox). Visit the **production** HTTPS URL. |
| App shows config error | Add all Appwrite env vars on Vercel (see `scripts/deploy-vercel.md`), including `APPWRITE_CATEGORIES_COLLECTION_ID`. |
| Scan / camera fails | Allow camera permission when Chrome prompts you. |
| Icon looks wrong after deploy | Remove the old home-screen shortcut and install again. |

## Regenerating icons (developers)

If you change branding colors, regenerate PNG icons:

```bash
node scripts/generate-pwa-icons.mjs
```

Then redeploy to Vercel.
