# API Documentation

Complete reference for all REST API endpoints in the Appturnity application.

---

## Base URL

**Development**: `http://localhost:7223`
**Production**: Your deployed backend URL (e.g., `https://your-app.vercel.app`)

---

## Authentication

Currently, the API does not require authentication. All endpoints are public but protected by:

- Rate limiting
- reCAPTCHA v3 verification
- Input validation
- Honeypot fields

---

## Rate Limiting

### Global Rate Limit

- **Limit**: 100 requests per 15 minutes per IP
- **Applies to**: All `/api/*` endpoints
- **Headers**:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 99
  X-RateLimit-Reset: 1634567890
  ```

### Endpoint-Specific Limits

| Endpoint          | Limit               | Window |
| ----------------- | ------------------- | ------ |
| `/api/contact`    | 5 requests          | 1 hour |
| `/api/chat`       | 10 requests         | 1 hour |
| `/api/newsletter` | No additional limit | -      |
| `/api/vitals`     | No additional limit | -      |
| `/api/errors`     | No additional limit | -      |

### Rate Limit Response

**Status**: `429 Too Many Requests`

```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Endpoints

### 1. Contact Form Submission

Submit a contact form with user information and optional quiz recommendations.

**Endpoint**: `POST /api/contact`

**Rate Limit**: 5 requests per hour per IP

**Request Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Inc",
  "message": "I'm interested in a custom landing page...",
  "recaptchaToken": "03AGdBq24...",
  "recommendation": {
    "solutionName": "Professional Website",
    "timeline": "2-3 weeks",
    "investmentRange": "$1,700 - $3,500"
  }
}
```

**Field Validation**:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | Min 2 characters |
| `email` | string | Yes | Valid email format |
| `company` | string | No | - |
| `message` | string | Yes | Min 10 characters |
| `recaptchaToken` | string | Yes | Min 1 character |
| `recommendation` | object | No | - |

**Success Response**:

```json
{
  "success": true,
  "message": "Form submitted successfully"
}
```

**Status**: `200 OK`

**Error Responses**:

**Validation Error** (`400 Bad Request`):

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": ["email"],
      "message": "Invalid email"
    }
  ]
}
```

**reCAPTCHA Failed** (`400 Bad Request`):

```json
{
  "success": false,
  "message": "reCAPTCHA verification failed. Please try again."
}
```

**Server Error** (`500 Internal Server Error`):

```json
{
  "success": false,
  "message": "An error occurred while processing your request"
}
```

**Example Request**:

```bash
curl -X POST https://your-app.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I need a website for my business",
    "recaptchaToken": "03AGdBq24..."
  }'
```

---

### 2. Chat Widget Submission

Submit a message through the chat widget with optional topic suggestions.

**Endpoint**: `POST /api/chat`

**Rate Limit**: 10 requests per hour per IP

**Request Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "message": "What's your pricing for a 5-page website?",
  "suggestions": ["Pricing", "Request a Demo"],
  "hp_field": "",
  "recaptchaToken": "03AGdBq24..."
}
```

**Field Validation**:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | Min 1 character |
| `email` | string | Yes | Valid email format |
| `message` | string | Yes | Min 1 char, Max 500 chars |
| `suggestions` | array | No | Array of strings |
| `hp_field` | string | No | Honeypot (must be empty) |
| `recaptchaToken` | string | Yes | Min 1 character |

**Success Response**:

```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

**Status**: `200 OK`

**Error Responses**:

**Spam Detected** (`400 Bad Request`):

```json
{
  "success": false,
  "message": "Spam detected"
}
```

_Note: Triggered when honeypot field is filled_

**Validation Error** (`400 Bad Request`):

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": ["message"],
      "message": "Message must be at most 500 characters"
    }
  ]
}
```

**Server Error** (`500 Internal Server Error`):

```json
{
  "success": false,
  "message": "An error occurred while sending your message"
}
```

**Example Request**:

```bash
curl -X POST https://your-app.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "message": "What is your pricing?",
    "suggestions": ["Pricing"],
    "hp_field": "",
    "recaptchaToken": "03AGdBq24..."
  }'
```

---

### 3. Newsletter Subscription

Subscribe a user to the newsletter.

**Endpoint**: `POST /api/newsletter`

**Rate Limit**: 100 requests per 15 minutes (global only)

**Request Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "email": "subscriber@example.com",
  "hp_field": "",
  "recaptchaToken": "03AGdBq24..."
}
```

