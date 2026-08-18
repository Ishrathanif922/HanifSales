"use client";

import React from "react";
import { Briefcase, Heart, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Careers at Hanif Sales</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Join our passionate team and help shape the future of e-commerce in Pakistan. We are always looking for talented individuals.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Sparkles, title: "Innovation", desc: "Work with cutting-edge technologies and modern web stacks." },
          { icon: Heart, title: "Great Culture", desc: "Inclusive, collaborative, and growth-oriented environment." },
          { icon: Briefcase, title: "Growth", desc: "Accelerate your career with mentorship and real impact." },
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm text-center">
            <div className="inline-flex p-3 rounded-xl bg-primary-500/10 text-primary-500 mb-4">
              <item.icon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-3xl p-8 border border-primary-500/20 text-center">
        <h2 className="text-2xl font-bold mb-3">Open Positions</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto">
          We currently don&apos;t have any active job openings, but we are always eager to meet talented professionals. Send your resume to our HR team!
        </p>
        <Link href="/contact">
          <Button className="rounded-xl px-8 py-6 font-semibold">
            <Send className="h-4 w-4 mr-2" /> Contact HR / Send Resume
          </Button>
        </Link>
      </div>
    </div>
  );
}
