"use client";
import { useState } from "react";
import type { Listing, Category, ListingStatus } from "@/lib/types";
import { CATEGORIES } from "@/lib/mock-data";

interface ListingFormProps {
  initial?: Partial<Listing>;
  onSubmit: (data: Partial<Listing>) => Promise<void>;
  onCancel: () => void;
}

interface Errors { title?: string; price?: string; description?: string; category?: string }

export default function ListingForm({ initial, onSubmit, onCancel }: ListingFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [category, setCategory] = useState<Category>(initial?.category ?? "Other");
  const [status, setStatus] = useState<ListingStatus>(initial?.status ?? "active");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!title.trim()) e.title = "Title is required";
    if (!description.trim()) e.description = "Description is required";
    if (!price || isNaN(Number(price)) || Number(price) <= 0) e.price = "Valid price required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await onSubmit({ title, description, price: Number(price), category, status });
    setLoading(false);
  };

  const inp = (hasError: boolean) =>
    `w-full px-4 py-3 bg-white/5 border ${hasError ? "border-red-500" : "border-white/15"} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
        <input value={title} onChange={(e) => { setTitle(e.target.value); setErrors((er) => ({ ...er, title: undefined })); }}
          placeholder="What are you selling?" className={inp(!!errors.title)} />
        {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
        <textarea value={description} onChange={(e) => { setDescription(e.target.value); setErrors((er) => ({ ...er, description: undefined })); }}
          placeholder="Describe the item, condition, etc." rows={3}
          className={`${inp(!!errors.description)} resize-none`} />
        {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Price ($)</label>
          <input type="number" min="0" step="0.01" value={price} onChange={(e) => { setPrice(e.target.value); setErrors((er) => ({ ...er, price: undefined })); }}
            placeholder="0.00" className={inp(!!errors.price)} />
          {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-500 transition-all text-sm">
            {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#0f0f1a]">{c}</option>)}
          </select>
        </div>
      </div>
      {initial && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as ListingStatus)}
            className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-500 transition-all text-sm">
            {["active", "sold", "pending", "removed"].map((s) => <option key={s} value={s} className="bg-[#0f0f1a]">{s}</option>)}
          </select>
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors text-sm">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm">
          {loading ? "Saving…" : initial ? "Save changes" : "Create listing"}
        </button>
      </div>
    </form>
  );
}
