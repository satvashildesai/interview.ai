"use client";

import { demoProblem } from "@/data/demoProblem";

export default function ProblemPanel() {
  const p = demoProblem;

  return (
    <div className="h-full overflow-y-auto bg-[#0d1117] p-5 scrollbar-thin">
      {/* Title */}
      <div className="mb-5">
        <span className="inline-block rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-400 uppercase mb-3">
          Problem
        </span>
        <h1 className="text-xl font-bold text-gray-100 leading-tight">
          {p.title}
        </h1>
      </div>

      {/* Description */}
      <section className="mb-5">
        <p className="text-sm leading-relaxed text-gray-400">{p.description}</p>
      </section>

      {/* Requirements */}
      <section className="mb-5">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-2">
          Requirements
        </h2>
        <ul className="space-y-2">
          {p.requirements.map((req, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-gray-400">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-800 text-[10px] font-bold text-gray-500">
                {i + 1}
              </span>
              <span className="leading-relaxed">{req}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Input Format */}
      <section className="mb-5">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-2">
          Input Format
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">{p.inputFormat}</p>
      </section>

      {/* Output Format */}
      <section className="mb-5">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-2">
          Output Format
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">{p.outputFormat}</p>
      </section>

      {/* Example */}
      <section className="mb-5">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
          Example
        </h2>
        <div className="space-y-3">
          <div>
            <span className="mb-1.5 block text-xs font-medium text-gray-500">
              Input
            </span>
            <pre className="rounded-lg border border-gray-800 bg-gray-900/60 p-3 text-xs text-emerald-300 font-mono overflow-x-auto">
              {p.example.input}
            </pre>
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-medium text-gray-500">
              Expected Output
            </span>
            <pre className="rounded-lg border border-gray-800 bg-gray-900/60 p-3 text-xs text-amber-300 font-mono overflow-x-auto">
              {p.example.output}
            </pre>
          </div>
        </div>
      </section>

      {/* Constraints */}
      <section className="mb-5">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-2">
          Constraints
        </h2>
        <ul className="space-y-1.5">
          {p.constraints.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* What to Evaluate */}
      {p.evaluation && (
        <section className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
          <h2 className="text-xs font-semibold text-purple-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-purple-400" />
            What to Evaluate
          </h2>
          <ul className="space-y-1">
            {p.evaluation.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-purple-200/80">
                <span className="text-purple-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
