"use client";

import { useState } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import { SupportedLanguage, languages } from "@/data/languages";
import ProblemPanel from "./ProblemPanel";
import ChatPanel from "./ChatPanel";
import CodeEditor from "./CodeEditor";
import OutputPanel from "./OutputPanel";

export default function InterviewWorkspace() {
  const [language, setLanguage] = useState<SupportedLanguage>("python");
  const [code, setCode] = useState(languages.python.template);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    setCode(languages[newLang].template);
  };

  const handleApplyCode = (newCode: string) => {
    setCode(newCode);
  };

  return (
    <div className="flex h-screen flex-col bg-[#010409]">
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b border-gray-800 px-5 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/20">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-100 tracking-tight">
              interview.ai
            </h1>
            <p className="text-[10px] text-gray-600">Coding Interview</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            In Progress
          </span>
        </div>
      </header>

      {/* Main Content */}
      <Group orientation="vertical" className="flex-1 min-h-0">
        {/* Top Panels */}
        <Panel defaultSize={65} minSize={30}>
          <Group orientation="horizontal" className="h-full">
            {/* Problem Panel */}
            <Panel defaultSize={28} minSize={15}>
              <ProblemPanel />
            </Panel>

            <Separator className="w-px bg-gray-800 hover:bg-violet-500/50 transition-colors data-[state=dragging]:bg-violet-500" />

            {/* Chat Panel */}
            <Panel defaultSize={35} minSize={20}>
              <ChatPanel
                language={language}
                currentCode={code}
                onApplyCode={handleApplyCode}
              />
            </Panel>

            <Separator className="w-px bg-gray-800 hover:bg-violet-500/50 transition-colors data-[state=dragging]:bg-violet-500" />

            {/* Code Editor */}
            <Panel defaultSize={37} minSize={20}>
              <CodeEditor
                language={language}
                code={code}
                onLanguageChange={handleLanguageChange}
                onCodeChange={setCode}
              />
            </Panel>
          </Group>
        </Panel>

        <Separator className="h-px bg-gray-800 hover:bg-violet-500/50 transition-colors data-[state=dragging]:bg-violet-500" />

        {/* Output Panel */}
        <Panel defaultSize={35} minSize={15}>
          <OutputPanel language={language} code={code} />
        </Panel>
      </Group>
    </div>
  );
}
