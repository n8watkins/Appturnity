# Appturnity - Landing Page

A modern, responsive landing page for Appturnity, a design agency that creates custom landing pages and applications for growing businesses.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Backend**: Express.js
- **Styling**: Tailwind CSS + Shadcn UI Components
- **Form Handling**: React Hook Form + Zod validation
- **Email**: Resend API
- **Security**: reCAPTCHA v3 (spam protection)
- **Animations**: Framer Motion
- **Deployment**: Firebase Hosting

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your values:

```env
# Get your API key from https://resend.com
RESEND_API_KEY=re_your_api_key_here

# Email address to receive contact form submissions
CONTACT_EMAIL=your-email@example.com

# reCAPTCHA v3 Keys (Get from https://www.google.com/recaptcha/admin)
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here

# Google Analytics Measurement ID (Optional - for tracking)
# Get from https://analytics.google.com
# VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

NODE_ENV=development
```

**Getting a Resend API Key:**
1. Sign up at [resend.com](https://resend.com)
2. Verify your email
3. Create an API key in the dashboard
4. For production, add and verify your custom domain

**Getting reCAPTCHA v3 Keys:**
1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Click "+" to register a new site
3. Choose "reCAPTCHA v3" as the type
4. Add your domains (localhost for development)
5. Copy the Site Key to `VITE_RECAPTCHA_SITE_KEY`
6. Copy the Secret Key to `RECAPTCHA_SECRET_KEY`

**Getting Google Analytics (Optional):**
1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new property for your website
3. Copy the Measurement ID (starts with `G-`)
4. Add to `.env` as `VITE_GA_MEASUREMENT_ID=G-...`
5. Analytics will automatically load when the ID is present

### 3. Start Development Server

```bash
npm run dev
```

The site will be available at http://localhost:3000

### 4. Run Tests (Optional)

```bash
# Run tests in watch mode
npm run test

# Run tests once (CI mode)
npm run test:run

# Run tests with UI
npm run test:ui
```

### 5. Type Check

```bash
npm run check
```

## Project Structure

```
.
├── client/src/          # React frontend application
│   ├── components/      # React components
│   ├── pages/          # Route pages
│   ├── test/           # Test files and setup
│   └── lib/            # Utilities & helpers
├── server/             # Express.js backend
│   ├── index.ts        # Server entry point (with security middleware)
│   ├── routes.ts       # API routes
│   ├── email.ts        # Email service with Resend
│   └── vite.ts         # Dev server configuration
├── .github/workflows/  # CI/CD pipelines
└── data/               # Constants (pricing, etc.)
```

## Features

### Interactive Pricing Calculator
- Real-time cost estimation for custom app development
- Compares custom development vs traditional SaaS pricing
- Calculates potential 3-year savings
- Pre-fills contact form with pricing details

### Contact Form
- Sends formatted emails via Resend API
- Form validation with Zod
- reCAPTCHA v3 spam protection (invisible, user-friendly)
- ARIA attributes for accessibility
- Rate limiting to prevent abuse (5 submissions per hour)
- Calendly integration for scheduling calls
- Beautiful HTML email templates with brand styling

### Security & Performance
- Express rate limiting (100 requests per 15 minutes globally)
- CORS configuration for production
- Helmet security headers with CSP
- Environment variable validation on server startup
- Google Analytics for visitor tracking (optional)

## Testing

This project uses Vitest with React Testing Library for testing.

**Running Tests:**
```bash
npm run test        # Watch mode
npm run test:run    # CI mode (run once)
npm run test:ui     # UI mode with browser interface
```

**Test Structure:**
- Unit tests: `client/src/test/`
- Test setup: `client/src/test/setup.ts`
- Configuration: `vitest.config.ts`

## Continuous Integration

GitHub Actions automatically runs on every push and pull request to `main`:
- TypeScript type checking (`npm run check`)
- Test suite (`npm run test:run`)
- Build verification (`npm run build`)

See `.github/workflows/ci.yml` for the full CI configuration.

## Deployment Instructions

### Firebase Hosting

This project deploys to Firebase Hosting for the frontend. Note that the backend (Express server) will need to be deployed separately to a Node.js hosting service.

**For Static Hosting:**

1. **Create a Firebase Project**:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the prompts

2. **Initialize & Deploy**:
   ```bash
   ./init-firebase.sh    # First time only
   ./deploy-firebase.sh  # Build and deploy
   ```

3. **Configure Environment Variables**:
   - Set up your Resend API key and contact email in your hosting environment
   - For production, you'll need a Node.js hosting service (Vercel, Railway, Render, etc.)

### Production Considerations

- **Environment Variables**: Set all required environment variables in your production environment:
  - `RESEND_API_KEY` (required)
  - `CONTACT_EMAIL` (required)
  - `RECAPTCHA_SECRET_KEY` (required)
  - `VITE_RECAPTCHA_SITE_KEY` (required)
  - `VITE_GA_MEASUREMENT_ID` (optional)
  - `FRONTEND_URL` (for CORS configuration)
  - `NODE_ENV=production`
- **Custom Domain**: Verify your domain with Resend for production email sending
- **Email From Address**: Update `server/email.ts` to use your verified domain
- **CORS**: The `FRONTEND_URL` environment variable configures CORS for production
- **Rate Limiting**: Already configured (100 req/15min globally, 5 req/hour for contact form)

## License

MIT