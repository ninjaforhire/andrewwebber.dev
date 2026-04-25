import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, company, service, message } = body;

  if (!name || !email || !service || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // If Resend is configured, send email
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "andrewwebber.dev <noreply@andrewwebber.dev>",
      to: process.env.CONTACT_EMAIL ?? "andrew@mightyphotobooths.com",
      subject: `[Consultation] ${service} — ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || "N/A"}`,
        `Service: ${service}`,
        "",
        message,
      ].join("\n"),
    });
  }

  return NextResponse.json({ ok: true });
}
