import { authOptions } from "@/lib/auth";
import { ratelimit, redis } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const tokenCookie = cookies().get('tts-session-token');
    if (!tokenCookie?.value) {
      return NextResponse.json({ error: "Unauthorized: Session token is missing" }, { status: 401 });
    }
    const token = tokenCookie.value;

    const sessionDataString: {
      userId: string,
      interviewId: string,
    } | null = await redis.get(`tts-session:${token}`);
    if (!sessionDataString) {
      return NextResponse.json({ error: "Forbidden: Invalid or expired session." }, { status: 403 });
    }

    const { userId } = sessionDataString;

    const { success } = await ratelimit.limit(userId);
    if (!success) {
      return NextResponse.json({ error: "Too many Request" }, { status: 429 });
    }

    const { text } = await req.json();

    const message = text?.trim();
    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }
    console.log("REACHED HERE 2")
    const result = await fetch("https://api.elevenlabs.io/v1/text-to-speech/eA8FmgNe2rjMWPK5PQQZ/stream", {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVEN_LABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: message,
        model_id: "eleven_turbo_v2",
      }),
    });
    console.log("REACHED HERE 2")
    if (!result.ok) {
      console.log("REACHED HERE 2")
      console.error("Eleven Labs API error:", await result.text());
      return NextResponse.json({ error: "Error generating speech from provider." }, { status: 502 });
    }

    console.log("REACHED HERE 2")
    return new NextResponse(result.body, {
      headers: {
        "Content-Type": "audio/mpeg", "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Error generating speech from provider." }, { status: 502 });
  }
}