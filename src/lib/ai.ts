import Groq from "groq-sdk";
import { demoProblem } from "@/data/demoProblem";
import { languages, SupportedLanguage } from "@/data/languages";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

function buildProblemContext(): string {
  const p = demoProblem;
  return `## Problem: ${p.title}

### Description
${p.description}

### Requirements
${p.requirements.map((r, i) => `${i + 1}. ${r}`).join("\n")}

### Input Format
${p.inputFormat}

### Output Format
${p.outputFormat}

### Example
Input:
\`\`\`
${p.example.input}
\`\`\`

Expected Output:
\`\`\`
${p.example.output}
\`\`\`

### Constraints
${p.constraints.map((c) => `- ${c}`).join("\n")}`;
}

const SYSTEM_PROMPT = `You are an AI coding interview assistant.

The candidate is solving the following programming problem:

${buildProblemContext()}

Your instructions:
- Help the candidate solve the problem.
- Do NOT execute code.
- Provide structured JSON output ONLY.
- If the candidate asks to generate or fix code, return JSON with "type": "code", a "message" explaining, and the "code".
- CRITICAL: When returning "code", you MUST return the COMPLETE, FULLY RUNNABLE file. Do NOT return just a function snippet. You must preserve and include all necessary imports, class definitions (e.g., \`class Main\` in Java), and boilerplate that are currently in the editor.
- If the candidate asks for an explanation ONLY (no code generation needed), return JSON with "type": "explanation" and a "message".

Example Code Response:
{
  "type": "code",
  "message": "Here is the complete solution.",
  "code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Complete runnable code here\n    }\n}"
}

Example Explanation Response:
{
  "type": "explanation",
  "message": "The issue is a division by zero."
}`;

export interface AiRequest {
  prompt: string;
  language: SupportedLanguage;
  currentCode?: string;
  conversationHistory?: { role: "user" | "assistant"; content: string }[];
}

export async function generateAiResponse(req: AiRequest): Promise<any> {
  const langConfig = languages[req.language];

  let userMessage = req.prompt;
  userMessage += `\n\nSelected language: ${langConfig.label}`;

  if (req.currentCode) {
    userMessage += `\n\nCurrent code in editor:\n\`\`\`${langConfig.monacoLanguage}\n${req.currentCode}\n\`\`\``;
  }

  const messages: any[] = [
    { role: "system", content: SYSTEM_PROMPT }
  ];

  if (req.conversationHistory) {
    for (const msg of req.conversationHistory) {
      // Pass only text content to history so context is clean
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      });
    }
  }

  messages.push({
    role: "user",
    content: userMessage,
  });

  const model = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

  try {
    const completion = await groq.chat.completions.create({
      messages,
      model,
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content || "";
    return JSON.parse(responseContent);
  } catch (error) {
    console.error("Groq generation error:", error);
    return {
      type: "explanation",
      message: "Unable to connect to AI service. Please try again."
    };
  }
}
