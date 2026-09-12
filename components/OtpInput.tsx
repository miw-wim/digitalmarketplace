"use client";
import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";

interface OtpInputProps {
  onComplete: (otp: string) => void;
  onResend: () => void;
  loading?: boolean;
}

export default function OtpInput({ onComplete, onResend, loading }: OtpInputProps) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const update = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    if (val && index < 5) refs.current[index + 1]?.focus();
    if (next.every((d) => d !== "")) onComplete(next.join(""));
  };

  const handleKey = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const next = pasted.split("");
      setDigits(next);
      refs.current[5]?.focus();
      onComplete(pasted);
    }
  };

  const handleResend = () => {
    setCountdown(60);
    setDigits(["", "", "", "", "", ""]);
    refs.current[0]?.focus();
    onResend();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-3">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => update(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            onPaste={handlePaste}
            disabled={loading}
            className="w-11 h-14 text-center text-xl font-bold bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all disabled:opacity-50"
          />
        ))}
      </div>
      <div className="text-sm text-gray-400">
        {countdown > 0 ? (
          <span>Resend code in <span className="text-violet-400 font-medium">{countdown}s</span></span>
        ) : (
          <button onClick={handleResend} className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Resend code
          </button>
        )}
      </div>
    </div>
  );
}
