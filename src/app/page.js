"use client";

import ProblemList from "@/components/layout/ProblemList";
import Leaderboard from "@/components/layout/Leaderboard";
import FeaturedProblems from "@/components/layout/FeaturedProblems";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#222222] text-white p-8 px-14">
      <FeaturedProblems />
      <div className="mt-8 flex">
        <ProblemList />
        <Leaderboard />
      </div>
    </div>
  );
}
