import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { SparklesIcon } from "@/components/chat/icons";
import { Preview } from "@/components/chat/preview";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-sidebar flex h-dvh w-screen">
      <div className="bg-background xl:border-border/40 flex w-full flex-col p-8 md:p-16 xl:w-[600px] xl:shrink-0 xl:rounded-r-2xl xl:border-r">
        <Link
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-[13px] transition-colors"
          href="/"
        >
          <ArrowLeftIcon className="size-3.5" />
          Zurück
        </Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-10">
          <div className="flex flex-col gap-2">
            <div className="bg-muted/60 text-muted-foreground ring-border/50 mb-2 flex size-9 items-center justify-center rounded-lg ring-1">
              <SparklesIcon size={14} />
            </div>
            {children}
          </div>
        </div>
      </div>

      <div className="hidden flex-1 flex-col overflow-hidden pl-12 xl:flex">
        <div className="text-muted-foreground/50 flex items-center gap-1.5 pt-8 text-[13px]">
          Powered by
          <Link
            className="text-muted-foreground hover:text-foreground font-medium underline underline-offset-2 transition-colors"
            href="https://nexifyai.cloud"
            rel="noopener noreferrer"
            target="_blank"
          >
            NeXifyAI.cloud
          </Link>
        </div>
        <div className="flex-1 pt-4">
          <Preview />
        </div>
      </div>
    </div>
  );
}
