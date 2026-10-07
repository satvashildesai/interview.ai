import { NextRequest, NextResponse } from "next/server";
import { executeCode } from "@/lib/judge0";
import { SupportedLanguage } from "@/data/languages";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { language, code, stdin } = body as {
      language: SupportedLanguage;
      code: string;
      stdin: string;
    };

    if (!language || !code) {
      return NextResponse.json(
        { error: "Missing required fields: language, code" },
        { status: 400 }
      );
    }

    const result = await executeCode(language, code, stdin || "");

    return NextResponse.json(result);
  } catch (error) {
    console.error("Run API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
