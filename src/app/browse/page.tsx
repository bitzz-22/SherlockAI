import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button-new";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Browse Items - CampusTrace",
  description: "Browse lost and found items on campus.",
};

async function getItems() {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!base || !key) {
    return [];
  }

  let items: { id: string; type: string; title: string; category: string; location: string | null; created_at: string }[] = [];
  try {
    const res = await fetch(`${base}/rest/v1/items?select=id,type,title,category,location,created_at&status=eq.active&order=created_at.desc&limit=20`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    items = await res.json();
  } catch {
    items = [];
  }
  return items;
}

export default async function BrowsePage() {
  const items = await getItems();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-2">
              <Search className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground">
                Campus<span className="text-primary">Trace</span>
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mt-4">Browse Items</h1>
            <p className="text-muted-foreground mt-1">Find your lost item or help return something.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/report/lost">
              <Button>Report Lost</Button>
            </Link>
            <Link href="/report/found">
              <Button variant="outline">Report Found</Button>
            </Link>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search items..." className="pl-10" />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {items.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No items yet. Check back soon or report a lost item.
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(items as { id: string; type: string; title: string; category: string; location: string | null; created_at: string }[]).map((item, idx) => (
              <Card key={item.id ?? idx} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.type === "lost"
                          ? "bg-red-50 text-red-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {item.type === "lost" ? "Lost" : "Found"}
                    </span>
                    <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <CardTitle className="text-lg">{item.title ?? "Untitled"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Category: {item.category ?? "Uncategorized"}</p>
                    {item.location ? <p>Location: {item.location}</p> : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
