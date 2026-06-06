"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Shield,
  MessageSquare,
  MapPin,
  Bell,
  Zap,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button-new";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Find what&apos;s lost,{" "}
                <span className="text-primary">return what&apos;s found</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Sherlock AI uses AI to make recovering lost items on campus simple,
                fast, and secure. Connect with your university network today.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button variant="outline" size="lg">
                    Browse Items
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Verified Campus Network</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>AI-Powered Matching</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">AI Found a Match!</h3>
                    <p className="text-sm text-muted-foreground">92% match confidence</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground">Lost: Blue AirPods Pro Case</p>
                    <p className="text-xs text-muted-foreground">Library, 2nd Floor</p>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground">Found: AirPods Pro (Blue)</p>
                    <p className="text-xs text-muted-foreground">Cafeteria</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Features designed for campus communities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to report, search, and recover lost items on campus.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "AI-Powered Matching",
                description:
                  "Our AI analyzes images and descriptions to find the best matches for your lost item.",
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Secure Chat",
                description:
                  "Connect securely with finders through our encrypted messaging system.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Verified Users",
                description:
                  "University email verification ensures a trusted community network.",
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Location Maps",
                description:
                  "Pin exactly where items were lost or found with interactive maps.",
              },
              {
                icon: <Bell className="w-8 h-8" />,
                title: "Smart Notifications",
                description:
                  "Get instant alerts when potential matches are found for your items.",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community Driven",
                description:
                  "Built by students, for students. Help your campus community thrive.",
              },
              {
                icon: <Search className="w-8 h-8" />,
                title: "Smart Search",
                description:
                  "Search by category, location, date, or use AI to find similar items.",
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Easy Resolution",
                description:
                  "Mark items as resolved and track the return process seamlessly.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Get started in minutes and reunite with your belongings.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Report",
                description:
                  "Submit a lost or found item with photos and location details.",
              },
              {
                step: "2",
                title: "Match",
                description:
                  "Our AI engine automatically finds potential matches across campus.",
              },
              {
                step: "3",
                title: "Connect",
                description:
                  "Chat securely with matches and arrange to return the item.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to find what you&apos;ve lost?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students already using Sherlock AI to recover their
              belongings.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
