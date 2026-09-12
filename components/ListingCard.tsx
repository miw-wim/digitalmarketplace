import Link from "next/link";
import type { Listing } from "@/lib/types";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400",
  sold: "bg-gray-500/20 text-gray-400",
  pending: "bg-amber-500/20 text-amber-400",
  removed: "bg-red-500/20 text-red-400",
};

interface ListingCardProps {
  listing: Listing;
  onEdit?: (listing: Listing) => void;
  onDelete?: (listing: Listing) => void;
  showActions?: boolean;
}

export default function ListingCard({ listing, onEdit, onDelete, showActions }: ListingCardProps) {
  return (
    <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/50 hover:bg-white/8 transition-all duration-200">
      <Link href={`/listings/${listing.id}`}>
        <div className="relative h-44 bg-white/5 overflow-hidden">
          {listing.images[0] ? (
            <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[listing.status]}`}>
            {listing.status}
          </span>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={`/listings/${listing.id}`} className="font-semibold text-white hover:text-violet-300 transition-colors line-clamp-1 flex-1">
            {listing.title}
          </Link>
          <span className="text-violet-400 font-bold whitespace-nowrap">${listing.price}</span>
        </div>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{listing.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs bg-white/8 text-gray-400 px-2 py-0.5 rounded-full">{listing.category}</span>
          <span className="text-xs text-gray-600">{listing.views} views</span>
        </div>
        {showActions && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
            <button onClick={() => onEdit?.(listing)} className="flex-1 text-xs py-1.5 rounded-lg bg-violet-600/20 text-violet-400 hover:bg-violet-600/40 transition-colors font-medium">
              Edit
            </button>
            <button onClick={() => onDelete?.(listing)} className="flex-1 text-xs py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors font-medium">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
