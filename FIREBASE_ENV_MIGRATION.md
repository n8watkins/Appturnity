# Firebase Functions Environment Variables Migration

## ✅ Migration Complete

This project has been successfully migrated from the deprecated `functions.config()` API to the modern **dotenv** pattern.

## Current Setup

### Local Development

- Uses `.env` file in `functions/` directory
- Loaded via `import "dotenv/config"` in `functions/src/index.ts`
- File is gitignored for security

### Firebase Deployment

- Uses `.env.yaml` file in `functions/` directory
- Automatically loaded by Firebase Functions runtime
- File is gitignored for security

## Environment Variables

The following environment variables are required:

```yaml
RESEND_API_KEY: your_resend_api_key_here
RESEND_FROM_EMAIL: "Your Name <your@email.com>"
CONTACT_EMAIL: your_contact_email@example.com
RECAPTCHA_SECRET_KEY: your_recaptcha_secret_key_here
FRONTEND_URL: https://your-app.web.app
```

## Setup Instructions

### For Local Development:

1. Copy the example file:

   ```bash
   cp functions/.env.example functions/.env
   ```

2. Fill in your actual values in `functions/.env`

3. Run locally:
   ```bash
   npm run dev
   ```

### For Firebase Deployment:

1. Copy the example file:

   ```bash
   cp functions/.env.yaml.example functions/.env.yaml
   ```

2. Fill in your actual values in `functions/.env.yaml`

3. Deploy:
   ```bash
   firebase deploy --only functions
   ```

## Migration from functions.config()

### ❌ Old Way (Deprecated):

```typescript
const config = functions.config();
const apiKey = config.resend.api_key;
```

### ✅ New Way (Current):

```typescript
import "dotenv/config";

const apiKey = process.env.RESEND_API_KEY;
```

## Security Notes

- ⚠️ **Never commit** `.env` or `.env.yaml` files to git
- ✅ Both files are included in `.gitignore`
- ✅ Example files (`.env.example`, `.env.yaml.example`) are safe to commit
- 🔒 For production, consider using [Firebase Secret Manager](https://firebase.google.com/docs/functions/config-env#secret-manager) for sensitive values

## Testing

Run the email test script to verify environment variables are loaded correctly:

```bash
# Start the server
npm run dev

# In another terminal
node test-emails.js
```

## Resources

- [Firebase Environment Configuration Docs](https://firebase.google.com/docs/functions/config-env)
- [Dotenv Documentation](https://github.com/motdotla/dotenv)
- [Firebase Secret Manager](https://firebase.google.com/docs/functions/config-env#secret-manager)
