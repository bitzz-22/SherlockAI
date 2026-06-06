import { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About - SherlockAI",
  description: "About SherlockAI.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link href="/" className="flex items-center gap-2 mb-12">
          <Search className="w-8 h-8 text-primary" />
          <span className="text-3xl font-bold text-foreground">
            Sherlock<span className="text-primary">AI</span>
          </span>
        </Link>
        
        <div className="space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Revolutionizing Campus <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">
                Lost and Found
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              SherlockAI is a next-generation platform built exclusively for university communities. We leverage advanced artificial intelligence to drastically cut down the time it takes to reunite students and staff with their missing belongings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-8">
            {/* Mission Card */}
            <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 space-y-4 leading-relaxed">
                <p>
                  Losing something important on campus—whether it's a student ID, a laptop charger, or a pair of headphones—can be incredibly stressful. Traditional lost-and-found bins are disorganized, and campus-wide email chains are inefficient.
                </p>
                <p>
                  Our mission is simple: to eliminate the anxiety of losing your essentials, protect student privacy, and foster a more connected, caring university community through smart technology.
                </p>
              </CardContent>
            </Card>

            {/* Technology Card */}
            <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-violet-600">The Technology</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 space-y-4 leading-relaxed">
                <p>
                  Instead of forcing users to manually scroll through endless bulletin boards, our intelligent backend system does the heavy lifting. We utilize state-of-the-art vision models and natural language processing to understand what an item is.
                </p>
                <p>
                  When a "Found" item is uploaded, the AI forensically compares it against all active "Lost" reports. It generates a sophisticated Match Score based on visual similarity, location proximity, and descriptive keywords.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Security Section */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white mt-12 overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">Safe, Secure, and Moderated</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                We believe that a campus tool should be a safe space. That's why SherlockAI incorporates a strict administrative layer. When the AI detects a high-probability match, it doesn't just blindly connect users. It instantly flags the match for campus administrators to manually verify. This ensures a secure, spam-free environment and prevents fraudulent claims.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
