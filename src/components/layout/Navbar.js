"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
/**
 * Navbar component that handles the navigation and user authentication UI.
 *
 * This component displays a navigation bar with links to different sections of the app.
 * It shows either a sign-in button or a sign-out button depending on the user's authentication status.
 * Additionally, it includes a hamburger menu for mobile view that toggles the display of navigation links.
 *
 * @component
 * @example
 * return (
 *   <Navbar />
 * );
 */
export default function Navbar() {
  /**
   * Session data from `next-auth` to track user authentication state.
   * @type {Object|null}
   * @property {Object} user - User data if authenticated (includes user details like name).
   * @property {boolean} authenticated - Boolean flag indicating if the user is logged in.
   */
  const { data: session } = useSession();
  const github_id = session
    ? session.user.image.match(/githubusercontent.com\/u\/(\d+)/)[1]
    : null;

  /**
   * State for controlling the visibility of the mobile menu.
   * @type {boolean}
   */
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center py-4 px-14 bg-[#282828] border-b-2 border-[#282828] drop-shadow-lg h-14">
      {/* Logo and navigation links */}
      <div className="flex items-center pt-1 space-x-6">
        <Link href="/">
          <img
            src="/icon.svg"
            alt="GitGood Logo"
            className="w-7 h-7 transition hover:scale-110 focus:scale-110"
          />
        </Link>
        <div className="hidden md:flex space-x-6">
          {/* Links visible on larger screens */}
          <Link
            href="/problems"
            className="transition hover:scale-110 focus:scale-110"
          >
            Problems
          </Link>
          <Link
            href="/my-set"
            className="transition hover:scale-110 focus:scale-110"
          >
            My Set
          </Link>
          <Link
            href="/create"
            className="transition hover:scale-110 focus:scale-110"
          >
            Create
          </Link>
        </div>
      </div>

      {/* Authentication button for larger screens */}
      <div className="pt-1 hidden md:block">
        {!session ? (
          <button
            onClick={() => signIn("github")}
            className="underline transition hover:scale-110 focus:scale-110"
          >
            Sign in with GitHub
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <p>Welcome back, {session.user.name}!</p>
            <Link href={`/user/${github_id}`}>
              <img
                src={session.user.image}
                alt="User Profile Image"
                className="w-8 h-8 rounded-full border transition hover:scale-110 focus:scale-110"
              />
            </Link>
            <button
              onClick={() => signOut()}
              className="underline transition hover:scale-110 focus:scale-110"
            >
              Sign Out
            </button>
          </div>
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
            <>
              <Link href={`/user/${github_id}`} className="text-white">
                Me
              </Link>
              <button
                onClick={() => signOut()}
                className="underline text-white"
              >
                Sign Out ({session.user.name})
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
