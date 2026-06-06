"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button-new";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { registerAction } from "@/actions/auth";
import { useToast } from "@/components/ui/toast";

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", university: "", studentId: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.set(k, v));
      const result = await registerAction(formData);
      if ((result as { error?: string }).error) {
        toast({ title: "Registration Failed", description: (result as { error: string }).error, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Check your email to verify your account.", variant: "success" });
        window.location.href = "/verify-email";
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

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
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Join your campus lost and found network</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="John Doe" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">University Email</Label>
                <Input id="email" type="email" placeholder="you@university.edu" value={form.email} onChange={(e) => update("email", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Create a strong password" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={8} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input id="university" placeholder="University name" value={form.university} onChange={(e) => update("university", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" placeholder="Optional" value={form.studentId} onChange={(e) => update("studentId", e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account? <Link href="/auth/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
