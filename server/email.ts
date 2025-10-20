import { Resend } from "resend";
import { logger } from "./lib/logger";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  recommendation?: {
    solutionName: string;
    solutionType: string;
    timeline: string;
    investmentRange: string;
    priorityScore: number;
    priorityLabel: string;
    scores: {
      budget: number;
      urgency: number;
      complexity: number;
    };
  };
}

interface ChatWidgetData {
  name: string;
  email: string;
  message: string;
  suggestions?: string[];
}

interface NewsletterData {
  email: string;
}

interface QuizExitModalData {
  name: string;
  email: string;
  quizAnswers?: Record<string, string | string[]>;
}

export async function sendContactEmail(data: ContactFormData) {
  const { name, email, company, message, recommendation } = data;

  // Development mode: log to console instead of sending email
  if (!resend) {
    logger.warn("DEVELOPMENT MODE: Email not sent (no RESEND_API_KEY)", {
      from: `${name} <${email}>`,
      company,
      recommendation,
      message: message.substring(0, 100),
    });
    return { success: true, mode: "development" };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .field {
            margin-bottom: 20px;
          }
          .label {
            font-weight: 600;
            color: #374151;
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .value {
            background: white;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            font-size: 15px;
          }
          .message-value {
            white-space: pre-wrap;
            min-height: 100px;
          }
          .footer {
            background: #1f2937;
            color: #9ca3af;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-radius: 0 0 8px 8px;
          }
          .cta-button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 10px;
            font-weight: 600;
          }
          .priority-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 700;
            margin: 10px 0;
          }
          .priority-high {
            background: #fef3c7;
            color: #92400e;
            border: 2px solid #f59e0b;
          }
          .priority-medium {
            background: #dbeafe;
            color: #1e40af;
            border: 2px solid #3b82f6;
          }
          .priority-standard {
            background: #f3f4f6;
            color: #374151;
            border: 2px solid #9ca3af;
          }
          .recommendation-box {
            background: #f0f9ff;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
          }
          .score-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-top: 10px;
          }
          .score-item {
            background: white;
            padding: 10px;
            border-radius: 6px;
            text-align: center;
            border: 1px solid #e5e7eb;
          }
          .score-label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .score-value {
            font-size: 20px;
            font-weight: 700;
            color: #667eea;
            margin-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚀 New Contact Form Submission</h1>
          ${
            recommendation
              ? `
            <div class="priority-badge priority-${recommendation.priorityScore >= 32 ? "high" : recommendation.priorityScore >= 24 ? "medium" : "standard"}">
              ${recommendation.priorityLabel}
            </div>
          `
              : ""
          }
        </div>
        <div class="content">
          ${
            recommendation
              ? `
          <div class="recommendation-box">
            <h3 style="margin: 0 0 10px 0; color: #667eea;">📊 Quiz Recommendation</h3>
            <div style="margin-bottom: 10px;">
              <strong>Recommended Solution:</strong> ${recommendation.solutionName}
            </div>
            <div style="margin-bottom: 10px;">
              <strong>Timeline:</strong> ${recommendation.timeline}
            </div>
            <div style="margin-bottom: 10px;">
              <strong>Budget Range:</strong> ${recommendation.investmentRange}
            </div>
            <div class="score-grid">
              <div class="score-item">
                <div class="score-label">Budget</div>
                <div class="score-value">${recommendation.scores.budget}/4</div>
              </div>
              <div class="score-item">
                <div class="score-label">Urgency</div>
                <div class="score-value">${recommendation.scores.urgency}/4</div>
              </div>
              <div class="score-item">
                <div class="score-label">Complexity</div>
                <div class="score-value">${recommendation.scores.complexity}/4</div>
              </div>
            </div>
            <div style="margin-top: 10px; font-size: 13px; color: #6b7280;">
              Total Score: <strong>${recommendation.priorityScore}/40+</strong>
            </div>
          </div>
          `
              : ""
          }
          <div class="field">
            <span class="label">Name</span>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <span class="label">Email</span>
            <div class="value">
              <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
            </div>
          </div>
          ${
            company
              ? `
          <div class="field">
            <span class="label">Company</span>
            <div class="value">${company}</div>
          </div>
          `
              : ""
          }
          <div class="field">
            <span class="label">Message</span>
            <div class="value message-value">${message}</div>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${email}" class="cta-button">Reply to ${name}</a>
          </div>
        </div>
        <div class="footer">
          Sent from Appturnity Contact Form
        </div>
      </body>
    </html>
  `;

  const textContent = `
New Contact Form Submission
============================
${
  recommendation
    ? `\n${recommendation.priorityLabel}\n` +
      "=".repeat(60) +
      `

QUIZ RECOMMENDATION:
- Recommended Solution: ${recommendation.solutionName}
- Timeline: ${recommendation.timeline}
- Budget Range: ${recommendation.investmentRange}
- Priority Score: ${recommendation.priorityScore}/40+
  - Budget Score: ${recommendation.scores.budget}/4
  - Urgency Score: ${recommendation.scores.urgency}/4
  - Complexity Score: ${recommendation.scores.complexity}/4

` +
      "=".repeat(60) +
      "\n"
    : ""
}
Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ""}