**Field Validation**:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | Yes | Valid email format |
| `hp_field` | string | No | Honeypot (must be empty) |
| `recaptchaToken` | string | Yes | Min 1 character |

**Success Response**:

```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

**Status**: `200 OK`

**Error Responses**:

**Spam Detected** (`400 Bad Request`):

```json
{
  "success": false,
  "message": "Spam detected"
}
```

**Validation Error** (`400 Bad Request`):

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": ["email"],
      "message": "Invalid email"
    }
  ]
}
```

**Server Error** (`500 Internal Server Error`):

```json
{
  "success": false,
  "message": "An error occurred while subscribing to the newsletter"
}
```

**Example Request**:

```bash
curl -X POST https://your-app.com/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "subscriber@example.com",
    "hp_field": "",
    "recaptchaToken": "03AGdBq24..."
  }'
```

---

### 4. Web Vitals Tracking

Send Core Web Vitals performance metrics to the server for monitoring.

**Endpoint**: `POST /api/vitals`

**Rate Limit**: 100 requests per 15 minutes (global only)

**Request Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "name": "LCP",
  "value": 1234.56,
  "rating": "good",
  "delta": 100.5,
  "pathname": "/",
  "navigationType": "navigate"
}
```

**Field Validation**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Metric name (LCP, CLS, TTFB, INP) |
| `value` | number | Yes | Metric value in milliseconds |
| `rating` | string | Yes | "good" \| "needs-improvement" \| "poor" |
| `delta` | number | Yes | Change since last report |
| `pathname` | string | No | Current page path |
| `navigationType` | string | No | "navigate" \| "reload" \| "back_forward" |

**Success Response**:

```json
{
  "success": true
}
```

**Status**: `200 OK`

**Error Response**:

```json
{
  "success": false
}
```

**Status**: `500 Internal Server Error`

**Example Request**:

```bash
curl -X POST https://your-app.com/api/vitals \
  -H "Content-Type: application/json" \
  -d '{
    "name": "LCP",
    "value": 1234.56,
    "rating": "good",
    "delta": 100.5,
    "pathname": "/"
  }'
```

**Tracked Metrics**:

| Metric                              | Description           | Good    | Needs Improvement | Poor    |
| ----------------------------------- | --------------------- | ------- | ----------------- | ------- |
| **LCP** (Largest Contentful Paint)  | Loading performance   | ≤ 2.5s  | 2.5s - 4.0s       | > 4.0s  |
| **CLS** (Cumulative Layout Shift)   | Visual stability      | ≤ 0.1   | 0.1 - 0.25        | > 0.25  |
| **TTFB** (Time to First Byte)       | Server responsiveness | ≤ 800ms | 800ms - 1.8s      | > 1.8s  |
| **INP** (Interaction to Next Paint) | Interactivity         | ≤ 200ms | 200ms - 500ms     | > 500ms |

---

### 5. Client Error Tracking

Send client-side JavaScript errors to the server for logging and notifications.

**Endpoint**: `POST /api/errors`

**Rate Limit**: 100 requests per 15 minutes (global only)

**Request Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "message": "Cannot read property 'foo' of undefined",
  "stack": "TypeError: Cannot read property 'foo' of undefined\n    at App.tsx:42:10",
  "type": "error",
  "severity": "error",
  "url": "https://your-app.com/",
  "pathname": "/",
  "userAgent": "Mozilla/5.0...",
  "timestamp": 1634567890123,
  "componentStack": "at Component (App.tsx:42)",
  "context": {
    "browser": "Chrome",
    "version": "95.0",
    "screenResolution": "1920x1080"
  }
}
```

**Field Validation**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | Error message |
| `stack` | string | No | Stack trace |
| `type` | string | Yes | "error" \| "unhandledrejection" \| "react" |
| `severity` | string | Yes | "critical" \| "error" \| "warning" |
| `url` | string | Yes | Full page URL |
| `pathname` | string | Yes | Page pathname |
| `userAgent` | string | Yes | Browser user agent |
| `timestamp` | number | Yes | Unix timestamp (ms) |
| `componentStack` | string | No | React component stack |
| `context` | object | No | Additional context |

**Success Response**:

```json
{
  "success": true
}
```

**Status**: `200 OK`

**Error Response**:

```json
{
  "success": false
}
```

**Status**: `200 OK` (always returns 200 to prevent retry loops)

**Example Request**:

```bash
curl -X POST https://your-app.com/api/errors \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Network request failed",
    "type": "error",
    "severity": "error",
    "url": "https://your-app.com/",
    "pathname": "/",
    "userAgent": "Mozilla/5.0...",
    "timestamp": 1634567890123
  }'
```

