import type { Metadata } from "next";
import InterviewWorkspace from "@/components/interview/InterviewWorkspace";

export const metadata: Metadata = {
  title: "Coding Interview | interview.ai",
  description:
    "AI-native coding interview platform — solve problems with AI-assisted code generation.",
};

export default function InterviewPage() {
  return <InterviewWorkspace />;
}
