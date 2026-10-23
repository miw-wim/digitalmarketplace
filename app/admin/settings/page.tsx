"use client";
import { useState, useEffect } from "react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/Toast";
import { MOCK_ADMIN_CATEGORIES } from "@/lib/mock-data";
import type { AdminCategory } from "@/lib/types";

const delay = () => new Promise((r) => setTimeout(r, 800));

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  // Marketplace settings
  const [marketplaceName, setMarketplaceName] = useState("CampusMart");
  const [nameError, setNameError] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Shipping
  const [shippingFee, setShippingFee] = useState("80");
  const [shippingError, setShippingError] = useState("");
  const [savingShipping, setSavingShipping] = useState(false);

  // Categories
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatError, setNewCatError] = useState("");
  const [editingCat, setEditingCat] = useState<AdminCategory | null>(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");
  const [deletingCat, setDeletingCat] = useState<AdminCategory | null>(null);
  const [savingCat, setSavingCat] = useState(false);

  // Password
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    delay().then(() => { setCategories(MOCK_ADMIN_CATEGORIES); setLoading(false); });
  }, []);

  const handleSaveName = async () => {
    if (!marketplaceName.trim()) { setNameError("Name is required."); return; }
    setSavingName(true);
    await delay();
    setSavingName(false);
    showToast("Marketplace name saved.", "success");
  };

  const handleSaveShipping = async () => {
    const val = parseFloat(shippingFee);
    if (isNaN(val) || val < 0) { setShippingError("Enter a valid fee (≥ 0)."); return; }
    setSavingShipping(true);
    await delay();
    setSavingShipping(false);
    showToast("Shipping fee saved.", "success");
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) { setNewCatError("Category name is required."); return; }
    if (categories.some((c) => c.name.toLowerCase() === newCatName.trim().toLowerCase())) {
      setNewCatError("Category already exists."); return;
    }
    setSavingCat(true);
    await delay();
    setCategories((prev) => [...prev, { id: `cat${Date.now()}`, name: newCatName.trim(), listingsCount: 0, createdAt: new Date().toISOString().split("T")[0] }]);
    setNewCatName("");
    setNewCatError("");
    setSavingCat(false);
    showToast("Category added.", "success");
  };

  const handleEditSave = async () => {
    if (!editName.trim()) { setEditError("Name is required."); return; }
    if (categories.some((c) => c.id !== editingCat?.id && c.name.toLowerCase() === editName.trim().toLowerCase())) {
      setEditError("Category already exists."); return;
    }
    setSavingCat(true);
    await delay();
    setCategories((prev) => prev.map((c) => c.id === editingCat?.id ? { ...c, name: editName.trim() } : c));
    setEditingCat(null);
    setEditName("");
    setEditError("");
    setSavingCat(false);
    showToast("Category updated.", "success");
  };

  const handleDeleteCategory = async () => {
    if (!deletingCat) return;
    await delay();
    setCategories((prev) => prev.filter((c) => c.id !== deletingCat.id));
    setDeletingCat(null);
    showToast("Category deleted.", "success");
  };

  const handleChangePassword = async () => {
    const errs: Record<string, string> = {};
    if (!currentPw) errs.currentPw = "Current password is required.";
    if (!newPw || newPw.length < 8) errs.newPw = "New password must be at least 8 characters.";
    if (newPw !== confirmPw) errs.confirmPw = "Passwords do not match.";
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setSavingPw(true);
    await delay();
    setSavingPw(false);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setPwErrors({});
    showToast("Password changed.", "success");
  };

  const inputCls = (err?: string) =>
    `w-full text-sm border rounded-lg px-3 py-2 text-slate-700 bg-white focus:outline-none focus:border-violet-400 ${err ? "border-red-400" : "border-slate-200"}`;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
      <h3 className="font-semibold text-slate-800 text-base">{title}</h3>
      {children}
    </div>
  );

  if (loading) return (
    <div className="space-y-5">{[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
  );

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      {/* Marketplace name */}
      <Section title="Marketplace">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Marketplace Name</label>
          <input value={marketplaceName} onChange={(e) => { setMarketplaceName(e.target.value); setNameError(""); }}
            className={inputCls(nameError)} placeholder="e.g. CampusMart" />
          {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
        </div>
        <button onClick={handleSaveName} disabled={savingName}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
          {savingName ? "Saving..." : "Save"}
        </button>
      </Section>

      {/* Shipping fee */}
      <Section title="Shipping Defaults">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Default Shipping Fee (₱)</label>
          <input type="number" min="0" value={shippingFee} onChange={(e) => { setShippingFee(e.target.value); setShippingError(""); }}
            className={inputCls(shippingError)} />
          {shippingError && <p className="text-xs text-red-500 mt-1">{shippingError}</p>}
        </div>
        <button onClick={handleSaveShipping} disabled={savingShipping}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
          {savingShipping ? "Saving..." : "Save"}
        </button>
      </Section>

      {/* Categories */}
      <Section title="Category Management">
        <div className="flex gap-2">
          <div className="flex-1">
            <input value={newCatName} onChange={(e) => { setNewCatName(e.target.value); setNewCatError(""); }}
              placeholder="New category name..." className={inputCls(newCatError)} />
            {newCatError && <p className="text-xs text-red-500 mt-1">{newCatError}</p>}
          </div>
          <button onClick={handleAddCategory} disabled={savingCat}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 shrink-0">
            Add
          </button>
        </div>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-xl">
              {editingCat?.id === cat.id ? (
                <div className="flex-1 flex gap-2 mr-2">
                  <input value={editName} onChange={(e) => { setEditName(e.target.value); setEditError(""); }}
                    className={`flex-1 text-sm border rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:border-violet-400 ${editError ? "border-red-400" : "border-slate-200"}`} />
                  {editError && <p className="text-xs text-red-500 self-center">{editError}</p>}
                </div>
              ) : (
                <div className="flex-1">
                  <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                  <span className="text-xs text-slate-400 ml-2">{cat.listingsCount} listings</span>
                </div>
              )}
              <div className="flex gap-1.5 shrink-0">
                {editingCat?.id === cat.id ? (
                  <>
                    <button onClick={handleEditSave} disabled={savingCat} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-medium transition-colors">Save</button>
                    <button onClick={() => { setEditingCat(null); setEditError(""); }} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium transition-colors">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditingCat(cat); setEditName(cat.name); setEditError(""); }} className="text-xs px-2.5 py-1 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 font-medium transition-colors">Edit</button>
                    <button onClick={() => setDeletingCat(cat)} className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors">Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Password */}
      <Section title="Change Password">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 block mb-1">Current Password</label>
            <input type="password" value={currentPw} onChange={(e) => { setCurrentPw(e.target.value); setPwErrors((p) => ({ ...p, currentPw: "" })); }}
              className={inputCls(pwErrors.currentPw)} />
            {pwErrors.currentPw && <p className="text-xs text-red-500 mt-1">{pwErrors.currentPw}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">New Password</label>
            <input type="password" value={newPw} onChange={(e) => { setNewPw(e.target.value); setPwErrors((p) => ({ ...p, newPw: "" })); }}
              className={inputCls(pwErrors.newPw)} />
            {pwErrors.newPw && <p className="text-xs text-red-500 mt-1">{pwErrors.newPw}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Confirm New Password</label>
            <input type="password" value={confirmPw} onChange={(e) => { setConfirmPw(e.target.value); setPwErrors((p) => ({ ...p, confirmPw: "" })); }}
              className={inputCls(pwErrors.confirmPw)} />
            {pwErrors.confirmPw && <p className="text-xs text-red-500 mt-1">{pwErrors.confirmPw}</p>}
          </div>
        </div>
        <button onClick={handleChangePassword} disabled={savingPw}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
          {savingPw ? "Saving..." : "Change Password"}
        </button>
      </Section>

      <ConfirmDialog open={!!deletingCat} title="Delete Category"
        message={`Delete "${deletingCat?.name}"? This cannot be undone.`}
        confirmLabel="Delete" confirmClass="bg-red-600 hover:bg-red-500"
        onConfirm={handleDeleteCategory} onCancel={() => setDeletingCat(null)} />
    </div>
  );
}
