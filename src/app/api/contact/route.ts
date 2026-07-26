import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_EMAIL || 'vidyalyaraag@gmail.com';
    const pass = process.env.SMTP_PASSWORD || 'krhg ibms umgv cwsv';
    const from = process.env.SMTP_FROM || user;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: user.trim(),
        pass: pass.replace(/\s+/g, ''), // handle app password spacing
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `"${name}" <${from}>`,
      to: 'vidyalyaraag@gmail.com',
      replyTo: email,
      subject: `New Contact Inquiry from ${name} - Raag Vidyalaya`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #D4A44A; border-bottom: 2px solid #D4A44A; padding-bottom: 10px;">
            Raag Vidyalaya - New Contact Query
          </h2>
          <p style="font-size: 15px;"><strong>Name:</strong> ${name}</p>
          <p style="font-size: 15px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p style="font-size: 15px;"><strong>Phone:</strong> ${phone}</p>` : ''}
          <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #D4A44A; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; white-space: pre-wrap;"><strong>Message:</strong></p>
            <p style="margin-top: 8px; font-size: 14px; line-height: 1.5;">${message}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #888;">
            Sent from Raag Vidyalaya Website Contact Form
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully!' });
  } catch (error: any) {
    console.error('SMTP Email Send Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
