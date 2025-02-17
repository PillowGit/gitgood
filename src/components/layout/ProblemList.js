"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react"; // Added Search icon
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/**
 * ProblemList component for displaying a list of coding problems with search and filter functionality.
 *
 * This component allows users to search for problems and filter them by difficulty levels.
 * It displays a list of problems with their titles, authors, dates, and difficulty levels.
 * The component also features a dropdown menu for selecting difficulty filters and an input field for searching problems.
 *
 * @component
 * @example
 * return (
 *   <ProblemList />
 * );
 */
export default function ProblemList() {
  /**
   * State for the current search query.
   * @type {string}
   */
  const [search, setSearch] = useState("");

  /**
   * State for the selected difficulty level filter.
   * @type {string}
   */
  const [selectedDifficulty, setSelectedDifficulty] = useState("Filters");

  /**
   * State for tracking the open/close status of the difficulty filter dropdown.
   * @type {boolean}
   */
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /**
   * Ref for the dropdown menu to detect clicks outside of it.
   * @type {React.RefObject}
   */
  const dropdownRef = useRef(null);

  /**
   * Array containing problem data for display.
   * Each problem includes title, author, date, and difficulty.
   * @type {Array<{title: string, author: string, date: string, difficulty: number}>}
   */
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

  /**
   * Array of difficulty levels available for filtering problems.
   * @type {string[]}
   */
  const difficultyLevels = [
    "Filters",
    "Easy (1-3)",
    "Medium (4-6)",
    "Hard (7-10)",
  ];

  /**
   * Effect hook that closes the difficulty dropdown if a click occurs outside of it.
   * This effect listens for `mousedown` events on the document.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Filters the problems based on the current search query and selected difficulty level.
   *
   * @returns {Array<{title: string, author: string, date: string, difficulty: number}>} The filtered problems.
   */
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
    <div className="sm:w-full md:w-2/3 lg:w-5/6 pr-6 space-y-6 mx-auto bg-[#1a1a1a] rounded-lg p-3">
      {/* Filter Dropdown and Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Dropdown Button */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="outline"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-400 bg-[#222222] transition"
          >
            <span>{selectedDifficulty}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-[#222222] border border-gray-700 rounded-lg shadow-lg z-10">
              {difficultyLevels.map((level, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedDifficulty(level);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray hover:bg-[#282828] transition"
                >
                  {level}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <input
            placeholder="Search problems"
            className="pl-10 pr-4 py-2 placeholder-gray bg-[#222222] text-white border border-gray-600 hover:border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 transition duration-200 ease-in-out"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <Search className="absolute left-3 top-2.5 text-white" />
        </div>
      </div>

      {/* Problem List Display */}
      <div className="h-[600px] space-y-4 overflow-auto">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-start space-x-0 sm:space-x-4 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#282828] transition shadow-md"
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

      {/* Pagination */}
      <div className="flex items-center justify-center pt-4 border-t border-gray-700">
        <Button
          variant="outline"
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
