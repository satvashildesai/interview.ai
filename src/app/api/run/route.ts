import { NextRequest, NextResponse } from "next/server";
import { executeCode } from "@/lib/judge0";
import { languages, SupportedLanguage } from "@/data/languages";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { language, code, stdin } = body as {
      language: string;
      code: string;
      stdin: string;
    };

    if (!language || !code) {
      return NextResponse.json(
        { error: "Missing required fields: language, code" },
        { status: 400 }
      );
    }

    if (!languages[language as SupportedLanguage]) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    const result = await executeCode(
      language as SupportedLanguage,
      code,
      stdin || ""
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Run API error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    // Detect connection failures to Judge0
    const isConnectionError =
      message.includes("ECONNREFUSED") ||
      message.includes("fetch failed") ||
      message.includes("network");

    return NextResponse.json(
      {
        error: isConnectionError
          ? "Unable to connect to the code execution service."
          : message,
      },
      { status: isConnectionError ? 503 : 500 }
    );
  }
}
