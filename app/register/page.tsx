"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import OtpInput from "@/components/OtpInput";
import { supabase } from "@/lib/supabase";

type Step = "form" | "otp";

interface FormData { name: string; email: string; password: string; confirm: string }
interface Errors { name?: string; email?: string; password?: string; confirm?: string }

function validate(data: FormData): Errors {
  const e: Errors = {};
  if (!data.name.trim()) e.name = "Name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Valid email required";
  if (data.password.length < 8) e.password = "Password must be at least 8 characters";
  if (data.password !== data.confirm) e.confirm = "Passwords do not match";
  return e;
}

const inp = (hasError: boolean) =>
  `w-full px-4 py-3 bg-white/5 border ${hasError ? "border-red-500" : "border-white/15"} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all`;

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormData>({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
    setApiError("");
  };

  // Step 1 — create account in Supabase, triggers OTP email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError("");

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name }, // stored in raw_user_meta_data → picked up by trigger
        emailRedirectTo: undefined, // we handle OTP manually
      },
    });

    setLoading(false);

    if (error) {
      setApiError(error.message);
      return;
    }

    showToast("Check your email for a 6-digit OTP.", "success");
    setStep("otp");
  };

  // Step 2 — verify the OTP Supabase sent
  const handleOtp = async (otp: string) => {
    setLoading(true);
    setApiError("");

    const { error } = await supabase.auth.verifyOtp({
      email: form.email,
      token: otp,
      type: "signup",
    });

    setLoading(false);

    if (error) {
      setApiError("Invalid or expired code. Try again.");
      return;
    }

    showToast("Account verified! You can now sign in.", "success");
    router.push("/login");
  };

  // Resend OTP
  const handleResend = async () => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: form.email,
    });
    if (error) {
      showToast("Could not resend code. Try again.", "error");
    } else {
      showToast("New code sent to your email.", "info");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in">

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {(["form", "otp"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s ? "bg-violet-600 text-white" :
                  step === "otp" && s === "form" ? "bg-violet-600/40 text-violet-300" :
                  "bg-white/10 text-gray-500"
                }`}>
                  {step === "otp" && s === "form" ? "✓" : i + 1}
                </div>
                <span className={`text-xs ${step === s ? "text-white" : "text-gray-500"}`}>
                  {s === "form" ? "Your details" : "Verify email"}
                </span>
                {i < 1 && <div className="w-6 h-px bg-white/10" />}
              </div>
            ))}
          </div>

          {/* Step 1: Form */}
          {step === "form" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
                <p className="text-gray-400 text-sm">Join Shopora and start buying or selling.</p>
              </div>

              {apiError && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Full name</label>
                  <input type="text" value={form.name} onChange={set("name")} placeholder="Your name" className={inp(!!errors.name)} />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" className={inp(!!errors.email)} />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                  <input type="password" value={form.password} onChange={set("password")} placeholder="Min. 8 characters" className={inp(!!errors.password)} />
                  {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm password</label>
                  <input type="password" value={form.confirm} onChange={set("confirm")} placeholder="Repeat password" className={inp(!!errors.confirm)} />
                  {errors.confirm && <p className="text-xs text-red-400 mt-1">{errors.confirm}</p>}
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors mt-2">
                  {loading ? "Creating account…" : "Create account"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-violet-400 hover:text-violet-300">Sign in</Link>
              </p>
            </>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <>
              <div className="mb-8 text-center">
                <div className="w-14 h-14 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Verify your email</h2>
                <p className="text-gray-400 text-sm">
                  We sent a 6-digit code to{" "}
                  <span className="text-violet-400 font-medium">{form.email}</span>
                </p>
              </div>

              {apiError && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 text-center">
                  {apiError}
                </div>
              )}

              <OtpInput onComplete={handleOtp} onResend={handleResend} loading={loading} />

              <button onClick={() => { setStep("form"); setApiError(""); }}
                className="w-full mt-6 py-2.5 text-sm text-gray-400 hover:text-gray-300 transition-colors">
                ← Back to edit details
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
