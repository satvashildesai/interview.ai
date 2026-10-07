import { NextRequest, NextResponse } from "next/server";
import { generateAiResponse, AiRequest } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body: AiRequest = await request.json();

    if (!body.prompt || !body.language) {
      return NextResponse.json(
        { error: "Missing required fields: prompt, language" },
        { status: 400 }
      );
    }

    const response = await generateAiResponse(body);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
