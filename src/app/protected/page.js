"use client"; 

import { useSession, signIn, signOut } from "next-auth/react";

export default function Protected() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <img src="protected.jpg" width={500} height={500} />
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => signIn("github")}>Sign In</button>
    </div>
  );
}