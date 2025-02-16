"use client";

import ProblemList from "@/components/layout/ProblemList";
import Leaderboard from "@/components/layout/Leaderboard";
import FeaturedProblems from "@/components/layout/FeaturedProblems";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#222222] text-white p-8 px-14">
      <FeaturedProblems />

      <div className="mt-8 flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-8">
        <ProblemList className="w-full sm:w-1/2 md:w-2/3" />
        <Leaderboard className="w-full sm:w-1/2 md:w-1/3" />
      </div>
    </div>
  );
}
