# Firebase Functions (Legacy)

## ⚠️ Status: NOT IN USE

This folder contains a legacy Firebase Cloud Functions implementation that is **no longer used** in the current deployment.

## Current Architecture

The project now uses:

- **Express.js server** (`/server/*`) for the backend API
- **Vite** for frontend bundling and dev server
- **Node.js hosting** (Vercel/Railway/Render) instead of Firebase Functions

## Why This Folder Exists

This was part of the initial Firebase setup but has been superseded by the main Express server for better:

- Developer experience (hot reload, structured logging)
- Deployment flexibility (can deploy to any Node.js host)
- Performance (no cold starts)
- Monitoring capabilities

## Should I Delete It?

**For production**: Yes, you can safely delete this folder if you're not planning to use Firebase Functions.

**For reference**: Keep it if you might want to deploy to Firebase Functions in the future (it's a working implementation, just needs updated dependencies).

## If You Want to Use Firebase Functions

If you decide to use Firebase Functions instead of the Express server:

1. Update dependencies in `functions/package.json`
2. Sync email templates with `server/email.ts`
3. Replace `console.*` with structured logging
4. Configure `firebase.json` hosting rewrites
5. Deploy with `firebase deploy --only functions,hosting`

## Recommended Action

**Delete the `/functions` folder** and update `.gitignore` to prevent future confusion:

```bash
rm -rf functions/
```

Then remove from `.gitignore`:

```
# Remove this line if you delete functions/
functions/node_modules/
functions/lib/
```
