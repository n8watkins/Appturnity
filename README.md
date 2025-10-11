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

### 3. Start Development Server

```bash
npm run dev
```

The site will be available at http://localhost:3000

## Project Structure

```
.
├── client/src/          # React frontend application
│   ├── components/      # React components
│   ├── pages/          # Route pages
│   └── lib/            # Utilities & helpers
├── server/             # Express.js backend
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   ├── email.ts        # Email service with Resend
│   └── vite.ts         # Dev server configuration
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
- Calendly integration for scheduling calls
- Beautiful HTML email templates with brand styling

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

- **Environment Variables**: Set `RESEND_API_KEY` and `CONTACT_EMAIL` in your production environment
- **Custom Domain**: Verify your domain with Resend for production email sending
- **Email From Address**: Update `server/email.ts:116` to use your verified domain
- **CORS**: Add CORS configuration if frontend and backend are on different domains

## License

MIT