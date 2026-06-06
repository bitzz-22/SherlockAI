import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Tag, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button-new";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Item Details - SherlockAI",
};

export default async function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: item } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) {
    notFound();
  }

  const isLost = item.type === "lost";
  const date = new Date(item.created_at).toLocaleDateString();

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery Column */}
          <div className="space-y-4">
            <div className="aspect-square bg-slate-200 rounded-xl overflow-hidden border">
              {item.image_urls && item.image_urls.length > 0 ? (
                <img src={item.image_urls[0]} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  No Image Available
                </div>
              )}
            </div>
            {item.image_urls && item.image_urls.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.image_urls.slice(1).map((url: string, i: number) => (
                  <div key={i} className="aspect-square bg-slate-200 rounded-lg overflow-hidden border">
                    <img src={url} alt={`gallery-${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs uppercase font-bold tracking-wider ${isLost ? "bg-red-100 text-red-800" : "bg-slate-900 text-white"}`}>
                  {item.type}
                </span>
                {item.status === "active" ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border border-green-500 text-green-700 bg-green-50 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Active
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border border-yellow-500 text-yellow-700 bg-yellow-50 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 inline" /> Pending Match
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{item.title}</h1>
            </div>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{item.description}</p>
                </div>
                
                <div className="pt-4 border-t grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500 flex items-center gap-1"><Tag className="w-4 h-4" /> Category</p>
                    <p className="font-medium text-slate-900 capitalize">{item.category}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-500 flex items-center gap-1"><Calendar className="w-4 h-4" /> Date Reported</p>
                    <p className="font-medium text-slate-900">{date}</p>
                  </div>
                </div>

                {item.location && (
                  <div className="pt-4 border-t space-y-1">
                    <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin className="w-4 h-4" /> Location</p>
                    <p className="font-medium text-slate-900">{item.location}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="pt-4">
              <Button className="w-full py-6 text-lg" disabled>
                {isLost ? "I Found This Item!" : "This Is My Item!"}
              </Button>
              <p className="text-center text-xs text-slate-500 mt-3">
                Claim functionality is handled by Sherlock AI auto-matching.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
