"use client";

import { useState } from "react";
import { SupportedLanguage } from "@/data/languages";
import { sampleInput } from "@/data/demoProblem";

interface ExecutionResult {
  status: string;
  stdout: string;
  stderr: string;
  compile_output: string;
  time: string;
  memory: number;
}

interface OutputPanelProps {
  language: SupportedLanguage;
  code: string;
}

export default function OutputPanel({ language, code }: OutputPanelProps) {
  const [stdin, setStdin] = useState(sampleInput);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, stdin }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data: ExecutionResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to execute code"
      );
    } finally {
      setIsRunning(false);
    }
  };

  const isSuccess = result?.status === "Accepted";

  return (
    <div className="flex h-full flex-col bg-[#0d1117] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <h2 className="text-sm font-semibold text-gray-200">
            Execution Output
          </h2>
        </div>
        <button
          onClick={handleRun}
          disabled={isRunning || !code.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          {isRunning ? (
            <>
              <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Running...
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Run Code
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Stdin */}
        <div className="w-1/3 border-r border-gray-800 flex flex-col min-h-0">
          <div className="px-3 py-2 border-b border-gray-800/50 shrink-0">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Input (stdin)
            </span>
          </div>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            className="flex-1 min-h-0 resize-none bg-transparent p-3 font-mono text-xs text-gray-300 outline-none placeholder-gray-700"
            placeholder="Enter input here..."
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-3 py-2 border-b border-gray-800/50 flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Output
            </span>
            {result && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  isSuccess
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-red-500/15 text-red-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSuccess ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
                {result.status}
              </span>
            )}
            {result && (
              <span className="text-[10px] text-gray-600 ml-auto">
                {result.time}s · {(result.memory / 1024).toFixed(1)} MB
              </span>
            )}
          </div>
          <div className="flex-1 min-h-0 overflow-auto p-3 scrollbar-thin">
            {!result && !error && (
              <div className="flex h-full items-center justify-center">
                <p className="text-xs text-gray-600">
                  Click &quot;Run Code&quot; to see output
                </p>
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                <p className="text-xs font-medium text-red-400">Error</p>
                <pre className="mt-1 text-xs text-red-300 font-mono whitespace-pre-wrap">
                  {error}
                </pre>
              </div>
            )}
            {result && (
              <div className="space-y-3">
                {result.stdout && (
                  <div>
                    <span className="text-[10px] font-medium text-gray-500 uppercase">
                      stdout
                    </span>
                    <pre className="mt-1 rounded-lg bg-gray-900/60 border border-gray-800 p-3 font-mono text-xs text-emerald-300 whitespace-pre-wrap">
                      {result.stdout}
                    </pre>
                  </div>
                )}
                {result.stderr && (
                  <div>
                    <span className="text-[10px] font-medium text-red-500 uppercase">
                      stderr
                    </span>
                    <pre className="mt-1 rounded-lg bg-red-950/30 border border-red-500/20 p-3 font-mono text-xs text-red-300 whitespace-pre-wrap">
                      {result.stderr}
                    </pre>
                  </div>
                )}
                {result.compile_output && (
                  <div>
                    <span className="text-[10px] font-medium text-amber-500 uppercase">
                      Compilation Output
                    </span>
                    <pre className="mt-1 rounded-lg bg-amber-950/20 border border-amber-500/20 p-3 font-mono text-xs text-amber-300 whitespace-pre-wrap">
                      {result.compile_output}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
