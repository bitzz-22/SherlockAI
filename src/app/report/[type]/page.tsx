import { ReportPageClient } from "./page-client";

export const metadata = {
  title: "Report Item - SherlockAI",
  description: "Report a lost or found item on campus",
};

export default async function ReportPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const validType = type === "lost" || type === "found" ? type : "lost";

  return <ReportPageClient type={validType} />;
}
