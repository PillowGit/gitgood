"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false); // State for toggling menu

  return (
    <header className="flex justify-between items-center py-4 px-14 bg-[#282828] border-b-2 border-[#282828] drop-shadow-lg h-14">
      <div className="flex items-center pt-1 space-x-6">
        <Link href="/">
          <img src="/icon.svg" alt="GitGood Logo" className="w-7 h-7" />
        </Link>
        <div className="hidden md:flex space-x-6">
          {/* Navigation links hidden on mobile */}
          <Link href="/problems">Problems</Link>
          <Link href="/my-set">My Set</Link>
          <Link href="/create">Create</Link>
        </div>
      </div>

      <div className="pt-1 hidden md:block">
        {/* Only show on larger screens */}
        {!session ? (
          <button onClick={() => signIn("github")} className="underline">
            Sign in with GitHub
          </button>
        ) : (
          <button onClick={() => signOut()} className="underline">
            Sign Out ({session.user.name})
          </button>
        )}
      </div>

      {/* Hamburger icon for mobile */}
      <div className="pt-2 md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#282828] flex flex-col items-center py-4 space-y-4">
          <Link href="/problems" className="text-white">
            Problems
          </Link>
          <Link href="/my-set" className="text-white">
            My Set
          </Link>
          <Link href="/create" className="text-white">
            Create
          </Link>
          {!session ? (
            <button
              onClick={() => signIn("github")}
              className="underline text-white"
            >
              Sign in with GitHub
            </button>
          ) : (
            <button onClick={() => signOut()} className="underline text-white">
              Sign Out ({session.user.name})
            </button>
          )}
        </div>
      )}
    </header>
  );
}
