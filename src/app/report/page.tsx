import Link from "next/link";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button-new";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ReportIndexPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-white p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Report an Item</h1>
          <p className="text-muted-foreground text-lg">
            What would you like to report today?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/report/lost" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Search className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">I Lost Something</CardTitle>
                <CardDescription>
                  Report an item you've misplaced on campus so others can help you find it.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  Report Lost Item
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/report/found" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-green-500/50 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">I Found Something</CardTitle>
                <CardDescription>
                  Report an item you've found to help it get returned to its rightful owner.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button variant="outline" className="w-full group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-colors">
                  Report Found Item
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
