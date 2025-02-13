"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-[#282828] border-b-2 border-[#282828] drop-shadow-lg h-14">
      <div className="flex items-center pt-1 space-x-6">
        <Link href="/">
          <img src="/icon.svg" alt="GitGood Logo" className="w-8 h-8" />
        </Link>
        <Link href="/problems" className="mr-4">
          Problems
        </Link>
        <Link href="/my-set" className="mr-4">
          My Set
        </Link>
        <Link href="/create" className="mr-4">
          Create
        </Link>
      </div>
      <div className="pt-1">
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
    </header>
  );
}
