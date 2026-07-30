# Deployment fix manifest

Files changed for Vercel deployment:

- `package.json`
  - enabled ES modules at the repository root
  - pinned Node.js 22
  - added deterministic Vercel build scripts
- `vercel.json`
  - installs client development dependencies explicitly
  - installs backend production dependencies only
  - builds `client/dist`
  - routes `/api/*` to the Express function
  - routes React pages to `index.html`
- `client/package.json`
  - added the Linux Rollup binary as an explicit optional dependency
- `client/package-lock.json`
  - synchronized with the client package change
- `client/src/api/http.js`
  - already configured to use same-origin `/api` by default
- `api/index.js`
  - catches database startup failures cleanly
- `server/app.js`
  - improved Vercel production-origin handling and API error responses
- `server/utils/setCookie.js`
  - uses matching options when setting and clearing the authentication cookie
- `server/controllers/authController.js`
  - clears the cookie through the shared helper
- `.gitignore`
  - excludes dependencies, build output, Vercel state, and environment secrets
- `server/.env.example`
  - documents required production variables without including secrets
- `VERCEL-DEPLOYMENT.md`
  - contains deployment steps and production checks

The downloadable package excludes `.git`, `node_modules`, `dist`, and all real `.env` files.
