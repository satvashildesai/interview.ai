import { GoogleGenAI } from "@google/genai";
import { demoProblem } from "@/data/demoProblem";
import { languages, SupportedLanguage } from "@/data/languages";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
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
${p.constraints.map((c) => `- ${c}`).join("\n")}${
    p.evaluation
      ? `\n\n### What to Evaluate\n${p.evaluation.map((e) => `- ${e}`).join("\n")}`
      : ""
  }`;
}

const SYSTEM_PROMPT = `You are a coding assistant in a technical interview environment.

Your role:
- Help the candidate write code to solve the given problem.
- When generating code, always wrap it in a fenced code block with the appropriate language tag.
- Respond concisely. Focus on the solution and explain only what's necessary.
- Do NOT execute code. Do NOT modify the editor directly. The candidate will apply your code themselves.
- If the candidate provides an error message, help them debug it.

${buildProblemContext()}`;

export interface AiRequest {
  prompt: string;
  language: SupportedLanguage;
  currentCode?: string;
  conversationHistory?: { role: "user" | "assistant"; content: string }[];
}

export async function generateAiResponse(req: AiRequest): Promise<string> {
  const langConfig = languages[req.language];

  let userMessage = req.prompt;
  userMessage += `\n\nSelected language: ${langConfig.label}`;

  if (req.currentCode && req.currentCode.trim() !== langConfig.template.trim()) {
    userMessage += `\n\nCurrent code in editor:\n\`\`\`${langConfig.monacoLanguage}\n${req.currentCode}\n\`\`\``;
  }

  const contents: { role: "user" | "model"; parts: { text: string }[] }[] = [];

  // Add conversation history
  if (req.conversationHistory) {
    for (const msg of req.conversationHistory) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    }
  }

  // Add current user message
  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.3,
      maxOutputTokens: 4096,
    },
  });

  return response.text || "Sorry, I couldn't generate a response. Please try again.";
}
