import { languages, SupportedLanguage } from "@/data/languages";

const JUDGE0_URL =
  process.env.JUDGE0_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "";
const JUDGE0_HOST =
  process.env.JUDGE0_HOST || "judge0-ce.p.rapidapi.com";

export interface Judge0Result {
  status: string;
  stdout: string;
  stderr: string;
  compile_output: string;
  time: string;
  memory: number;
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

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Only add RapidAPI headers if using RapidAPI-hosted Judge0
  if (JUDGE0_API_KEY) {
    headers["X-RapidAPI-Key"] = JUDGE0_API_KEY;
    headers["X-RapidAPI-Host"] = JUDGE0_HOST;
  }

  // Submit the code
  const submitRes = await fetch(
    `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        language_id: langConfig.judge0Id,
        source_code: Buffer.from(code).toString("base64"),
        stdin: Buffer.from(stdin).toString("base64"),
        cpu_time_limit: 5,
        memory_limit: 128000,
      }),
    }
  );

  if (!submitRes.ok) {
    const errorText = await submitRes.text();
    throw new Error(`Judge0 submission failed: ${submitRes.status} ${errorText}`);
  }

  const result = await submitRes.json();

  const decode = (val: string | null) =>
    val ? Buffer.from(val, "base64").toString("utf-8") : "";

  // Map Judge0 status to a user-friendly string
  const statusMap: Record<number, string> = {
    1: "In Queue",
    2: "Processing",
    3: "Accepted",
    4: "Wrong Answer",
    5: "Time Limit Exceeded",
    6: "Compilation Error",
    7: "Runtime Error (SIGSEGV)",
    8: "Runtime Error (SIGXFSZ)",
    9: "Runtime Error (SIGFPE)",
    10: "Runtime Error (SIGABRT)",
    11: "Runtime Error (NZEC)",
    12: "Runtime Error (Other)",
    13: "Internal Error",
    14: "Exec Format Error",
  };

  return {
    status: statusMap[result.status?.id] || result.status?.description || "Unknown",
    stdout: decode(result.stdout),
    stderr: decode(result.stderr),
    compile_output: decode(result.compile_output),
    time: result.time || "0",
    memory: result.memory || 0,
  };
}