Message:
${message}

---
Reply to: ${email}
  `.trim();

  try {
    const priorityPrefix =
      recommendation && recommendation.priorityScore >= 32
        ? "🔥 HIGH PRIORITY - "
        : recommendation && recommendation.priorityScore >= 24
          ? "⚡ "
          : "";

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Appturnity Contact Form <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "nathancwatkins23@gmail.com",
      replyTo: email,
      subject: `${priorityPrefix}New Contact: ${name}${company ? ` from ${company}` : ""}`,
      html: htmlContent,
      text: textContent,
    });

    return result;
  } catch (error) {
    logger.error("Failed to send contact email", error as Error, { email, name });
    throw error;
  }
}

export async function sendNewsletterSubscription(data: NewsletterData) {
  const { email } = data;

  // Development mode: log to console instead of sending email
  if (!resend) {
    logger.warn("DEVELOPMENT MODE: Newsletter subscription not sent (no RESEND_API_KEY)", {
      email,
    });
    return { success: true, mode: "development" };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .field {
            margin-bottom: 20px;
          }
          .label {
            font-weight: 600;
            color: #374151;
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .value {
            background: white;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            font-size: 15px;
          }
          .footer {
            background: #1f2937;
            color: #9ca3af;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-radius: 0 0 8px 8px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📰 New Newsletter Subscriber</h1>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Email</span>
            <div class="value">
              <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
            </div>
          </div>
          <div class="field">
            <span class="label">Subscribed</span>
            <div class="value">${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</div>
          </div>
        </div>
        <div class="footer">
          Sent from Appturnity Newsletter
        </div>
      </body>
    </html>
  `;

  const textContent = `
New Newsletter Subscriber
=========================

Email: ${email}
Subscribed: ${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
  `.trim();

  try {
    // Send notification to site owner
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Appturnity Newsletter <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "nathancwatkins23@gmail.com",
      subject: `📰 New Newsletter Subscriber: ${email}`,
      html: htmlContent,
      text: textContent,
    });

    return result;
  } catch (error) {
    logger.error("Failed to send newsletter subscription email", error as Error, { email });
    throw error;
  }
}

