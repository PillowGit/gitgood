"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-700">
      <h1 className="text-2xl font-bold">GitGood</h1>
      <nav>
        <Link href="/problems" className="mr-4">
          Problems
        </Link>
        <Link href="/my-set" className="mr-4">
          My Set
        </Link>
        <Link href="/create" className="mr-4">
          Create
        </Link>

        {!session ? (
          <button onClick={() => signIn("github")} className="underline">
            Sign in with GitHub
          </button>
        ) : (
          <button onClick={() => signOut()} className="underline">
            Sign Out ({session.user.name})
          </button>
        )}
      </nav>
    </header>
  );
}
