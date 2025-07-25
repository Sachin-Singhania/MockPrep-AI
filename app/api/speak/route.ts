import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const message = searchParams.get("message") || "";
  const result = await fetch("https://api.elevenlabs.io/v1/text-to-speech/eA8FmgNe2rjMWPK5PQQZ/stream", {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVEN_LABS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text:message,
      model_id: "eleven_turbo_v2",
    }),
  });

  if (!result.ok) return new NextResponse("Error", { status: 500 });

  return new NextResponse(result.body, {
    headers: {
      "Content-Type": "audio/mpeg", "Transfer-Encoding": "chunked",
    },
  });
}