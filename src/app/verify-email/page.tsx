"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button-new";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
  const search = useSearchParams();
  const email = search.get("email") || "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <MailCheck className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We sent a verification link to {email || "your email address"}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Click the link in that email to verify your account and access the full CampusTrace experience.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
