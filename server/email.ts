import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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

export async function sendContactEmail(data: ContactFormData) {
  const { name, email, company, message, recommendation } = data;

  // Development mode: log to console instead of sending email
  if (!resend) {
    console.log("\n" + "=".repeat(60));
    console.log("📧 DEVELOPMENT MODE: Email not sent (no RESEND_API_KEY)");
    console.log("=".repeat(60));
    console.log(`From: ${name} <${email}>`);
    if (company) console.log(`Company: ${company}`);
    if (recommendation) {
      console.log(`\n${recommendation.priorityLabel}`);
      console.log(`Solution: ${recommendation.solutionName}`);
      console.log(`Timeline: ${recommendation.timeline}`);
      console.log(`Budget: ${recommendation.investmentRange}`);
      console.log(`Score: ${recommendation.priorityScore}/40+ (Budget: ${recommendation.scores.budget}/4, Urgency: ${recommendation.scores.urgency}/4, Complexity: ${recommendation.scores.complexity}/4)`);
    }
    console.log(`Message:\n${message}`);
    console.log("=".repeat(60) + "\n");
    return { success: true, mode: 'development' };
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
          ${recommendation ? `
            <div class="priority-badge priority-${recommendation.priorityScore >= 32 ? 'high' : recommendation.priorityScore >= 24 ? 'medium' : 'standard'}">
              ${recommendation.priorityLabel}
            </div>
          ` : ''}
        </div>
        <div class="content">
          ${recommendation ? `
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
          ` : ''}
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
          ${company ? `
          <div class="field">
            <span class="label">Company</span>
            <div class="value">${company}</div>
          </div>
          ` : ''}
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
${recommendation ? `\n${recommendation.priorityLabel}\n` + '='.repeat(60) + `

QUIZ RECOMMENDATION:
- Recommended Solution: ${recommendation.solutionName}
- Timeline: ${recommendation.timeline}
- Budget Range: ${recommendation.investmentRange}
- Priority Score: ${recommendation.priorityScore}/40+
  - Budget Score: ${recommendation.scores.budget}/4
  - Urgency Score: ${recommendation.scores.urgency}/4
  - Complexity Score: ${recommendation.scores.complexity}/4

` + '='.repeat(60) + '\n' : ''}
Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ''}

Message:
${message}

---
Reply to: ${email}
  `.trim();

  try {
    const priorityPrefix = recommendation && recommendation.priorityScore >= 32
      ? '🔥 HIGH PRIORITY - '
      : recommendation && recommendation.priorityScore >= 24
      ? '⚡ '
      : '';

    const result = await resend.emails.send({
      from: 'Appturnity Contact Form <onboarding@resend.dev>', // Change this to your verified domain
      to: process.env.CONTACT_EMAIL || 'nathancwatkins23@gmail.com',
      replyTo: email,
      subject: `${priorityPrefix}New Contact: ${name}${company ? ` from ${company}` : ''}`,
      html: htmlContent,
      text: textContent,
    });

    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export async function sendChatWidgetEmail(data: ChatWidgetData) {
  const { name, email, message, suggestions } = data;

  // Development mode: log to console instead of sending email
  if (!resend) {
    console.log("\n" + "=".repeat(60));
    console.log("💬 DEVELOPMENT MODE: Chat Widget Email not sent (no RESEND_API_KEY)");
    console.log("=".repeat(60));
    console.log(`From: ${name} <${email}>`);
    if (suggestions && suggestions.length > 0) {
      console.log(`Topics: ${suggestions.join(', ')}`);
    }
    console.log(`Message:\n${message}`);
    console.log("=".repeat(60) + "\n");
    return { success: true, mode: 'development' };
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
          ${suggestions && suggestions.length > 0 ? `
          <div class="field">
            <span class="label">Interested In</span>
            <div class="value">
              ${suggestions.map(s => `<span class="badge">${s}</span>`).join('')}
            </div>
          </div>
          ` : ''}
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
${suggestions && suggestions.length > 0 ? `Topics: ${suggestions.join(', ')}` : ''}

Message:
${message}

---
Reply to: ${email}
  `.trim();

  try {
    const result = await resend.emails.send({
      from: 'Appturnity Chat Widget <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'nathancwatkins23@gmail.com',
      replyTo: email,
      subject: `💬 Chat: ${name}${suggestions && suggestions.length > 0 ? ` - ${suggestions.join(', ')}` : ''}`,
      html: htmlContent,
      text: textContent,
    });

    return result;
  } catch (error) {
    console.error('Failed to send chat widget email:', error);
    throw error;
  }
}