**Severity Classification**:

**Critical** (immediate email notification):

- Payment/checkout errors
- Authentication failures
- Security issues
- Database errors
- Network failures

**Error** (standard logging):

- React component errors
- API failures
- Validation errors

**Warning** (debug logging):

- Deprecation warnings
- Console logs
- Non-critical issues

**Email Notification**:

- **Trigger**: Critical or Error severity
- **Rate Limit**: Max 10 emails per hour
- **Cooldown**: 5 minutes between emails
- **Deduplication**: Same error signature cached for 5 minutes

---

## Error Handling

### Standard Error Response Format

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [
    /* Optional: validation errors */
  ]
}
```

### HTTP Status Codes

| Status | Meaning               | When Used                                  |
| ------ | --------------------- | ------------------------------------------ |
| `200`  | OK                    | Request succeeded                          |
| `400`  | Bad Request           | Validation failed or invalid input         |
| `429`  | Too Many Requests     | Rate limit exceeded                        |
| `500`  | Internal Server Error | Server-side error                          |
| `502`  | Bad Gateway           | External service (email, reCAPTCHA) failed |

---

## Security

### reCAPTCHA v3 Integration

All form submissions require a valid reCAPTCHA v3 token:

1. **Client-side**: Generate token

   ```typescript
   const token = await executeRecaptcha("submit_form");
   ```

2. **Include in request**: Add to `recaptchaToken` field

3. **Server-side verification**:
   - Sends token to Google's API
   - Checks `success` and `score` (≥ 0.5)
   - Rejects if verification fails

**Development Mode**:

- Can skip reCAPTCHA if `RECAPTCHA_SECRET_KEY` not set
- Set `ALLOW_TEST_RECAPTCHA=true` to accept `"test_token"`

### Honeypot Fields

The `hp_field` parameter is a honeypot to catch bots:

- Must be included in request (optional)
- **Must be empty string** or omitted
- If filled, request is rejected as spam

### Input Sanitization

All inputs are validated with Zod schemas:

- Type checking
- Length limits
- Format validation (email, etc.)
- SQL injection prevention (no database queries)
- XSS prevention (email templates sanitized)

---

## Request ID Tracing

Every API request receives a unique request ID for debugging:

**Request**:

```
X-Request-ID: abc123def456
```

**Logging**:

```json
{
  "level": "info",
  "message": "Contact form submission sent",
  "requestId": "abc123def456",
  "email": "user@example.com"
}
```

Request IDs are included in server logs and error reports for easy correlation.

---

## CORS Policy

### Allowed Origins

**Development**:

- `http://localhost:7223`
- `http://localhost:5173`
- `http://127.0.0.1:7223`
- `http://127.0.0.1:5173`

**Production**:

- Value of `FRONTEND_URL` environment variable
- Example: `https://appturnity.web.app`

### Allowed Methods

- `GET`
- `POST`

### Allowed Headers

- `Content-Type`
- `Authorization`

### Credentials

Credentials (cookies, HTTP auth) are allowed: `Access-Control-Allow-Credentials: true`

---

## Examples

### Complete Contact Form Submission (JavaScript)

```typescript
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const { executeRecaptcha } = useGoogleReCaptcha();

async function submitContact(formData) {
  // Get reCAPTCHA token
  const recaptchaToken = await executeRecaptcha("submit_contact");

  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      company: formData.company,
      message: formData.message,
      recaptchaToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit form");
  }

  return data;
}
```

### Tracking Web Vitals

```typescript
import { onLCP, onCLS, onTTFB, onINP } from "web-vitals";

function sendToAnalytics(metric) {
  fetch("/api/vitals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      pathname: window.location.pathname,
    }),
    keepalive: true,
  });
}

onLCP(sendToAnalytics);
onCLS(sendToAnalytics);
onTTFB(sendToAnalytics);
onINP(sendToAnalytics);
```

---

## Changelog

### Version 1.0.0 (2025-10-18)

- Initial API release
- 5 endpoints: Contact, Chat, Newsletter, Vitals, Errors
- reCAPTCHA v3 integration
- Rate limiting
- Error tracking with email notifications
- Structured logging

---

## Support

For API issues or questions:

- **Email**: contact@appturnity.com
- **Documentation**: See `/docs/ARCHITECTURE.md`
- **Error Logs**: Check server logs with request ID

---

**API Version**: 1.0.0
**Last Updated**: 2025-10-18
