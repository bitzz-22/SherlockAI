import { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About - CampusTrace",
  description: "About CampusTrace.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Search className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-foreground">
            Campus<span className="text-primary">Trace</span>
          </span>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">About CampusTrace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              CampusTrace is an AI-powered lost and found platform built for universities.
              We help students and staff reunite with their belongings faster through intelligent image and text matching, secure messaging, and a verified campus network.
            </p>
            <p>
              Our mission is to reduce the stress of losing items on campus and build a more connected, caring university community.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
