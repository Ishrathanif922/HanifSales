"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import api from "@/services/api";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/tickets", {
        subject: form.subject,
        message: `[Contact Form] From: ${form.name} (${form.email})\n\n${form.message}`,
      });
      setSent(true);
      toast.success("Message sent! We'll get back to you soon.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-gray-500 mt-2">We&apos;d love to hear from you. Get in touch with us.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-6">
          {[
            { icon: Phone, label: "EasyPaisa", value: "03415992753", desc: "Mobile Account" },
            { icon: Phone, label: "JazzCash", value: "0327119273", desc: "Mobile Account" },
            { icon: Mail, label: "Email", value: "haneefullah922@gmail.com", desc: "We reply within 24 hours" },
            { icon: MapPin, label: "Address", value: "Karachi, Pakistan", desc: "Head Office" },
          ].map((item, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <item.icon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.value}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                  <p className="text-gray-500 mb-6">Thank you for contacting us. We&apos;ll get back to you within 24 hours.</p>
                  <Button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>Send Another Message</Button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold mb-4">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Your Name</Label>
                        <Input className="mt-1" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" className="mt-1" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                      </div>
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input className="mt-1" placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Message</Label>
                      <textarea className="mt-1 w-full h-32 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-3 py-2 text-sm" placeholder="Your message..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                    </div>
                    <Button type="submit" disabled={loading} className="gap-2">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
