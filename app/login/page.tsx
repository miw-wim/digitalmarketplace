"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { supabase } from "@/lib/supabase";

interface Errors { email?: string; password?: string }

const inp = (hasError: boolean) =>
  `w-full px-4 py-3 bg-white/5 border ${hasError ? "border-red-500" : "border-white/15"} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all`;

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingRole, setPendingRole] = useState<string>("user");
  const [pendingName, setPendingName] = useState<string>("User");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Valid email required";
    if (!password) errs.password = "Password is required";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError("");

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setLoading(false);
      if (authError.message.toLowerCase().includes("email not confirmed")) {
        setApiError("Please verify your email first. Check your inbox for the OTP code.");
      } else if (authError.message.toLowerCase().includes("invalid login credentials")) {
        setApiError("No account found with these credentials. Please sign up first.");
      } else {
        setApiError(authError.message);
      }
      return;
    }

    // Fetch role from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, role")
      .eq("id", authData.user.id)
      .single();

    setPendingRole(profile?.role ?? "user");
    setPendingName(profile?.name ?? "User");

    const { error: otpError } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    setLoading(false);

    if (otpError) { setApiError(otpError.message); return; }

    setStep("otp");
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { setApiError("Enter the 6-digit OTP."); return; }
    setLoading(true);
    setApiError("");

    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "magiclink" });
    setLoading(false);

    if (error) { setApiError("Invalid or expired OTP. Try again."); return; }

    showToast(`Welcome back, ${pendingName}!`, "success");
    router.push(pendingRole === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in">

          {step === "credentials" ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
                <p className="text-gray-400 text-sm">Sign in to your Shopora account.</p>
              </div>

              {apiError && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
                  {apiError}
                  {apiError.includes("sign up") && (
                    <Link href="/register" className="ml-1 underline text-violet-400 hover:text-violet-300">Sign up here</Link>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                  <input type="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((er) => ({ ...er, email: undefined })); setApiError(""); }}
                    placeholder="you@email.com" className={inp(!!errors.email)} />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-gray-300">Password</label>
                    <Link href="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300">Forgot password?</Link>
                  </div>
                  <input type="password" value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((er) => ({ ...er, password: undefined })); setApiError(""); }}
                    placeholder="Your password" className={inp(!!errors.password)} />
                  {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors mt-2">
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                No account?{" "}
                <Link href="/register" className="text-violet-400 hover:text-violet-300">Sign up first</Link>
              </p>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">Check your email</h1>
                <p className="text-gray-400 text-sm">We sent an OTP to <span className="text-white">{email}</span>. Check your inbox.</p>
              </div>

              {apiError && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">OTP Code</label>
                  <input type="text" value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setApiError(""); }}
                    placeholder="123456" className={inp(false)} maxLength={6} />
                </div>

                <button type="submit" disabled={loading || otp.length !== 6}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
                  {loading ? "Verifying…" : "Verify & Sign in"}
                </button>
              </form>

              <button onClick={() => { setStep("credentials"); setOtp(""); setApiError(""); }}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-300 mt-4 transition-colors">
                ← Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
