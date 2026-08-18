"use client";

import React, { useEffect, useState } from "react";
import { Headphones, Loader2, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ticketAPI } from "@/services";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTickets();
  }, [page]);

  const fetchTickets = () => {
    setLoading(true);
    ticketAPI.getAllTickets({ page: String(page), limit: "20" })
      .then(({ data }) => {
        setTickets(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleReply = async (ticketId: string) => {
    if (!replyText.trim()) return;
    setReplying(true);
    try {
      await ticketAPI.replyToTicket(ticketId, replyText);
      setReplyText("");
      toast.success("Reply sent");
      fetchTickets();
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setReplying(false);
    }
  };

  const handleStatusChange = async (ticketId: string, status: string) => {
    try {
      await ticketAPI.updateTicketStatus(ticketId, status);
      setTickets((prev) => prev.map((t) => t._id === ticketId ? { ...t, status } : t));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <p className="text-sm text-gray-500">Manage customer support requests</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Headphones className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-bold mb-2">No Tickets</h3>
            <p className="text-gray-500">No support tickets yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket._id}>
              <CardContent className="p-5">
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === ticket._id ? null : ticket._id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{ticket.subject}</h3>
                      <Badge className={`text-[10px] ${statusColors[ticket.status] || ""}`}>{ticket.status}</Badge>
                      <Badge className={`text-[10px] ${priorityColors[ticket.priority] || ""}`}>{ticket.priority}</Badge>
                    </div>
                    <p className="text-xs text-gray-500">{ticket.user?.name || "Unknown"} · {formatDate(ticket.createdAt)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{ticket.message}</p>
                  </div>
                  {expandedId === ticket._id ? <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" /> : <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />}
                </div>

                {expandedId === ticket._id && (
                  <div className="mt-4 pt-4 border-t dark:border-dark-border space-y-3">
                    {ticket.replies?.length > 0 && (
                      <div className="space-y-2">
                        {ticket.replies.map((reply: any, i: number) => (
                          <div key={i} className={`p-3 rounded-lg text-sm ${reply.user === ticket.user?._id ? "bg-gray-50 dark:bg-dark-bg" : "bg-primary-50 dark:bg-primary-900/10 ml-4"}`}>
                            <p className="text-xs text-gray-500 mb-1">{formatDate(reply.createdAt)}</p>
                            <p>{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(ticket._id); } }}
                      />
                      <Button size="sm" onClick={() => handleReply(ticket._id)} disabled={replying || !replyText.trim()}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      {["open", "in_progress", "resolved", "closed"].map((status) => (
                        <Button
                          key={status}
                          variant={ticket.status === status ? "default" : "outline"}
                          size="sm"
                          className="text-xs capitalize"
                          onClick={() => handleStatusChange(ticket._id, status)}
                        >
                          {status.replace("_", " ")}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="py-2 px-4 text-sm text-gray-500">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
