"use client";

import dynamic from "next/dynamic";
import { SupportedLanguage, languages, languageList } from "@/data/languages";

// Monaco must be loaded client-side only
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface CodeEditorProps {
  language: SupportedLanguage;
  code: string;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onCodeChange: (code: string) => void;
}

export default function CodeEditor({
  language,
  code,
  onLanguageChange,
  onCodeChange,
}: CodeEditorProps) {
  const langConfig = languages[language];

  return (
    <div className="flex h-full flex-col bg-[#0d1117]">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
        <div className="flex items-center gap-3">
          <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
          <span className="text-sm font-semibold text-gray-200">Editor</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">Language:</label>
          <select
            value={language}
            onChange={(e) =>
              onLanguageChange(e.target.value as SupportedLanguage)
            }
            className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
          >
            {languageList.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={langConfig.monacoLanguage}
          value={code}
          onChange={(val) => onCodeChange(val || "")}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'Geist Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            lineNumbersMinChars: 3,
            renderLineHighlight: "line",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
