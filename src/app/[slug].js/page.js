"use client";

import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

export default function Protected() {
  const { data: session } = useSession();
  const router = useRouter();
  const req_id = router.query.slug;

  useEffect(() => {
    alert("we are mounted");
  }, [github_id]);

  return (
    <>
      <div className="min-h-screen bg-[#222222] text-white p-8 px-14">
        {req_id}
      </div>
    </>
  );
}
