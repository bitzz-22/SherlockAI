import Link from "next/link";
import { Search, GitBranch, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Sherlock<span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              AI-powered lost and found platform designed for university communities.
              Find lost items quickly and return what&apos;s been found.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse" className="text-sm text-muted-foreground hover:text-primary">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-sm text-muted-foreground hover:text-primary">
                  Report Lost/Found
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-primary">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>support@sherlock-ai.site</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <GitBranch className="w-4 h-4" />
                <a href="https://github.com" className="hover:text-primary">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p> 2026 Sherlock AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
