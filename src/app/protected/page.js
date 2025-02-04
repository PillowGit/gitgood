"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "motion/react";

export default function Protected() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="w-screen min-h-screen bg-[#131313] absolute left-0 top-0 flex justify-center items-center flex-col">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-4 rounded-full m-16 text-4xl"
        >
          Buenos días {session.user.name}
        </motion.div>
        <img src="protected.jpg" className="w-[min(50vw,50vh)] m-4" />
        <button
          onClick={() => signOut()}
          className="mt-8 text-lg border-2 border-[#4e4e4ea4] rounded-lg transition hover:scale-110 hover:bg-[#4e4e4ea4] hover:border-[#4e4e4ea4] hover:text-[#F7F7F2] cursor-pointer"
        >
          <div className="my-2 mx-4">Sign Out</div>
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-[#131313] absolute left-0 top-0 flex justify-center items-center flex-col">
      <div className="text-2xl">You are not signed in :(</div>
      <button
        onClick={() => signIn("github")}
        className="mt-8 text-lg border-2 border-[#4e4e4ea4] rounded-lg transition hover:scale-110 hover:bg-[#4e4e4ea4] hover:border-[#4e4e4ea4] hover:text-[#F7F7F2] cursor-pointer"
      >
        <div className="my-2 mx-4">Sign In</div>
      </button>
    </div>
  );
}
