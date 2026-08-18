import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold gradient-text mb-4">404</p>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/"><Button className="rounded-xl px-8">Go Home</Button></Link>
          <Link href="/products"><Button variant="outline" className="rounded-xl px-8">Browse Products</Button></Link>
        </div>
      </div>
    </div>
  );
}
