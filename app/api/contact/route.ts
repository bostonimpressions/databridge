import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { checkBotId } from 'botid/server';

export async function POST(req: NextRequest) {
  const verification = await checkBotId();
  if (verification.isBot) {
    return NextResponse.json(
      { error: 'Bot detected. Access denied.' },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { type } = body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    logger: true,
    debug: true,
  });

  /**
   * Provider-safe FROM address
   * - SendGrid requires verified CONTACT_EMAIL
   * - SMTP2GO requires SMTP_USER
   */
  const isSendGrid = process.env.SMTP_USER === 'apikey';

  const fromAddress = isSendGrid
    ? `"NuView Website" <${process.env.CONTACT_EMAIL}>`
    : `"NuView Website" <${process.env.SMTP_USER}>`;

  try {
    if (type === 'partnership') {
      const {
        organization,
        firstName,
        lastName,
        email,
        role,
        industry,
        users,
        locations,
        frameworks,
        timeline,
        notes,
      } = body;

      if (
        !organization ||
        !firstName ||
        !lastName ||
        !email ||
        !role ||
        !industry
      ) {
        return NextResponse.json(
          { error: 'Please fill in all required fields.' },
          { status: 400 }
        );
      }

      await transporter.sendMail({
        from: fromAddress,
        to: process.env.CONTACT_EMAIL,
        replyTo: `${firstName} ${lastName} <${email}>`,
        subject: `New Partnership Inquiry – ${organization}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #e0e0e0; border-radius:12px; background:#ffffff; line-height:1.5; color:#111;">
            <h2 style="color:#394FA2; border-bottom:2px solid #394FA2; padding-bottom:8px;">New Partnership Inquiry</h2>
            <table style="width:100%; margin-top:10px; border-collapse:collapse;">
              <tr><td style="font-weight:bold; padding:5px 0; width:150px;">Organization:</td><td>${organization}</td></tr>
              <tr><td style="font-weight:bold; padding:5px 0;">Name:</td><td>${firstName} ${lastName}</td></tr>
              <tr><td style="font-weight:bold; padding:5px 0;">Email:</td><td>${email}</td></tr>
              <tr><td style="font-weight:bold; padding:5px 0;">Role:</td><td>${role}</td></tr>
              <tr><td style="font-weight:bold; padding:5px 0;">Industry:</td><td>${industry}</td></tr>
              <tr><td style="font-weight:bold; padding:5px 0;">Users:</td><td>${users || 'N/A'}</td></tr>
              <tr><td style="font-weight:bold; padding:5px 0;">Locations:</td><td>${locations || 'N/A'}</td></tr>
              <tr><td style="font-weight:bold; padding:5px 0;">Compliance Frameworks:</td><td>${(frameworks || []).join(', ') || 'N/A'}</td></tr>
              <tr><td style="font-weight:bold; padding:5px 0;">Timeline:</td><td>${timeline || 'N/A'}</td></tr>
            </table>

            ${
          notes
            ? `<div style="margin-top:15px; padding:10px; background:#f5f5f5; border-left:4px solid #394FA2; border-radius:6px;">
                    <strong>Additional Notes:</strong><br>
                    ${notes.replace(/\n/g, '<br>')}
                  </div>`
            : ''
        }

            <p style="margin-top:20px; font-size:12px; color:#888;">
              Submitted via the Partnership Contact Form.
            </p>
          </div>
        `,
      });
    } else {
      // General contact form
      const { name, email, message } = body;

      if (!name || !email || !message) {
        return NextResponse.json(
          { error: 'Please fill in all fields.' },
          { status: 400 }
        );
      }

      await transporter.sendMail({
        from: fromAddress,
        to: process.env.CONTACT_EMAIL,
        replyTo: `${name} <${email}>`,
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #e0e0e0; border-radius:12px; background:#ffffff; line-height:1.5; color:#111;">
            <h2 style="color:#394FA2; border-bottom:2px solid #394FA2; padding-bottom:8px;">New Contact Form Submission</h2>
            <table style="width:100%; margin-top:10px; border-collapse:collapse;">
              <tr><td style="font-weight:bold; padding:5px 0; width:100px;">Name:</td><td>${name}</td></tr>
              <tr><td style="font-weight:bold; padding:5px 0;">Email:</td><td>${email}</td></tr>
            </table>

            <div style="margin-top:15px; padding:10px; background:#f5f5f5; border-left:4px solid #394FA2; border-radius:6px;">
              ${message.replace(/\n/g, '<br>')}
            </div>

            <p style="margin-top:20px; font-size:12px; color:#888;">
              Submitted via the General Contact Form.
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    return NextResponse.json(
      { error: 'Failed to send message.' },
      { status: 500 }
    );
  }
}
