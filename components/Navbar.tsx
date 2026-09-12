"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Listings" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/messages", label: "Messages" },
  { href: "/activity", label: "Activity" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-[#080812]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-sm font-black">S</span>
          <span className="text-white">Shop<span className="text-violet-400">ora</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                (l.href === "/" ? pathname === "/" : pathname.startsWith(l.href))
                  ? "bg-violet-600/20 text-violet-300"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Sign in / Sign up */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</Link>
          <Link href="/register" className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg font-medium transition-colors">Sign up</Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#080812] px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                (l.href === "/" ? pathname === "/" : pathname.startsWith(l.href))
                  ? "bg-violet-600/20 text-violet-300"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="border-t border-white/10 mt-2 pt-2 flex flex-col gap-1">
            <Link href="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-gray-400 hover:text-white">Sign in</Link>
            <Link href="/register" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-violet-400 hover:text-violet-300">Sign up</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