export async function sendChatWidgetEmail(data: ChatWidgetData) {
  const { name, email, message, suggestions } = data;

  // Development mode: log to console instead of sending email
  if (!resend) {
    logger.warn("DEVELOPMENT MODE: Chat widget email not sent (no RESEND_API_KEY)", {
      from: `${name} <${email}>`,
      suggestions,
      message: message.substring(0, 100),
    });
    return { success: true, mode: "development" };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .field {
            margin-bottom: 20px;
          }
          .label {
            font-weight: 600;
            color: #374151;
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .value {
            background: white;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            font-size: 15px;
          }
          .message-value {
            white-space: pre-wrap;
            min-height: 100px;
          }
          .badge {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 13px;
            margin-right: 8px;
            margin-bottom: 8px;
          }
          .footer {
            background: #1f2937;
            color: #9ca3af;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-radius: 0 0 8px 8px;
          }
          .cta-button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 10px;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💬 New Chat Widget Message</h1>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Name</span>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <span class="label">Email</span>
            <div class="value">
              <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
            </div>
          </div>
          ${
            suggestions && suggestions.length > 0
              ? `
          <div class="field">
            <span class="label">Interested In</span>
            <div class="value">
              ${suggestions.map((s) => `<span class="badge">${s}</span>`).join("")}
            </div>
          </div>
          `
              : ""
          }
          <div class="field">
            <span class="label">Message</span>
            <div class="value message-value">${message}</div>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${email}" class="cta-button">Reply to ${name}</a>
          </div>
        </div>
        <div class="footer">
          Sent from Appturnity Chat Widget
        </div>
      </body>
    </html>
  `;

  const textContent = `
New Chat Widget Message
=======================

Name: ${name}
Email: ${email}
${suggestions && suggestions.length > 0 ? `Topics: ${suggestions.join(", ")}` : ""}

Message:
${message}

---
Reply to: ${email}
  `.trim();

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Appturnity Chat Widget <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "nathancwatkins23@gmail.com",
      replyTo: email,
      subject: `💬 Chat: ${name}${suggestions && suggestions.length > 0 ? ` - ${suggestions.join(", ")}` : ""}`,
      html: htmlContent,
      text: textContent,
    });

    return result;
  } catch (error) {
    logger.error("Failed to send chat widget email", error as Error, { email, name });
    throw error;
  }
}

export async function sendQuizExitModalEmail(data: QuizExitModalData) {
  const { name, email, quizAnswers } = data;

  // Development mode: log to console instead of sending email
  if (!resend) {
    logger.warn("DEVELOPMENT MODE: Quiz exit modal email not sent (no RESEND_API_KEY)", {
      from: `${name} <${email}>`,
      quizAnswers,
    });
    return { success: true, mode: "development" };
  }

  // Send TWO emails:
  // 1. Confirmation email to the user
  // 2. Notification email to site owner

  // === USER CONFIRMATION EMAIL ===
  const userHtmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
          }
          .discount-badge {
            display: inline-block;
            background: #fef3c7;
            color: #92400e;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: 700;
            margin: 15px 0;
            border: 2px solid #f59e0b;
          }
          .content {
            background: white;
            padding: 40px 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .greeting {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .info-box {
            background: #f0f9ff;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
          }
          .next-steps {
            background: #ecfdf5;
            border: 2px solid #10b981;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
          }
          .next-steps h3 {
            margin: 0 0 15px 0;
            color: #059669;
          }
          .next-steps ul {
            margin: 0;
            padding-left: 20px;
          }
          .next-steps li {
            margin-bottom: 10px;
            color: #374151;
          }
          .footer {
            background: #1f2937;
            color: #9ca3af;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            border-radius: 0 0 8px 8px;
          }
          .footer a {
            color: #667eea;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Your Plan is On the Way!</h1>
          <div class="discount-badge">🎁 10% DISCOUNT INCLUDED</div>
        </div>
        <div class="content">
          <div class="greeting">
            Hi ${name},
          </div>

          <p style="font-size: 16px; line-height: 1.8;">
            Thank you for your interest in Appturnity! We're excited to help you find the perfect solution for your project.
          </p>

          <div class="info-box">
            <h3 style="margin: 0 0 10px 0; color: #667eea;">📬 What happens next?</h3>
            <p style="margin: 0;">
              We're reviewing your information and will send you a <strong>personalized recommendation</strong> with honest pricing and your <strong>10% discount code</strong> within the next 24 hours.
            </p>
          </div>

          <div class="next-steps">
            <h3>🚀 What you'll receive:</h3>
            <ul>
              <li><strong>Custom recommendation</strong> tailored to your specific needs</li>
              <li><strong>Transparent pricing breakdown</strong> with no hidden costs</li>
              <li><strong>10% discount code</strong> valid for your first project</li>
              <li><strong>Timeline estimate</strong> for your project</li>
              <li><strong>Next steps</strong> to get started</li>
            </ul>
          </div>

          <p style="font-size: 16px; line-height: 1.8;">
            In the meantime, if you have any questions, feel free to reply to this email. We're here to help!
          </p>

          <p style="font-size: 16px; margin-top: 30px;">
            Best regards,<br>
            <strong>The Appturnity Team</strong>
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0 0 10px 0;">
            <strong>Appturnity</strong> - Web Consulting<br>
            Custom landing pages built to drive trust and growth
          </p>
          <p style="margin: 10px 0;">
            <a href="https://appturnity.com">Visit our website</a>
          </p>
          <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">
            You're receiving this email because you requested a personalized plan from our quiz.
          </p>
        </div>
      </body>
    </html>
  `;

  const userTextContent = `
Hi ${name},

🎉 Your Plan is On the Way!
🎁 10% DISCOUNT INCLUDED

Thank you for your interest in Appturnity! We're excited to help you find the perfect solution for your project.

WHAT HAPPENS NEXT?
We're reviewing your information and will send you a personalized recommendation with honest pricing and your 10% discount code within the next 24 hours.

WHAT YOU'LL RECEIVE:
- Custom recommendation tailored to your specific needs
- Transparent pricing breakdown with no hidden costs
- 10% discount code valid for your first project
- Timeline estimate for your project
- Next steps to get started

In the meantime, if you have any questions, feel free to reply to this email. We're here to help!

Best regards,
The Appturnity Team

---
Appturnity - Web Consulting
Custom landing pages built to drive trust and growth
Visit: https://appturnity.com
  `.trim();

  // === OWNER NOTIFICATION EMAIL ===
  const ownerHtmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .discount-badge {
            display: inline-block;
            background: #fef3c7;
            color: #92400e;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: 700;
            margin: 10px 0;
            border: 2px solid #f59e0b;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .field {
            margin-bottom: 20px;
          }
          .label {
            font-weight: 600;
            color: #374151;
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .value {
            background: white;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            font-size: 15px;
          }
          .quiz-data-box {
            background: #f0f9ff;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
          }
          .quiz-answer {
            margin-bottom: 12px;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .quiz-answer:last-child {
            border-bottom: none;
          }
          .quiz-question {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 4px;
          }
          .quiz-response {
            color: #6b7280;
            font-size: 14px;
          }
          .footer {
            background: #1f2937;
            color: #9ca3af;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-radius: 0 0 8px 8px;
          }
          .cta-button {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 10px;
            font-weight: 600;
          }
          .priority-note {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
            text-align: center;
          }
          .priority-note strong {
            color: #92400e;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎯 Quiz Exit Lead - 10% Discount Request</h1>
          <div class="discount-badge">🎁 10% DISCOUNT LEAD</div>
        </div>
        <div class="content">
          <div class="priority-note">
            <strong>⚡ High Intent Lead:</strong> User scrolled away from quiz but requested personalized plan + 10% discount
          </div>

          <div class="field">
            <span class="label">Name</span>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <span class="label">Email</span>
            <div class="value">
              <a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a>
            </div>
          </div>

          ${
            quizAnswers && Object.keys(quizAnswers).length > 0
              ? `
          <div class="quiz-data-box">
            <h3 style="margin: 0 0 15px 0; color: #10b981;">📊 Partial Quiz Answers</h3>
            <p style="font-size: 13px; color: #6b7280; margin-bottom: 15px;">
              User provided these answers before scrolling away:
            </p>
            ${Object.entries(quizAnswers)
              .map(
                ([question, answer]) => `
              <div class="quiz-answer">
                <div class="quiz-question">${formatQuestionId(question)}</div>
                <div class="quiz-response">${Array.isArray(answer) ? answer.join(", ") : answer}</div>
              </div>
            `
              )
              .join("")}
          </div>
          `
              : '<p style="color: #6b7280; font-style: italic;">User scrolled away before answering any questions</p>'
          }

          <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #059669;">📝 Next Steps:</h4>
            <ol style="margin: 0; padding-left: 20px; color: #374151;">
              <li>Review partial quiz answers to understand their needs</li>
              <li>Prepare personalized recommendation</li>
              <li>Send custom proposal with 10% discount code</li>
              <li>Follow up within 24 hours as promised</li>
            </ol>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${email}" class="cta-button">Send Personalized Plan</a>
          </div>
        </div>
        <div class="footer">
          Sent from Appturnity Quiz Exit Modal<br>
          <span style="font-size: 11px;">High-intent lead captured via exit-intent modal</span>
        </div>
      </body>
    </html>
  `;

  const textContent = `
🎯 QUIZ EXIT LEAD - 10% DISCOUNT REQUEST
=========================================

⚡ HIGH INTENT LEAD: User scrolled away from quiz but requested personalized plan + 10% discount

Name: ${name}
Email: ${email}

${
  quizAnswers && Object.keys(quizAnswers).length > 0
    ? `PARTIAL QUIZ ANSWERS:
${"-".repeat(60)}
${Object.entries(quizAnswers)
  .map(
    ([question, answer]) =>
      `${formatQuestionId(question)}: ${Array.isArray(answer) ? answer.join(", ") : answer}`
  )
  .join("\n")}
${"-".repeat(60)}
`
    : "User scrolled away before answering any questions"
}

NEXT STEPS:
1. Review partial quiz answers to understand their needs
2. Prepare personalized recommendation
3. Send custom proposal with 10% discount code
4. Follow up within 24 hours as promised

---
Reply to: ${email}
  `.trim();

  // Rename for clarity
  const ownerTextContent = textContent;

  try {
    // Send confirmation email to user
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Appturnity <onboarding@resend.dev>",
      to: email,
      subject: "🎉 Your Personalized Plan is On the Way!",
      html: userHtmlContent,
      text: userTextContent,
    });

    // Send notification email to site owner
    const ownerResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Appturnity Quiz <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "nathancwatkins23@gmail.com",
      replyTo: email,
      subject: `🎁 10% Discount Lead: ${name} (Quiz Exit Capture)`,
      html: ownerHtmlContent,
      text: ownerTextContent,
    });

    return ownerResult;
  } catch (error) {
    logger.error("Failed to send quiz exit modal emails", error as Error, { email, name });
    throw error;
  }
}

// Helper function to format question IDs into readable text
function formatQuestionId(id: string): string {
  const questionMap: Record<string, string> = {
    projectType: "Project Type",
    hasExistingWebsite: "Has Existing Website",
    timeframe: "Timeframe",
    budgetRange: "Budget Range",
    desiredFeatures: "Desired Features",
    primaryGoal: "Primary Goal",
    targetAudience: "Target Audience",
    contentReady: "Content Ready",
    designPreference: "Design Preference",
    technicalRequirements: "Technical Requirements",
    maintenancePreference: "Maintenance Preference",
    priorityFactor: "Priority Factor",
  };
  return questionMap[id] || id;
}
