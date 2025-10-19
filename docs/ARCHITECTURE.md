# Appturnity Architecture Documentation

## System Overview

Appturnity is a modern full-stack web application built with a React frontend and Express.js backend. The architecture follows a client-server model with clear separation of concerns and enterprise-grade security, monitoring, and performance optimizations.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         APPTURNITY SYSTEM                            │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│                      │         │                      │
│   CLIENT (Browser)   │◄───────►│   EXPRESS SERVER     │
│                      │  HTTP   │                      │
└──────────────────────┘         └──────────────────────┘
         │                                 │
         │                                 ├─► Resend Email API
         ├─► Google reCAPTCHA v3           ├─► (Future: Database)
         ├─► Google Analytics (Optional)   └─► Error Notifications
         └─► Calendly Embed

┌─────────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT OPTIONS                              │
├─────────────────────────────────────────────────────────────────────┤
│  Frontend: Firebase Hosting / Vercel / Netlify (Static files)      │
│  Backend: Vercel / Railway / Render (Node.js hosting)              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Technology Stack

- **Framework**: React 18.3.1 with TypeScript 5.6.3
- **Build Tool**: Vite 5.4.14 (Lightning-fast HMR)
- **Routing**: Wouter 3.3.5 (Lightweight SPA routing, < 1.5KB)
- **Styling**: TailwindCSS 3.4.14 + Shadcn UI (Radix UI components)
- **State Management**:
  - React Query (@tanstack/react-query) for server state
  - React hooks for local state
- **Form Handling**: React Hook Form + Zod validation
- **Animation**: Framer Motion 11.13.1

### Component Architecture

```
client/src/
├── components/          # Reusable UI components (30+)
│   ├── ui/             # Shadcn UI components (40+ accessible components)
│   ├── blog/           # Blog-specific components
│   ├── Hero.tsx        # Landing hero section
│   ├── Contact.tsx     # Contact form with Calendly integration
│   ├── PricingCalculator.tsx  # Interactive cost estimator
│   ├── ServiceQuiz.tsx # Smart recommendation engine
│   └── ChatWidget.tsx  # Floating help widget
│
├── pages/              # Route-level components
│   ├── Home.tsx        # Main landing page
│   ├── Blog.tsx        # Blog listing
│   ├── BlogPost.tsx    # Individual blog post
│   └── Features.tsx    # Features showcase
│
├── lib/                # Utilities & business logic
│   ├── pricing.ts      # Pricing calculation engine (7,990 LOC)
│   ├── quizRecommendations.ts  # AI-like recommendation system (13,621 LOC)
│   ├── errorTracking.ts # Client-side error tracking
│   ├── performance.ts   # Web Vitals monitoring
│   └── queryClient.ts   # React Query configuration
│
├── hooks/              # Custom React hooks
│   ├── use-toast.ts    # Toast notifications
│   └── use-mobile.ts   # Responsive breakpoint detection
│
└── data/               # Static data & blog posts
    ├── blogMetadata.ts
    └── blog-posts/     # 10 blog posts with frontmatter
```

### Performance Optimizations

#### 1. Code Splitting

```typescript
// vite.config.ts
manualChunks: {
  "react-vendor": ["react", "react-dom"],
  "radix-vendor": ["@radix-ui/*"],
  "animation-vendor": ["framer-motion", "lottie-react"],
  "form-vendor": ["react-hook-form", "zod"],
  "charts-vendor": ["recharts"]
}
```

#### 2. Lazy Loading

```typescript
// Route-based lazy loading
const Blog = lazy(() => import("@/pages/Blog"));
const Contact = lazy(() => import("@/components/Contact"));

// Below-the-fold lazy loading
const Portfolio = lazy(() => import("@/components/Portfolio"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
```

#### 3. Image Optimization

- LazyImage component with Intersection Observer
- Proper width/height attributes to prevent CLS
- WebP format support

#### 4. Resource Hints

```html
<link rel="preconnect" href="https://www.google.com" crossorigin />
<link rel="dns-prefetch" href="https://assets.calendly.com" />
```

---

## Backend Architecture

### Technology Stack

