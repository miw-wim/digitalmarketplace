"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/Toast";
import type { ShippingAddress } from "@/lib/types";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ProfilePage() {
  const { user, refreshUser, saveAddress, loading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar ?? "");
  const [avatarFile, setAvatarFile] = useState<string | null>(null);

  const emptyAddr: ShippingAddress = { fullName: "", mobile: "", street: "", barangay: "", city: "", province: "", postalCode: "" };
  const [addr, setAddr] = useState<ShippingAddress>(user?.address ?? emptyAddr);
  const [addrLoading, setAddrLoading] = useState(false);
  const [addrError, setAddrError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Keep form in sync if user loads after mount
  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarPreview(user.avatar ?? "");
      setAddr(user.address ?? emptyAddr);
    }
  }, [user]);

  useEffect(() => {
    if (!user && !loading) router.push("/login");
  }, [user, loading]);

  if (!user) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setAvatarPreview(result);
      setAvatarFile(result);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setProfileError("Name cannot be empty."); return; }
    if (!addr.mobile.trim() || !/^09\d{9}$/.test(addr.mobile)) { setProfileError("Enter a valid 11-digit mobile number starting with 09."); return; }
    setProfileLoading(true);
    setProfileError("");

    const updates: Record<string, unknown> = { name: name.trim(), address: { ...addr, fullName: name.trim() } };
    if (avatarFile) updates.avatar = avatarFile;

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    setProfileLoading(false);
    if (error) { setProfileError(error.message); return; }

    await saveAddress({ ...addr, fullName: name.trim() });
    await refreshUser();
    showToast("Profile updated!", "success");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) { setPasswordError("New password is required."); return; }
    if (newPassword.length < 8) { setPasswordError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Passwords do not match."); return; }

    setPasswordLoading(true);
    setPasswordError("");

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setPasswordLoading(false);
    if (error) { setPasswordError(error.message); return; }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Password changed!", "success");
  };

  const inp = "w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm";

  const setA = (k: keyof ShippingAddress) => (v: string) => setAddr((p) => ({ ...p, [k]: v }));

  const handleAddressSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addr.fullName.trim() || !addr.mobile.trim() || !addr.street.trim() || !addr.barangay.trim() || !addr.city.trim() || !addr.province.trim() || !addr.postalCode.trim()) {
      setAddrError("Please fill in all address fields."); return;
    }
    if (!/^09\d{9}$/.test(addr.mobile)) { setAddrError("Enter a valid 11-digit mobile number starting with 09."); return; }
    if (!/^\d{4}$/.test(addr.postalCode)) { setAddrError("Enter a valid 4-digit postal code."); return; }
    setAddrLoading(true);
    setAddrError("");
    await saveAddress(addr);
    setAddrLoading(false);
    showToast("Address saved!", "success");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <h1 className="text-2xl font-black text-white mb-8">Edit Profile</h1>

      {/* ── Profile Info ── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-5">Profile Information</h2>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-violet-500/40" />
              : <div className="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-violet-500/40">
                  {getInitials(user.name)}
                </div>
            }
            {/* Camera overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-violet-400 hover:text-violet-300 mt-1 transition-colors"
            >
              Change photo
            </button>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setProfileError(""); }}
              placeholder="Your full name"
              className={inp}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Mobile Number</label>
            <input
              value={addr.mobile}
              onChange={(e) => { setA("mobile")(e.target.value); setProfileError(""); }}
              placeholder="09XXXXXXXXX"
              maxLength={11}
              className={inp}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className={`${inp} opacity-50 cursor-not-allowed`}
            />
            <p className="text-xs text-gray-600 mt-1">Email cannot be changed here.</p>
          </div>

          <p className="text-xs text-gray-500 pt-2">Delivery Address — auto-filled at checkout</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Street / House No.</label>
              <input value={addr.street} onChange={(e) => setA("street")(e.target.value)} placeholder="123 Rizal St." className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Barangay</label>
              <input value={addr.barangay} onChange={(e) => setA("barangay")(e.target.value)} placeholder="Barangay 123" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">City / Municipality</label>
              <input value={addr.city} onChange={(e) => setA("city")(e.target.value)} placeholder="Quezon City" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Province</label>
              <input value={addr.province} onChange={(e) => setA("province")(e.target.value)} placeholder="Metro Manila" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Postal Code</label>
              <input value={addr.postalCode} onChange={(e) => setA("postalCode")(e.target.value)} placeholder="1100" maxLength={4} className={inp} />
            </div>
          </div>

          {profileError && (
            <p className="text-xs text-red-400 px-1">{profileError}</p>
          )}

          <button
            type="submit"
            disabled={profileLoading}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {profileLoading ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>

      {/* ── Change Password ── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-5">Change Password</h2>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setPasswordError(""); }}
              placeholder="Min. 8 characters"
              className={inp}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(""); }}
              placeholder="Repeat new password"
              className={inp}
            />
          </div>

          {passwordError && (
            <p className="text-xs text-red-400 px-1">{passwordError}</p>
          )}

          <button
            type="submit"
            disabled={passwordLoading}
            className="w-full py-3 bg-white/10 hover:bg-white/15 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {passwordLoading ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
