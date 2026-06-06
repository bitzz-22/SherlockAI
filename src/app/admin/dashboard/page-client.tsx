"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

export function AdminDashboardClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const { toast } = useToast();

  const handleLogout = () => {
    document.cookie = "admin_access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/auth/login";
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/approve/${id}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to approve");
      setItems((prev) => prev.map((item) => item.id === id ? { ...item, status: 'active' } : item));
      toast({ title: "Match Approved", description: "The item has been successfully activated.", variant: "success" });
    } catch (err) {
      toast({ title: "Error", description: "Could not approve item.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this item? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/delete/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Item deleted", description: "The item has been removed from the database.", variant: "success" });
    } catch (err) {
      toast({ title: "Error", description: "Could not delete item.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Control Panel</h1>
              <p className="text-sm text-slate-500">Manage and moderate all system reports</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline">Back to Site</Button>
            </Link>
            <Button variant="destructive" onClick={handleLogout}>Exit Admin</Button>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>All Reported Items ({items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No items in the database.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3">Image</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">AI Score</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 rounded overflow-hidden bg-slate-100 border flex items-center justify-center">
                            {item.image_urls && item.image_urls.length > 0 ? (
                              <img src={item.image_urls[0]} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <ShieldAlert className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">{item.title}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-700">
                          {item.ai_score !== undefined && item.ai_score > 0 ? `${item.ai_score}%` : '-'}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{item.location || 'N/A'}</td>
                        <td className="px-4 py-3 text-slate-500">
                          {new Date(item.created_at).toISOString().split('T')[0]}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {item.status === 'pending' && (
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 mr-2" onClick={() => handleApprove(item.id)}>
                              <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
