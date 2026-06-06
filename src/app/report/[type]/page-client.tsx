"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, MapPin, Upload, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button-new";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { createItemAction } from "@/actions/item/create";
import { useToast } from "@/components/ui/toast";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/map-picker").then((mod) => mod.MapPicker), { ssr: false });

interface PageClientProps {
  type: "lost" | "found";
}

export function ReportPageClient({ type }: PageClientProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!fileArray.length) return;
    
    const readers = fileArray.slice(0, 4).map((file) =>
      new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      })
    );
    Promise.all(readers).then((urls) => {
      setImages((prev) => [...prev, ...urls].slice(0, 4));
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("type", type);
    formData.set("imageUrls", JSON.stringify(images));
    setLoading(true);
    try {
      const result = await createItemAction(formData);
      if ((result as { error?: string }).error) {
        toast({ title: "Submission failed", description: (result as { error: string }).error, variant: "destructive" });
      } else {
        toast({ title: "Item reported", description: "We're looking for matches now.", variant: "success" });
        window.location.href = "/dashboard";
      }
    } catch {
      toast({ title: "Error", description: "Could not submit report", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 to-white py-10">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <Search className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">
              Sherlock<span className="text-primary">AI</span>
            </span>
          </Link>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Report {type === "lost" ? "Lost" : "Found"} Item</CardTitle>
              <CardDescription>Provide details to help us find the right match.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" placeholder="e.g. Blue AirPods Pro case" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea id="description" name="description" className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Brand, color, size, distinguishing features..." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="electronics">Electronics</option>
                    <option value="accessories">Accessories</option>
                    <option value="clothing">Clothing</option>
                    <option value="bags">Bags</option>
                    <option value="keys">Keys</option>
                    <option value="documents">Documents</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <MapPicker />
                </div>
                <div className="space-y-2">
                  <Label>Photos</Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragging ? "border-primary bg-primary/5" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleFiles(e.dataTransfer.files);
                      }
                    }}
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">Drag & drop images here</p>
                    <p className="text-xs text-slate-500 mt-1">or click to browse from your computer (max 4)</p>
                    <input 
                      id="file-upload" 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={(e) => e.target.files && handleFiles(e.target.files)} 
                    />
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-3">
                      {images.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-lg border overflow-hidden bg-muted">
                          <img src={url} alt={`upload-${i}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={(e) => { e.stopPropagation(); setImages((p) => p.filter((_, idx) => idx !== i)); }} className="absolute top-1 right-1 bg-background/80 rounded-full p-1 shadow-sm hover:bg-white transition-colors">
                            <X className="w-4 h-4 text-slate-700" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Submitting..." : `Submit ${type === "lost" ? "Lost" : "Found"} Item`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
