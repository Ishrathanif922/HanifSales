"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Plus, ChevronRight, Loader2, Send, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/store/AppContext";
import { ticketAPI } from "@/services";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const statusColors: Record<string, string> = {
  open: "bg-green-100 text-green-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-blue-100 text-blue-700",
  closed: "bg-gray-100 text-gray-500",
};

export default function TicketsPage() {
  const { state } = useApp();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    setLoading(true);
    ticketAPI.getMyTickets({ limit: "50" })
      .then(({ data }) => setTickets(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    setFormLoading(true);
    try {
      await ticketAPI.create({
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
        priority: formData.get("priority") as string,
      });
      toast.success("Ticket created!");
      setShowForm(false);
      form.reset();
      fetchTickets();
    } catch { toast.error("Failed to create ticket"); } finally { setFormLoading(false); }
  };

  const handleReply = async (ticketId: string) => {
    if (!replyText.trim()) return;
    setReplyLoading(true);
    try {
      await ticketAPI.replyToTicket(ticketId, replyText);
      setReplyText("");
      const { data } = await ticketAPI.getTicketById(ticketId);
      setSelectedTicket(data.data);
      toast.success("Reply sent");
    } catch { toast.error("Failed to send reply"); } finally { setReplyLoading(false); }
  };

  if (!state.user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Please Login</h2>
        <Link href="/auth/login"><Button>Sign In</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/account" className="hover:text-primary-600">Account</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 dark:text-gray-100">Support Tickets</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? <XCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "New Ticket"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="font-bold mb-4">Create Support Ticket</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Subject *</Label>
                  <Input name="subject" required placeholder="Brief description of your issue" className="mt-1" />
                </div>
                <div>
                  <Label>Priority</Label>
                  <select name="priority" className="mt-1 w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-3 py-2 text-sm">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Message *</Label>
                <textarea name="message" required rows={4} placeholder="Describe your issue in detail..." className="mt-1 w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-3 py-2 text-sm" />
              </div>
              <Button type="submit" disabled={formLoading} className="gap-2">
                {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary-500" /></div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="h-10 w-10 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No tickets yet</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <button
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all",
                  selectedTicket?._id === ticket._id
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                    : "border-gray-100 dark:border-dark-border hover:border-gray-200"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm truncate flex-1">{ticket.subject}</p>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", statusColors[ticket.status])}>{ticket.status}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{ticket.message}</p>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                  <Clock className="h-2.5 w-2.5" /> {new Date(ticket.createdAt).toLocaleDateString()}
                  {ticket.replies?.length > 0 && <span className="ml-auto">{ticket.replies.length} replies</span>}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedTicket ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">{selectedTicket.subject}</h2>
                  <span className={cn("text-xs px-3 py-1 rounded-full font-medium", statusColors[selectedTicket.status])}>{selectedTicket.status}</span>
                </div>

                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-primary-600">{state.user?.name?.charAt(0) || "U"}</span>
                        </div>
                        <span className="text-sm font-medium">You</span>
                      <span className="text-[10px] text-gray-400">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">{selectedTicket.message}</p>
                  </div>

                  {selectedTicket.replies?.map((reply: any, i: number) => (
                    <div key={i} className={cn("rounded-xl p-4", reply.user?._id === state.user?._id ? "bg-primary-50 dark:bg-primary-500/10 ml-8" : "bg-gray-50 dark:bg-dark-bg mr-8")}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">{reply.user?.name || "Support"}</span>
                        <span className="text-[10px] text-gray-400">{new Date(reply.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">{reply.message}</p>
                    </div>
                  ))}
                </div>

                {selectedTicket.status !== "closed" && selectedTicket.status !== "resolved" && (
                  <div className="flex gap-2">
                    <Input
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(selectedTicket._id); } }}
                    />
                    <Button onClick={() => handleReply(selectedTicket._id)} disabled={replyLoading || !replyText.trim()} className="gap-1">
                      {replyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Select a ticket to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
