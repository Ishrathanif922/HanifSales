"use client";

import React from "react";
import { AppProvider } from "@/store/AppContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "12px", padding: "12px 16px" },
          success: { iconTheme: { primary: "#2563eb", secondary: "#fff" } },
        }}
      />
    </AppProvider>
  );
}
