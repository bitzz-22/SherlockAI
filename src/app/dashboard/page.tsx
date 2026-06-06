import { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button-new";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard - SherlockAI",
  description: "Your SherlockAI dashboard.",
};

async function getDashboardItems() {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!base || !key) {
    return [];
  }

  let items: { id: string; type: string; title: string; status: string }[] = [];
  try {
    const res = await fetch(`${base}/rest/v1/items?select=id,type,title,status&order=created_at.desc&limit=20`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    items = await res.json();
  } catch {
    items = [];
  }

  return items;
}

export default async function DashboardPage() {
  const items = await getDashboardItems();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-2">
              <Search className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground">
                Sherlock<span className="text-primary">AI</span>
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mt-4">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your reports and match requests.</p>
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

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{items.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {items.filter((i) => i.status === "active").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">0</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Items</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-muted-foreground">No items yet. Report your first item now.</p>
            ) : (
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={item.id ?? idx} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-foreground">{item.title ?? "Untitled"}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {item.type} &middot; {item.status}
                      </p>
                    </div>
                    <Link href={`/items/${item.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
