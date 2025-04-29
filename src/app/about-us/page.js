"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

/**
 * AboutUs component for displaying information about the GitGood project and its creators.
 *
 * This component introduces the GitGood platform, explains its goals, and presents the team behind it.
 *
 * @component
 * @example
 * return (
 *   <AboutUs />
 * );
 */
export default function AboutUs() {
  /**
   * State to manage the visibility of the team section.
   * @type {boolean}
   */
  const [showTeam, setShowTeam] = useState(false);

  useEffect(() => {
    // Any side-effects or fetching data could go here
  }, []);

  return (
    <div className="sm:w-full md:w-2/3 lg:w-5/6 space-y-6 mx-auto bg-[#1a1a1a] rounded-lg p-10 px-12">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-200 mb-4 mt-2">
          About GitGood
        </h1>
        <p className="text-lg text-gray-400">
          GitGood is an open-source platform designed to help developers improve
          their coding skills through custom coding challenges. With a focus on
          collaboration and active participation, GitGood empowers users to
          submit their own questions and solve challenges created by others.
        </p>
      </div>

      {/* Features Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-200">Our Features</h2>
        <ul className="space-y-2 text-gray-400">
          <li>💡 Submit and share custom coding challenges.</li>
          <li>🧩 Solve problems at various difficulty levels.</li>
          <li>📊 Track your progress and improvement over time.</li>
          <li>🤝 Engage with a community of problem solvers.</li>
        </ul>
      </div>

      {/* Team Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">Meet The Team</h2>
        <p className="text-gray-400">
          GitGood was created by a team of passionate developers who are
          dedicated to helping others learn and grow in their coding journey.
          Our team brings together diverse skills and expertise to make this
          platform a valuable resource for developers worldwide.
        </p>
        <Button
          variant="outline"
          onClick={() => setShowTeam(!showTeam)}
          className="px-4 py-2 rounded-lg border-gray-600 hover:border-gray-400 bg-[#222222] transition"
        >
          {showTeam ? "Hide Team" : "Show Team"}
        </Button>

        {showTeam && (
          <div className="mt-4 space-y-2 text-gray-400">
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-200">David Solano</h3>
              <p>Co-founder and Front-end Lead</p>
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-200">Esteban Escartin</h3>
              <p>Co-founder and Back-end Lead</p>
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-200">Kyle Ho</h3>
              <p>Developer</p>
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-200">Yves Velasquez</h3>
              <p>Developer</p>
            </div>
          </div>
        )}
      </div>

      {/* Call-to-Action Section */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-200 mb-4">
          Join Us Today
        </h2>
        <p className="text-gray-400">
          Become part of the GitGood community and start solving coding
          challenges today. Enhance your skills and help others grow!
        </p>
        <Button
          onClick={() => signIn("github")}
          className="mt-4 px-6 py-2 rounded-lg bg-[#1da568] text-white hover:bg-[#1b9d5b]"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
}
