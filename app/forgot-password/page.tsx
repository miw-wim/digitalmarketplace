"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

type Step = "email" | "new-password" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwErrors, setPwErrors] = useState<{ password?: string; confirm?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Valid email required"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep("new-password");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof pwErrors = {};
    if (password.length < 8) errs.password = "Min. 8 characters";
    if (password !== confirm) errs.confirm = "Passwords do not match";
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep("done");
    showToast("Password reset successfully!", "success");
    setTimeout(() => router.push("/login"), 2000);
  };

  const inp = (hasError: boolean) =>
    `w-full px-4 py-3 bg-white/5 border ${hasError ? "border-red-500" : "border-white/15"} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all`;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in">

          {step === "email" && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">Reset password</h1>
                <p className="text-gray-400 text-sm">Enter your email to reset your password.</p>
              </div>
              <form onSubmit={handleEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    placeholder="you@email.com"
                    className={inp(!!emailError)}
                  />
                  {emailError && <p className="text-xs text-red-400 mt-1">{emailError}</p>}
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
                  {loading ? "Checking…" : "Continue"}
                </button>
              </form>
              <p className="text-center text-sm text-gray-500 mt-6">
                <Link href="/login" className="text-violet-400 hover:text-violet-300">← Back to sign in</Link>
              </p>
            </>
          )}

          {step === "new-password" && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-1">New password</h2>
                <p className="text-gray-400 text-sm">Choose a strong new password for <span className="text-white">{email}</span>.</p>
              </div>
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">New password</label>
                  <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setPwErrors((er) => ({ ...er, password: undefined })); }}
                    placeholder="Min. 8 characters" className={inp(!!pwErrors.password)} />
                  {pwErrors.password && <p className="text-xs text-red-400 mt-1">{pwErrors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm password</label>
                  <input type="password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setPwErrors((er) => ({ ...er, confirm: undefined })); }}
                    placeholder="Repeat password" className={inp(!!pwErrors.confirm)} />
                  {pwErrors.confirm && <p className="text-xs text-red-400 mt-1">{pwErrors.confirm}</p>}
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
                  {loading ? "Resetting…" : "Reset password"}
                </button>
              </form>
            </>
          )}

          {step === "done" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-600/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Password reset!</h2>
              <p className="text-gray-400 text-sm">Redirecting you to sign in…</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
