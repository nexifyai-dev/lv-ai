import { notFound } from "next/navigation";
import { projectExists } from "@/lib/db/lv-queries";
import { PreisspiegelClient } from "../../preisspiegel-client";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function PreisspiegelPage({ params }: PageProps) {
  const { projectId } = await params;

  const exists = await projectExists(projectId).catch(() => false);
  if (!exists) {
    notFound();
  }

  return <PreisspiegelClient projectId={projectId} />;
}
