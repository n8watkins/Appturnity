# Project Setup TODO

## 🔑 API Keys & Configuration

### 1. Get Resend API Key
- [ ] Go to https://resend.com
- [ ] Sign up for a free account
- [ ] Verify your email address
- [ ] Navigate to API Keys in dashboard
- [ ] Create a new API key
- [ ] Copy the key (starts with `re_`)
- [ ] Add to `.env` as `RESEND_API_KEY=re_...`

**For Production:**
- [ ] Add and verify your custom domain in Resend
- [ ] Update `server/email.ts` line 116 to use your domain
- [ ] Change from: `onboarding@resend.dev` to `contact@yourdomain.com`

### 2. Get reCAPTCHA v3 Keys
- [ ] Go to https://www.google.com/recaptcha/admin
- [ ] Click "+" to register a new site
- [ ] Label: "Appturnity Contact Form" (or whatever you want)
- [ ] Choose **reCAPTCHA v3** as the type
- [ ] Add domains:
  - [ ] `localhost` (for development)
  - [ ] Your production domain (e.g., `appturnity.com`)
- [ ] Accept terms and submit
- [ ] Copy the **Site Key** (public key)
- [ ] Copy the **Secret Key** (keep private!)
- [ ] Add to `.env`:
  ```
  VITE_RECAPTCHA_SITE_KEY=your_site_key_here
  RECAPTCHA_SECRET_KEY=your_secret_key_here
  ```

### 3. Get Google Analytics (Optional)
- [ ] Go to https://analytics.google.com
- [ ] Create a new property for your website
- [ ] Copy the Measurement ID (starts with `G-`)
- [ ] Add to `.env` as `VITE_GA_MEASUREMENT_ID=G-...`
- [ ] Analytics will automatically load when the ID is present

### 4. Configure Environment Variables
- [ ] Create `.env` file: `cp .env.example .env`
- [ ] Add Resend API key
- [ ] Add your contact email (where forms will be sent)
- [ ] Add reCAPTCHA site key (VITE_ prefix for frontend)
- [ ] Add reCAPTCHA secret key (for backend)
- [ ] Add Google Analytics ID (optional)
- [ ] Verify `.env` is in `.gitignore` (it already is!)

## 🧪 Testing

### Local Development
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm run check` to verify TypeScript compiles
- [ ] Run `npm run test:run` to run the test suite
- [ ] Run `npm run dev` to start the development server
- [ ] Open http://localhost:3000 in browser
- [ ] Test the contact form:
  - [ ] Fill out name, email, message
  - [ ] Submit and verify no errors
  - [ ] Check your email for the submission
  - [ ] Verify reCAPTCHA badge appears (bottom right)

### Production Checklist
- [ ] Update email "from" address in `server/email.ts:116`
- [ ] Add production domain to reCAPTCHA admin
- [ ] Set all environment variables in hosting service
- [ ] Test form submission in production
- [ ] Monitor email delivery in Resend dashboard

## 🚀 Deployment

### Backend (Express Server)
The backend needs Node.js hosting. Choose one:
- [ ] **Option 1: Vercel** (easiest)
  - Supports Node.js out of the box
  - Free tier available
- [ ] **Option 2: Railway**
  - Simple deployment
  - Free tier with credit
- [ ] **Option 3: Render**
  - Free tier for web services
  - Auto-deploy from Git

### Frontend (Static Files)
- [ ] Build frontend: `npm run build`
- [ ] Deploy `dist/` folder to Firebase Hosting
- [ ] Or deploy to Vercel/Netlify (simpler than Firebase)

### Environment Variables in Production
Make sure to set in your hosting service:
- [ ] `RESEND_API_KEY`
- [ ] `CONTACT_EMAIL`
- [ ] `RECAPTCHA_SECRET_KEY`
- [ ] `VITE_RECAPTCHA_SITE_KEY` (if building on host)
- [ ] `NODE_ENV=production`

## 📝 Optional Future Improvements

### Nice to Have
- [ ] Set up error monitoring service (Sentry, LogRocket)
- [ ] Add performance monitoring/alerts
- [ ] Create better social share image (replace generated-icon.png)
- [ ] Set up custom domain
- [ ] Add sitemap.xml for SEO
- [ ] Test on mobile devices
- [ ] Add E2E tests with Playwright

### Future Features
- [ ] Add success/thank you page after form submission
- [ ] Store submissions in database for backup (if needed later)
- [ ] Add newsletter signup
- [ ] A/B test different CTAs

---

## ✅ Quick Start

If you just want to test locally right now:

1. `cp .env.example .env`
2. Get Resend key → add to `.env`
3. Get reCAPTCHA keys → add to `.env`
4. `npm run dev`
5. Test at http://localhost:3000

**Estimated time: 15-20 minutes**
