"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const problems = [
  {
    title: "Smallest Path Between Nodes",
    author: "David Solano",
    date: "Sept 25, 2025",
    difficulty: 4.0,
  },
  {
    title: "Create a Web Socket",
    author: "Yves Velasquez",
    date: "July 13, 2025",
    difficulty: 7.5,
  },
  {
    title: "Database SQL Training",
    author: "Esteban Escartin",
    date: "July 10, 2025",
    difficulty: 3.2,
  },
  {
    title: "HTML Basics",
    author: "Kyle Ho",
    date: "April 12, 2025",
    difficulty: 1.5,
  },
  {
    title: "Traveling Salesman",
    author: "Bruce Mckenzie",
    date: "Feb 09, 2025",
    difficulty: 8.0,
  },
];

const difficultyLevels = [
  "Filters",
  "Easy (1-3)",
  "Medium (4-6)",
  "Hard (7-10)",
];

export default function ProblemList() {
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Filters");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter problems based on search & difficulty
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === "Filters" ||
      (selectedDifficulty === "Easy (1-3)" && problem.difficulty < 4) ||
      (selectedDifficulty === "Medium (4-6)" &&
        problem.difficulty >= 4 &&
        problem.difficulty <= 7) ||
      (selectedDifficulty === "Hard (7-10)" && problem.difficulty > 7);

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="w-2/3 pr-6 space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="outline"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-400 transition"
          >
            <span>{selectedDifficulty}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>

          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg z-10">
              {difficultyLevels.map((level, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedDifficulty(level);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:bg-[#282828] transition"
                >
                  {level}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative flex-1">
          <Input
            placeholder="Search problems"
            className="pl-10 bg-[#1a1a1a] border-gray-700 focus:border-gray-400 transition rounded-lg text-gray-300"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
      </div>

      <div className="h-[600px] space-y-4 overflow-auto">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem, i) => (
            <div
              key={i}
              className="flex items-start space-x-4 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#282828] transition shadow-md"
            >
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-200">
                    {problem.title}
                  </h3>
                  <span className="text-sm text-gray-400">
                    Difficulty: {problem.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-400">By: {problem.author}</p>
                <p className="text-sm text-gray-500">{problem.date}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No problems found.</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <Button
          variant="outline"
          disabled
          className="px-4 py-2 rounded-lg border-gray-600 text-gray-400"
        >
          &lt; Prev
        </Button>
        <span className="text-sm text-gray-400">Page [1] of 120</span>
        <Button
          variant="outline"
          className="px-4 py-2 rounded-lg border-gray-600 hover:border-gray-400 transition"
        >
          Next &gt;
        </Button>
      </div>
    </div>
  );
}
