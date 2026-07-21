import part01 from "./part-01";
import part02 from "./part-02";
import part03 from "./part-03";
import part04 from "./part-04";
import part05 from "./part-05";
import part06 from "./part-06";
import part07 from "./part-07";
import part08 from "./part-08";
import part09 from "./part-09";
import part10 from "./part-10";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const audio = Buffer.from(
  part01 + part02 + part03 + part04 + part05 + part06 + part07 + part08 + part09 + part10,
  "base64",
);

export function GET(request: Request) {
  const range = request.headers.get("range");
  const commonHeaders = {
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Type": "audio/mpeg",
  };

  if (!range) {
    return new Response(audio, {
      headers: {
        ...commonHeaders,
        "Content-Length": String(audio.length),
      },
    });
  }

  const match = /bytes=(\d*)-(\d*)/.exec(range);
  if (!match) {
    return new Response(null, {
      status: 416,
      headers: { ...commonHeaders, "Content-Range": `bytes */${audio.length}` },
    });
  }

  const requestedStart = match[1] ? Number(match[1]) : 0;
  const requestedEnd = match[2] ? Number(match[2]) : audio.length - 1;
  const start = Math.max(0, Math.min(requestedStart, audio.length - 1));
  const end = Math.max(start, Math.min(requestedEnd, audio.length - 1));
  const chunk = audio.subarray(start, end + 1);

  return new Response(chunk, {
    status: 206,
    headers: {
      ...commonHeaders,
      "Content-Length": String(chunk.length),
      "Content-Range": `bytes ${start}-${end}/${audio.length}`,
    },
  });
}
