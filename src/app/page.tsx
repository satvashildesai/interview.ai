"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/interview");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#010409]">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        <span className="text-sm text-gray-500">Loading interview...</span>
      </div>
    </div>
  );
}
