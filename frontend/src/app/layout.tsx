import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hanif Sales - Everything You Need, One Trusted Store",
  description: "Premium multi-vendor e-commerce platform. Shop electronics, fashion, shoes, home decor, and more at Hanif Sales.",
  keywords: ["e-commerce", "online shopping", "Hanif Sales", "electronics", "fashion", "shoes"],
  openGraph: {
    title: "Hanif Sales",
    description: "Everything You Need, One Trusted Store",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