- **Framework**: Express.js 4.21.2
- **Language**: TypeScript 5.6.3 (ES Modules)
- **Email Service**: Resend 6.1.2
- **Security**:
  - Helmet 8.1.0 (CSP headers)
  - CORS 2.8.5 (Origin validation)
  - Express Rate Limit 8.1.0 (DDoS protection)
  - reCAPTCHA v3 (Spam prevention)
- **Validation**: Zod 3.23.8

### Server Structure

```
server/
├── index.ts           # Server entry point & middleware setup
├── routes.ts          # API route handlers
├── email.ts           # Email service with Resend
├── vite.ts            # Dev server configuration
│
└── lib/
    ├── logger.ts           # Structured logging system
    ├── requestId.ts        # Request ID middleware
    ├── errors.ts           # Custom error classes
    └── errorNotification.ts # Error email alerts
```

### Middleware Stack

Requests flow through middleware in this order:

```
┌─────────────────────────────────────────────────────┐
│  1. Helmet (Security headers, CSP)                  │
├─────────────────────────────────────────────────────┤
│  2. CORS (Origin validation)                        │
├─────────────────────────────────────────────────────┤
│  3. Express JSON/URL Encoded (Body parsing, 100kb)  │
├─────────────────────────────────────────────────────┤
│  4. Request ID (Unique ID for tracing)              │
├─────────────────────────────────────────────────────┤
│  5. Rate Limiting                                   │
│     - Global: 100 req/15min                         │
│     - Contact: 5 req/hour                           │
│     - Chat: 10 req/hour                             │
├─────────────────────────────────────────────────────┤
│  6. Request Logger (API timing)                     │
├─────────────────────────────────────────────────────┤
│  7. Route Handlers (Business logic)                 │
├─────────────────────────────────────────────────────┤
│  8. Error Handler (Centralized error handling)      │
└─────────────────────────────────────────────────────┘
```

### Security Architecture

#### Multi-Layer Defense

1. **Helmet CSP (Content Security Policy)**

   ```typescript
   contentSecurityPolicy: {
     directives: {
       defaultSrc: ["'self'"],
       scriptSrc: ["'self'", "https://www.google.com"],
       connectSrc: ["'self'", "https://www.google.com"],
       frameSrc: ["https://www.google.com", "https://calendly.com"]
     }
   }
   ```

2. **CORS Origin Validation**

   ```typescript
   const allowedOrigins =
     process.env.NODE_ENV === "production"
       ? [process.env.FRONTEND_URL]
       : ["http://localhost:7223", "http://localhost:5173"];
   ```

3. **Rate Limiting (3 Tiers)**
   - Global API: 100 requests / 15 minutes
   - Contact Form: 5 submissions / hour
   - Chat Widget: 10 messages / hour

4. **reCAPTCHA v3 Verification**
   - Score threshold: 0.5 (0.0 = bot, 1.0 = human)
   - Invisible challenge for better UX
   - Fallback for development/testing

5. **Input Validation (Zod Schemas)**

   ```typescript
   const contactFormSchema = z.object({
     name: z.string().min(2),
     email: z.string().email(),
     message: z.string().min(10),
     recaptchaToken: z.string().min(1),
   });
   ```

6. **Honeypot Fields**
   - Hidden fields to catch bots
   - `hp_field` silently rejects if filled

---

## Monitoring & Observability

### Performance Monitoring

#### Web Vitals Tracking

```typescript
// Tracked Metrics:
- LCP (Largest Contentful Paint) - Loading performance
- CLS (Cumulative Layout Shift) - Visual stability
- TTFB (Time to First Byte) - Server responsiveness
- INP (Interaction to Next Paint) - Interactivity

// Sent to:
1. Backend API (/api/vitals)
2. Google Analytics (optional)
```

### Error Tracking

#### Client-Side Errors

```
┌──────────────────────────────────────┐
│  Error Sources:                      │
├──────────────────────────────────────┤
│  1. window.onerror                   │
│  2. unhandledrejection               │
│  3. React Error Boundaries           │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Error Classification:               │
├──────────────────────────────────────┤
│  • Critical: payment, auth, security │
│  • Error: React errors, API failures │
│  • Warning: deprecated, console logs │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  POST /api/errors                    │
│  (with rate limiting & deduplication)│
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Email Notification                  │
│  (max 10/hour, 5-min cooldown)       │
└──────────────────────────────────────┘
```

### Structured Logging

