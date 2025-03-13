"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react"; // Added Search icon
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

import { getDefaultQuery, makeQuery } from "@/lib/proxies/queries";
import { timestampToDate } from "@/lib/utilities";
import { getBaseQuestionData } from "@/lib/database/questions";

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
   * Query options for filtering problems.
   */
  const [filterTag, setFilterTag] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [orderBy, setOrderBy] = useState("");

  /**
   * Toggle for Tag Selection Menu
   * @type {boolean}
   */
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  /**
   * Options for tag menu
   * @type {string[]}
   */
  const tags = Object.keys(getBaseQuestionData().metadata.tags);

  /**
   * Toggle for Difficulty Selection Menu
   * @type {boolean}
   */
  const [isDifficultyMenuOpen, setIsDifficultyMenuOpen] = useState(false);
  /**
   * Options for difficulty menu
   * @type {string[]}
   */
  const difficulties = ["easy", "medium", "hard"];

  /**
   * Toggle for Order Selection Menu
   * @type {boolean}
   */
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  /**
   * Options for Order menu
   * @type {string[]}
   */
  const orderings = ["difficulty", "votes", "updated", "created"];

  /**
   * Array containing all pages
   * @type {Metadata[][]}
   */
  const [pages, setPages] = useState([]);
  /**
   * Array containing problem data for display.
   * Each problem includes title, author, date, and difficulty.
   * @type {Metadata[]}
   */
  const [problems, setProblems] = useState([]);
  /**
   * Current page number
   * @type {number}
   */
  const [currentPage, setCurrentPage] = useState(0);

  function backPage() {
    if (currentPage == 0) return;
    setProblems(pages[currentPage - 1]);
    setCurrentPage(currentPage - 1);
  }
  function nextPage() {
    if (currentPage + 1 < pages.length) {
      setProblems(pages[currentPage + 1]);
      setCurrentPage(currentPage + 1);
    } else if (
      currentPage + 1 === pages.length &&
      pages[pages.length - 1].length < 5
    ) {
      return;
    } else {
      const queryOptions = getDefaultQuery();
      queryOptions.filter_tag = filterTag;
      queryOptions.difficulty = difficulty;
      queryOptions.order_by = orderBy;
      queryOptions.limit = 5;
      queryOptions.start_after = pages[pages.length - 1][4].questionid;
      makeQuery(queryOptions).then((response) => {
        setPages([...pages, response]);
        setProblems(response);
        setCurrentPage(currentPage + 1);
      });
    }
  }

  async function restartPaging(changes) {
    const queryOptions = getDefaultQuery();
    queryOptions.filter_tag = filterTag;
    queryOptions.difficulty = difficulty;
    queryOptions.order_by = orderBy;
    queryOptions.limit = 5;
    makeQuery({ ...queryOptions, ...changes }).then((response) => {
      setPages([response]);
      setCurrentPage(0);
      setProblems(response);
    });
  }

  useEffect(() => {
    const queryOptions = getDefaultQuery();
    queryOptions.limit = 5;
    makeQuery(queryOptions).then((response) => {
      setPages([response]);
      setProblems(response);
    });
  }, []);

  return (
    <div className="sm:w-full md:w-2/3 lg:w-5/6 pr-6 space-y-6 mx-auto bg-[#1a1a1a] rounded-lg p-3">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Tag Filter Dropdown Button */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsTagMenuOpen(!isTagMenuOpen)}
            className={
              isTagMenuOpen
                ? "flex items-center space-x-2 z-10 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-400 bg-[#222222] transition"
                : "flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-400 bg-[#222222] transition"
            }
          >
            <span>
              {filterTag
                ? filterTag
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Tags"}
            </span>
            <ChevronDown className="w-4 h-4" />
          </Button>
          {/* Tag Filter Dropdown Menu */}
          {isTagMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-5 bg-black bg-opacity-50"
                onClick={() => setIsTagMenuOpen(false)}
              ></div>
              <div className="absolute left-0 mt-2 bg-[#222222] border border-gray-700 rounded-lg shadow-lg z-10 w-[760px] max-w-[65vw] flex flex-wrap">
                {tags.map((tag_name, index) => (
                  <button
                    key={`tag-${index}`}
                    onClick={async () => {
                      const newtag = tag_name === filterTag ? "" : tag_name;
                      setFilterTag(newtag);
                      restartPaging({ filter_tag: newtag });
                      setIsTagMenuOpen(false);
                    }}
                    className={
                      filterTag === tag_name
                        ? "text-center border-2 border-[#1da568] rounded-md m-2 text-gray hover:bg-[#282828] transition"
                        : "text-center border-2 border-[#282828] rounded-md m-2 text-gray hover:bg-[#282828] transition"
                    }
                  >
                    <p className="p-2">
                      {tag_name
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Difficulty Filter Dropdown Button */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsDifficultyMenuOpen(!isDifficultyMenuOpen)}
            className={
              isDifficultyMenuOpen
                ? "flex items-center space-x-2 z-10 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-400 bg-[#222222] transition"
                : "flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-400 bg-[#222222] transition"
            }
          >
            <span>
              {difficulty
                ? difficulty
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Difficulty"}
            </span>
            <ChevronDown className="w-4 h-4" />
          </Button>
          {/* Tag Filter Dropdown Menu */}
          {isDifficultyMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-5 bg-black bg-opacity-50"
                onClick={() => setIsDifficultyMenuOpen(false)}
              ></div>
              <div className="absolute left-0 mt-2 bg-[#222222] border border-gray-700 rounded-lg shadow-lg z-10 max-w-[65vw] flex flex-wrap">
                {difficulties.map((diff, index) => (
                  <button
                    key={`tag-${diff}`}
                    onClick={async () => {
                      const newdiff = diff === difficulty ? "" : diff;
                      setDifficulty(newdiff);
                      restartPaging({ difficulty: newdiff });
                      setIsDifficultyMenuOpen(false);
                    }}
                    className={
                      difficulty === diff
                        ? "text-center border-2 border-[#1da568] rounded-md m-2 text-gray hover:bg-[#282828] transition"
                        : "text-center border-2 border-[#282828] rounded-md m-2 text-gray hover:bg-[#282828] transition"
                    }
                  >
                    <p className="p-2">
                      {diff
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Order Dropdown Button */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsOrderMenuOpen(!isOrderMenuOpen)}
            className={
              isOrderMenuOpen
                ? "flex items-center space-x-2 z-10 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-400 bg-[#222222] transition"
                : "flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-400 bg-[#222222] transition"
            }
          >
            <span>
              {"Order by: " +
                (orderBy
                  ? orderBy
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")
                  : "Votes")}
            </span>
            <ChevronDown className="w-4 h-4" />
          </Button>
          {/* Tag Filter Dropdown Menu */}
          {isOrderMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-5 bg-black bg-opacity-50"
                onClick={() => setIsOrderMenuOpen(false)}
              ></div>
              <div className="absolute left-0 mt-2 bg-[#222222] border border-gray-700 rounded-lg shadow-lg z-10 max-w-[65vw] flex flex-wrap">
                {orderings.map((ord, index) => (
                  <button
                    key={`tag-${ord}`}
                    onClick={async () => {
                      const neword = ord === orderBy ? "" : ord;
                      setOrderBy(neword);
                      restartPaging({ order_by: neword });
                      setIsOrderMenuOpen(false);
                    }}
                    className={
                      ord === orderBy
                        ? "text-center border-2 border-[#1da568] rounded-md m-2 text-gray hover:bg-[#282828] transition"
                        : "text-center border-2 border-[#282828] rounded-md m-2 text-gray hover:bg-[#282828] transition"
                    }
                  >
                    <p className="p-2">
                      {ord
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Problem List Display */}
      <div className="h-[600px] space-y-4 overflow-auto">
        {problems.length > 0 ? (
          problems.map((problem, i) => (
            <Link
              href={`/challenge/${problem.questionid}`}
              key={i}
              className="flex flex-col sm:flex-row items-start space-x-0 sm:space-x-4 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#282828] transition shadow-md"
            >
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col items-start">
                    <h3 className="text-lg font-semibold text-gray-200">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      By: {problem.author_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {timestampToDate(problem.date_updated).toDateString()}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400 flex flex-col items-center justify-center">
                    <p>Difficulty: {problem.difficulty}</p>
                    <p>
                      <span className="text-[#1da568]">
                        {`+${problem.votes_good} `}
                      </span>
                      |
                      <span className="text-[#ce5545]">
                        {` -${problem.votes_bad}`}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-400">No problems found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center pt-4 border-t border-gray-700">
        <Button
          variant="outline"
          className="px-4 py-2 rounded-lg border-gray-600 transition hover:scale-110 hover:underline focus:scale-110 focus:underline"
          onClick={backPage}
        >
          &lt; Prev
        </Button>
        <span className="text-sm text-gray-400">Page {currentPage + 1}</span>
        <Button
          variant="outline"
          className="px-4 py-2 rounded-lg border-gray-600 transition hover:scale-110 hover:underline focus:scale-110 focus:underline"
          onClick={nextPage}
        >
          Next &gt;
        </Button>
      </div>
    </div>
  );
}
