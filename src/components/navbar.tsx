"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setScrolled(window.scrollY > 20);
    });
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse" },
    { href: "/about", label: "About" },
    { href: "/report", label: "Report Item" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Campus<span className="text-primary">Trace</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Link href="/login">
              <Button variant="default">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">Get Started</Button>
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="default" className="w-full">Sign In</Button>
                </Link>
                <Link href="/register" className="block">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
