import { NextResponse } from "next/server";

interface InquiryBody {
  name?: string;
  email?: string;
  company?: string;
  service?: string;
  message?: string;
}

export async function POST(request: Request) {
  const body: InquiryBody = await request.json();
  const { name, email, service, message } = body;

  if (!name || !email || !service || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      await resend.emails.send({
        from: "andrewwebber.dev <noreply@andrewwebber.dev>",
        to: process.env.CONTACT_EMAIL ?? "andrew@mightyphotobooths.com",
        subject: `[PB-Owner] ${service.trim()} — ${name.trim()}`,
        text: [
          `Name: ${name.trim()}`,
          `Email: ${email.trim()}`,
          `Company: ${(body.company ?? "").trim() || "N/A"}`,
          `Service: ${service.trim()}`,
          "",
          message.trim(),
        ].join("\n"),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: msg }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true });
}
