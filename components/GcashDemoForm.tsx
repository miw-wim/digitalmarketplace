"use client";
import { useState } from "react";

interface Props {
  total: number;
  onSuccess: (data: { number: string; accountName: string; referenceNo: string }) => void;
}

function genRef() {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `GC-${date}-${rand}`;
}

export default function GcashDemoForm({ total, onSuccess }: Props) {
  const [number, setNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!/^09\d{9}$/.test(number)) e.number = "Enter a valid 11-digit GCash number starting with 09.";
    if (!accountName.trim()) e.accountName = "Account name is required.";
    return e;
  };

  const handlePay = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setFailed(false);
    await new Promise((r) => setTimeout(r, 1200));
    // Simulate ~10% failure rate for realism
    if (Math.random() < 0.1) { setLoading(false); setFailed(true); return; }
    setLoading(false);
    onSuccess({ number, accountName, referenceNo: genRef() });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">GCash Number</label>
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="09XXXXXXXXX"
          maxLength={11}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
        />
        {errors.number && <p className="text-xs text-red-400 mt-1">{errors.number}</p>}
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Account Name</label>
        <input
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Name on your GCash account"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
        />
        {errors.accountName && <p className="text-xs text-red-400 mt-1">{errors.accountName}</p>}
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Amount (₱)</label>
        <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white opacity-60 cursor-not-allowed">
          ₱{total}
        </div>
      </div>

      {failed && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-xs text-red-400">
          Payment failed. Please try again.
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm"
      >
        {loading ? "Processing…" : "Pay now"}
      </button>
    </div>
  );
}
