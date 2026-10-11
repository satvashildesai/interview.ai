import { languages, SupportedLanguage } from "@/data/languages";

const JUDGE0_URL =
  process.env.JUDGE0_URL || "http://localhost:2358";

export interface Judge0Result {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string | null;
  memory: number | null;
}

export async function executeCode(
  language: SupportedLanguage,
  code: string,
  stdin: string
): Promise<Judge0Result> {
  const langConfig = languages[language];
  if (!langConfig) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const response = await fetch(
    `${JUDGE0_URL}/submissions?wait=true&base64_encoded=true`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language_id: langConfig.judge0Id,
        source_code: Buffer.from(code).toString("base64"),
        stdin: Buffer.from(stdin).toString("base64"),
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Judge0 submission failed: ${response.status} ${errorText}`
    );
  }

  const result = await response.json();

  const decode = (val: string | null | undefined): string | null =>
    val ? Buffer.from(val, "base64").toString("utf-8") : null;

  return {
    stdout: decode(result.stdout),
    stderr: decode(result.stderr),
    compile_output: decode(result.compile_output),
    status: {
      id: result.status?.id ?? 0,
      description: result.status?.description ?? "Unknown",
    },
    time: result.time ?? null,
    memory: result.memory ?? null,
  };
}
