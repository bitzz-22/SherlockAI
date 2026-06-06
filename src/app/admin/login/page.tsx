"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button-new";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin123") {
      document.cookie = "admin_access=true; path=/; max-age=86400";
      toast({ title: "Access Granted", description: "Welcome to the Admin Panel.", variant: "success" });
      router.push("/admin/dashboard");
    } else {
      toast({ title: "Access Denied", description: "Incorrect master passcode.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-100 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-2">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Portal</CardTitle>
          <CardDescription className="text-slate-400">
            Enter the master passcode to access the management interface.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-100"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white border-0">
              Authenticate
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
