"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button-new";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { loginAction } from "@/actions/auth";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      const result = await loginAction(formData);
      if ((result as { error?: string }).error) {
        toast({ title: "Login Failed", description: (result as { error: string }).error, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Logged in successfully", variant: "success" });
        window.location.href = "/dashboard";
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const msg = searchParams.get("message");
    if (msg) toast({ title: msg, variant: "success" });
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <Link href="/" className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
            </Link>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your Sherlock AI account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">University Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="your.email@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
<p className="text-sm text-muted-foreground">
  Don&apos;t have an account? <Link href="/register" className="text-primary hover:underline">Sign up</Link>
</p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
