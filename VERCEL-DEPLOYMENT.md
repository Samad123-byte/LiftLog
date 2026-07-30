# LiftLog Vercel deployment

This repository is configured as one Vercel project:

- Vite frontend: `client/dist`
- Express API: `/api/*`
- API function entry point: `api/index.js`

## Correct Vercel settings

Use the repository root as the Root Directory.

- Framework Preset: Vite or Other
- Install Command: `npm ci --include=dev --prefix client && npm ci --omit=dev --prefix server`
- Build Command: `npm run build --prefix client`
- Output Directory: `client/dist`

The same values are already stored in `vercel.json` and should be kept in sync with the dashboard.

## Required environment variables

Add these under Vercel → Project → Settings → Environment Variables:

- `MONGO_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLIENT_URL` = your production frontend URL, for example `https://liftlog-example.vercel.app`
- `NODE_ENV` = `production`

For a single frontend + backend Vercel project, do not add `VITE_API_URL`; the client automatically uses `/api`.

## Why the old build failed

The build log reported only 40 installed client packages. Those are the runtime dependencies. Because `NODE_ENV=production`, npm omitted development dependencies, including Vite, Tailwind CSS, PostCSS, and `@vitejs/plugin-react`.

The revised install command uses `--include=dev` for the client build and `--omit=dev` for the backend runtime dependencies.

## Deploy

Commit and push every revised file:

```bash
git add .
git commit -m "Fix LiftLog Vercel deployment"
git push origin main
```

Then redeploy without the previous build cache.

## Production checks

After deployment, test:

- `/api` returns the LiftLog API status JSON.
- Register and login work.
- Exercise images upload to Cloudinary.
- Refreshing `/dashboard`, `/history`, or another React route does not return 404.
