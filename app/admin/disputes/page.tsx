"use client";
import { useState, useEffect } from "react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/Toast";
import { MOCK_DISPUTES } from "@/lib/mock-data";
import type { AdminDispute, DisputeStatus } from "@/lib/types";

const delay = () => new Promise((r) => setTimeout(r, 800));

const reasonLabels: Record<string, string> = {
  item_not_received: "Item Not Received",
  item_damaged: "Item Damaged",
  item_not_as_described: "Not as Described",
};

function DisputeCard({ dispute, onAction }: { dispute: AdminDispute; onAction: (d: AdminDispute) => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <img src={dispute.listingImage} alt={dispute.listingTitle} className="w-12 h-12 rounded-xl object-cover shrink-0" />
          <div>
            <p className="font-semibold text-slate-800">{dispute.listingTitle}</p>
            <p className="text-xs text-slate-400">Order #{dispute.orderId} · {reasonLabels[dispute.reason]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${dispute.status === "open" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
            {dispute.status === "open" ? "Open" : "Resolved"}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dispute.paymentMethod === "gcash" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
            {dispute.paymentMethod === "gcash" ? "GCash" : "COD"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div><p className="text-xs text-slate-400">Buyer</p><p className="font-medium text-slate-700">{dispute.buyerName}</p></div>
        <div><p className="text-xs text-slate-400">Seller</p><p className="font-medium text-slate-700">{dispute.sellerName}</p></div>
        <div><p className="text-xs text-slate-400">Amount</p><p className="font-semibold text-violet-600">₱{dispute.total}</p></div>
        <div><p className="text-xs text-slate-400">Submitted</p><p className="text-slate-600">{new Date(dispute.submittedAt).toLocaleDateString()}</p></div>
      </div>

      <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-3">{dispute.description}</p>

      <button onClick={() => setExpanded((e) => !e)} className="text-xs text-violet-600 hover:text-violet-500 font-medium">
        {expanded ? "Hide messages ▲" : `Show messages (${dispute.messages.length}) ▼`}
      </button>

      {expanded && (
        <div className="space-y-2">
          {dispute.messages.map((m, i) => (
            <div key={i} className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-slate-500 mb-1">{m.senderName} · {new Date(m.sentAt).toLocaleString()}</p>
              <p className="text-sm text-slate-700">{m.content}</p>
            </div>
          ))}
        </div>
      )}

      {dispute.status === "resolved" && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm">
          <p className="font-semibold text-emerald-700 capitalize">Decision: {dispute.outcome?.replace("_", " ")}</p>
          <p className="text-emerald-600 text-xs mt-0.5">By {dispute.resolvedBy} · {dispute.resolvedAt ? new Date(dispute.resolvedAt).toLocaleDateString() : ""}</p>
          {dispute.adminNote && <p className="text-slate-600 mt-1 text-xs">{dispute.adminNote}</p>}
        </div>
      )}

      {dispute.status === "open" && (
        <button onClick={() => onAction(dispute)}
          className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
          Resolve Dispute
        </button>
      )}
    </div>
  );
}

export default function AdminDisputesPage() {
  const { showToast } = useToast();
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<DisputeStatus>("open");
  const [resolving, setResolving] = useState<AdminDispute | null>(null);
  const [action, setAction] = useState<"refund" | "release" | "cancel" | "close" | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [noteError, setNoteError] = useState("");

  useEffect(() => {
    delay().then(() => { setDisputes(MOCK_DISPUTES); setLoading(false); });
  }, []);

  const visible = disputes.filter((d) => d.status === tab);

  const handleResolve = async () => {
    if (!resolving || !action) return;
    if (!adminNote.trim()) { setNoteError("Admin note is required."); return; }
    await delay();
    const outcomeMap = { refund: "refunded", release: "released", cancel: "cancelled", close: "closed" } as const;
    setDisputes((prev) => prev.map((d) => d.id === resolving.id ? {
      ...d, status: "resolved" as DisputeStatus,
      outcome: outcomeMap[action],
      resolvedAt: new Date().toISOString(),
      resolvedBy: "Shopora Admin",
      adminNote,
    } : d));
    showToast("Dispute resolved.", "success");
    setResolving(null);
    setAction(null);
    setAdminNote("");
    setNoteError("");
  };

  const isCOD = resolving?.paymentMethod === "cod";

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {(["open", "resolved"] as DisputeStatus[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? "bg-violet-600 text-white" : "text-slate-500 hover:text-slate-800"}`}>
            {t} ({disputes.filter((d) => d.status === t).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
      ) : visible.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          No {tab} disputes.
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((d) => <DisputeCard key={d.id} dispute={d} onAction={(d) => { setResolving(d); setAction(null); setAdminNote(""); setNoteError(""); }} />)}
        </div>
      )}

      <ConfirmDialog
        open={!!resolving && !!action}
        title="Confirm Resolution"
        message={`${action === "refund" ? "Refund buyer" : action === "release" ? "Release payment to seller" : action === "cancel" ? "Cancel order" : "Close dispute"} for "${resolving?.listingTitle}"?`}
        confirmLabel="Confirm"
        onConfirm={handleResolve}
        onCancel={() => { setAction(null); setNoteError(""); }}>
        <div>
          <textarea value={adminNote} onChange={(e) => { setAdminNote(e.target.value); setNoteError(""); }}
            placeholder="Admin note (required)..." rows={3}
            className={`w-full text-sm border rounded-lg px-3 py-2 text-slate-700 resize-none focus:outline-none focus:border-violet-400 ${noteError ? "border-red-400" : "border-slate-200"}`} />
          {noteError && <p className="text-xs text-red-500 mt-1">{noteError}</p>}
        </div>
      </ConfirmDialog>

      {resolving && !action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setResolving(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 space-y-3">
            <h3 className="font-bold text-slate-800">Resolve: {resolving.listingTitle}</h3>
            <p className="text-sm text-slate-500">Choose an action:</p>
            {isCOD ? (
              <>
                <button onClick={() => setAction("cancel")} className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors">Cancel Order</button>
                <button onClick={() => setAction("close")} className="w-full py-2.5 rounded-xl bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium transition-colors">Close Dispute</button>
              </>
            ) : (
              <>
                <button onClick={() => setAction("refund")} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">Refund Buyer</button>
                <button onClick={() => setAction("release")} className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors">Release to Seller</button>
              </>
            )}
            <button onClick={() => setResolving(null)} className="w-full py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
