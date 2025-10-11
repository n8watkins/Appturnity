import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData) {
  const { name, email, company, message } = data;

  // Development mode: log to console instead of sending email
  if (!resend) {
    console.log("\n" + "=".repeat(60));
    console.log("📧 DEVELOPMENT MODE: Email not sent (no RESEND_API_KEY)");
    console.log("=".repeat(60));
    console.log(`From: ${name} <${email}>`);
    if (company) console.log(`Company: ${company}`);
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
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚀 New Contact Form Submission</h1>
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

Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ''}

Message:
${message}

---
Reply to: ${email}
  `.trim();

  try {
    const result = await resend.emails.send({
      from: 'Appturnity Contact Form <onboarding@resend.dev>', // Change this to your verified domain
      to: process.env.CONTACT_EMAIL || 'nathancwatkins23@gmail.com',
      replyTo: email,
      subject: `New Contact: ${name}${company ? ` from ${company}` : ''}`,
      html: htmlContent,
      text: textContent,
    });

    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
