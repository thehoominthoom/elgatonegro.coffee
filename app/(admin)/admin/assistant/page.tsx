import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AIChat from "@/components/admin/AIChat";

export const metadata = {
  title: "Assistant — El Gato Negro Admin",
};

export default function AssistantPage() {
  return (
    <div className="h-screen flex flex-col bg-brand-black">
      {/* Header */}
      <header className="border-b border-brand-grey/10 shrink-0">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="text-brand-grey/40 hover:text-brand-grey transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-sans font-extrabold text-sm uppercase tracking-[0.1em] text-brand-grey">
            Assistant
          </h1>
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-grey/30">
            Shopify AI
          </span>
        </div>
      </header>

      {/* Chat fills remaining height */}
      <div className="flex-1 max-w-5xl mx-auto w-full overflow-hidden">
        <AIChat />
      </div>
    </div>
  );
}
