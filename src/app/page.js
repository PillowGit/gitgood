"use client";

import ProblemList from "@/components/layout/ProblemList";
import Leaderboard from "@/components/layout/Leaderboard";
import FeaturedProblems from "@/components/layout/FeaturedProblems";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#131313] text-white p-6">
      <FeaturedProblems />
      <div className="mt-8 flex">
        <ProblemList />
        <Leaderboard />
      </div>
    </div>
  );
}
