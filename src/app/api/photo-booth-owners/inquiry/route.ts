import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import os from "os";

const SHIM = path.join(
  os.homedir(),
  "Desktop/_Code/mighty/agents/email/inbox-agent/cli/pb_owners_inquiry.py"
);

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

  const payload = JSON.stringify({
    name: name.trim(),
    email: email.trim(),
    company: (body.company ?? "").trim(),
    service: service.trim(),
    message: message.trim(),
  });

  try {
    const result = await runShim(payload);
    const parsed = JSON.parse(result);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error ?? "draft failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

function runShim(stdin: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("python3", [SHIM], {
      env: { ...process.env, PYTHONUNBUFFERED: "1" },
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d: Buffer) => { stdout += d.toString(); });
    proc.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });

    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`shim exited ${code}: ${stderr.trim()}`));
      } else {
        resolve(stdout.trim());
      }
    });

    proc.on("error", reject);
    proc.stdin.write(stdin);
    proc.stdin.end();
  });
}