```typescript
// Development: Human-readable with emojis
🔍 [debug] Error email rate limit (too soon since last email)
✅ [info] Contact form submission sent {"email":"user@example.com"}
⚠️  [warn] Missing environment variables (development mode)
❌ [error] Error processing contact form

// Production: JSON for log aggregation
{"level":"error","message":"Error processing contact form","timestamp":"2025-10-18T...","requestId":"abc123",...}
```

---

## Data Flow

### Contact Form Submission

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│  User    │────►│  React   │────►│ reCAPTCHA│────►│ Express  │
│  Form    │     │ Validate │     │  Verify  │     │  Server  │
│          │     │  (Zod)   │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                           │
                                                           ▼
                                                    ┌──────────────┐
                                                    │              │
                                                    │   Validate   │
                                                    │   (Zod)      │
                                                    │              │
                                                    └──────────────┘
                                                           │
                                                           ▼
                                                    ┌──────────────┐
                                                    │              │
                                                    │    Resend    │
                                                    │  Email API   │
                                                    │              │
                                                    └──────────────┘
                                                           │
                                                           ▼
                                                    ┌──────────────┐
                                                    │              │
                                                    │   Log &      │
                                                    │   Response   │
                                                    │              │
                                                    └──────────────┘
```

### Quiz Recommendation Flow

```
┌───────────────────────────────────────────────────────────────┐
│  1. User answers quiz questions (11 questions)                │
└───────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────┐
│  2. Scoring Algorithm (client-side)                           │
│     • Budget Score (1-4 points) × 0.4                         │
│     • Urgency Score (1-4 points) × 0.35                       │
│     • Complexity Score (1-4 points) × 0.25                    │
└───────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────┐
│  3. Generate Personalized Recommendation                      │
│     • Solution type (landing/website/app/ecommerce)           │
│     • Timeline estimate                                       │
│     • Investment range                                        │
│     • Priority label (Hot Lead, Qualified, etc.)              │
└───────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────┐
│  4. Store in localStorage (15-min expiration)                 │
└───────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────┐
│  5. Prefill Contact Form with Recommendation                  │
└───────────────────────────────────────────────────────────────┘
```

---

## Build & Deployment

### Development Mode

```bash
npm run dev
```

```
┌─────────────────────────────────────────────┐
│  Express Server (localhost:7223)            │
├─────────────────────────────────────────────┤
│  1. Vite Middleware (HMR, Fast Refresh)     │
│  2. API Routes (/api/*)                     │
│  3. SPA Fallback (index.html)               │
└─────────────────────────────────────────────┘
```

### Production Build

```bash
npm run build
```

**Output:**

```
dist/
├── index.html         # SPA entry point
├── assets/
│   ├── index-abc123.js    # Main bundle
│   ├── react-vendor-def456.js
│   ├── radix-vendor-ghi789.js
│   └── [other chunks]
└── [static assets]

dist/index.js          # Compiled Express server
```

### Deployment Strategies

#### Option 1: Vercel (Recommended)

```json
// vercel.json
{
  "builds": [{ "src": "dist/index.js", "use": "@vercel/node" }],
  "routes": [
    { "src": "/api/(.*)", "dest": "dist/index.js" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

#### Option 2: Railway/Render

- Deploy backend as Node.js service
- Serve static files from `dist/` folder
- Set environment variables in dashboard

#### Option 3: Split Deployment

- **Frontend**: Firebase Hosting / Netlify (static files)
- **Backend**: Separate Node.js hosting
- Configure CORS for cross-origin requests

---

## Environment Variables

### Required (Production)

| Variable                  | Description            | Example                   |
| ------------------------- | ---------------------- | ------------------------- |
| `RESEND_API_KEY`          | Email delivery API key | `re_abc123...`            |
| `CONTACT_EMAIL`           | Form recipient email   | `contact@yourcompany.com` |
| `RECAPTCHA_SECRET_KEY`    | reCAPTCHA server key   | `6Lf...`                  |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA client key   | `6Lf...` (public)         |

### Optional

| Variable                 | Description                | Default       |
| ------------------------ | -------------------------- | ------------- |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics ID        | Not set       |
| `VITE_CALENDLY_URL`      | Calendly scheduling link   | Default URL   |
| `FRONTEND_URL`           | CORS allowed origin (prod) | Auto-detected |
| `NODE_ENV`               | Environment mode           | `development` |

---

## Testing Architecture

### Test Stack

- **Framework**: Vitest 3.2.4
- **React Testing**: @testing-library/react 16.3.0
- **HTTP Testing**: Supertest 7.1.4

### Test Structure

```
client/src/
└── test/
    ├── setup.ts               # Vitest configuration
    ├── components/
    │   ├── Contact.test.tsx   # Component tests
    │   └── ChatWidget.test.tsx
    └── lib/
        ├── pricing.test.ts    # Unit tests
        └── quizRecommendations.test.ts

server/
└── __tests__/
    └── routes.test.ts         # API integration tests
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    steps:
      - Checkout code
      - Install dependencies
      - Run type check (npm run check)
      - Run tests (npm run test:run)
      - Run build (npm run build)
```

---

## Scalability Considerations

### Current Limitations

- No database (stateless, uses email for submissions)
- In-memory rate limiting (resets on server restart)
- No horizontal scaling support

### Future Enhancements

1. **Database Integration**
   - Store form submissions for backup
   - Persistent rate limiting with Redis
   - User accounts and saved quotes

2. **Caching Layer**
   - CDN for static assets
   - Redis for API response caching
   - Service worker for offline support

3. **Microservices**
   - Separate email service
   - Dedicated analytics service
   - Background job processing

4. **Load Balancing**
   - Multiple server instances
   - Session affinity for rate limiting
   - Database connection pooling

---

## Key Design Decisions

### Why Wouter over React Router?

- **Size**: 1.5KB vs 40KB (26x smaller)
- **Performance**: Faster route matching
- **Simplicity**: Hooks-based API

### Why Vite over Create React App?

- **Speed**: 10-100x faster HMR
- **Modern**: Native ESM, better tree-shaking
- **Flexible**: Easier to configure

### Why Zod for validation?

- **Type Safety**: TypeScript integration
- **Runtime Validation**: Catches errors at runtime
- **Composable**: Reusable schemas

### Why Resend for email?

- **Developer Experience**: Clean API, great docs
- **Reliability**: Modern infrastructure
- **Features**: Templates, analytics, webhooks

---

## Security Best Practices

✅ **Implemented:**

- Helmet CSP headers
- CORS origin validation
- Rate limiting (3 tiers)
- Input validation (Zod)
- reCAPTCHA v3
- Honeypot fields
- Request size limits
- HTTPS enforcement (production)
- Environment variable validation
- Structured error logging

⚠️ **Recommended for Production:**

- Set up API key rotation schedule
- Enable HSTS preload
- Implement CSP reporting
- Add security headers monitoring
- Regular dependency updates
- Security audit schedule

---

## Performance Benchmarks

### Core Web Vitals (Target)

| Metric | Target  | Current   |
| ------ | ------- | --------- |
| LCP    | < 2.5s  | Monitored |
| CLS    | < 0.1   | Monitored |
| TTFB   | < 800ms | Monitored |
| INP    | < 200ms | Monitored |

### Bundle Size

| Chunk           | Size   | Description            |
| --------------- | ------ | ---------------------- |
| Main            | ~150KB | Core application logic |
| React Vendor    | ~130KB | React, React-DOM       |
| Radix Vendor    | ~120KB | UI components          |
| Form Vendor     | ~50KB  | Forms and validation   |
| Total (gzipped) | ~450KB | Production build       |

---

## Maintenance

### Regular Tasks

- **Weekly**: Review error tracking emails
- **Monthly**: Update dependencies (`npm outdated`)
- **Quarterly**: Security audit (`npm audit`)
- **Annually**: Review and rotate API keys

### Monitoring Dashboards

1. **Resend**: Email delivery rates
2. **Google Analytics**: Traffic and conversions
3. **Server Logs**: Error rates and API latency
4. **Web Vitals**: Performance metrics

---

## Support & Resources

- **Documentation**: `/docs` folder
- **API Reference**: `/docs/API.md`
- **TODO**: `/TODO.md`
- **Test Reports**: `/TEST_SUMMARY.md`
- **Code Review**: `/CODE_REVIEW.md`

---

**Last Updated**: 2025-10-18
**Architecture Version**: 1.0.0
