"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";

/**
 * CreateQuestion component for adding a new coding question.
 *
 * This component allows users to input the question details such as title, difficulty, tags, and coding solution.
 * It also provides a submit button to submit the data to an API endpoint.
 *
 * @component
 * @example
 * return (
 *   <CreateQuestion />
 * );
 */
export default function CreateQuestion() {
  /**
   * State for the question description.
   * @type {string}
   */
  const [description, setDescription] = useState("");

  /**
   * State for the title of the question.
   * @type {string}
   */
  const [title, setTitle] = useState("");

  /**
   * State for difficulty sum.
   * @type {number}
   */
  const [difficultySum, setDifficultySum] = useState(5);

  /**
   * State for tags.
   * @type {Array<string>}
   */
  const [tags, setTags] = useState([]);

  const changeTags = (e) => {
    setTags(e.target.value.split(",").map((tag) => tag.trim()));
  };

  /**
   * State for programming languages.
   * @type {Array<string>}
   */
  const [languages, setLanguages] = useState([]);

  const changeLanguages = (e) => {
    setLanguages(e.target.value.split(",").map((language) => language.trim()));
  };

  /**
   * State for code template.
   * @type {string}
   */
  const [codeTemplate, setCodeTemplate] = useState("");

  /**
   * State for code solution.
   * @type {string}
   */
  const [codeSolution, setCodeSolution] = useState("");

  /**
   * State for test cases.
   * @type {Array<{ANSWER: string, key: string}>}
   */
  const [testCases, setTestCases] = useState([{ ANSWER: "", key: "" }]);

  /**
   * State for active tab.
   * @type {string}
   */
  const [activeTab, setActiveTab] = useState("basic-info");

  /**
   * Handles form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newQuestion = {
      description,
      metadata: {
        title,
        difficulty_votes: 1,
        difficulty_sum: difficultySum,
        tags,
        languages,
        display_publicly: true,
      },
      code: {
        language: "string",
        inputs: ["string"],
        template: [codeTemplate],
        solution: [codeSolution],
        tester: ["string"],
      },
      test_cases: testCases,
    };

    try {
      const response = await fetch("/api/questions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        alert("Question created successfully!");
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("Something went wrong, please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-4 max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-2">
        <ChevronLeft className="h-5 w-5" />
        <span className="font-medium">My Creations</span>
      </div>

      <div className="flex mb-6 space-x-2">
        <button
          className={`rounded-full px-4 py-2 ${
            activeTab === "basic-info"
              ? "bg-[#4a4a4a]"
              : "bg-[#333333] hover:bg-[#444444]"
          }`}
          onClick={() => setActiveTab("basic-info")}
        >
          Basic Info
        </button>
        <button
          className={`rounded-full px-4 py-2 ${
            activeTab === "test-cases"
              ? "bg-[#4a4a4a]"
              : "bg-[#333333] hover:bg-[#444444]"
          }`}
          onClick={() => setActiveTab("test-cases")}
        >
          Test Cases
        </button>
        <button
          className={`rounded-full px-4 py-2 ${
            activeTab === "runtime"
              ? "bg-[#4a4a4a]"
              : "bg-[#333333] hover:bg-[#444444]"
          }`}
          onClick={() => setActiveTab("runtime")}
        >
          Runtime
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === "basic-info" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter question title"
                className="w-full bg-[#333333] border-none text-white p-3 rounded"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm">
                Description (markdown supported)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter question description"
                className="w-full min-h-[180px] bg-[#333333] border-none text-white p-3 rounded resize-y"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-xs text-center">
                  Projected Difficulty
                  <br />
                  (0.1-10.0)
                </label>
                <div className="flex flex-col items-center">
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={difficultySum}
                    onChange={(e) =>
                      setDifficultySum(Number.parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                  <div className="mt-2 bg-[#333333] rounded px-3 py-1 w-16 text-center">
                    {difficultySum.toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-center">
                  Display Publicly?
                  <br />
                  If unchecked, your question can only be accessed via link
                </label>
                <div className="flex justify-center items-center h-12">
                  <div className="h-6 w-6 rounded bg-[#333333] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-center">
                  How many test cases should
                  <br />
                  users see?
                </label>
                <div className="flex justify-center">
                  <input
                    type="number"
                    min="0"
                    defaultValue="3"
                    className="w-16 text-center bg-[#333333] border-none text-white p-2 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="block text-sm">
                Question Tags (comma separated)
              </label>
              <input
                id="tags"
                type="text"
                onChange={changeTags}
                placeholder="DP, Array, Stack, Queue, DFS"
                className="w-full bg-[#333333] border-none text-white p-3 rounded"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="languages" className="block text-sm">
                Programming Languages (comma separated)
              </label>
              <input
                id="languages"
                type="text"
                onChange={changeLanguages}
                placeholder="JavaScript, Python, Java, C++"
                className="w-full bg-[#333333] border-none text-white p-3 rounded"
              />
            </div>
          </div>
        )}

        {activeTab === "test-cases" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="codeTemplate" className="block text-sm">
                Code Template
              </label>
              <textarea
                id="codeTemplate"
                value={codeTemplate}
                onChange={(e) => setCodeTemplate(e.target.value)}
                placeholder="Enter the problem prompt"
                className="w-full min-h-[120px] bg-[#333333] border-none text-white p-3 rounded resize-y"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="codeSolution" className="block text-sm">
                Code Solution
              </label>
              <textarea
                id="codeSolution"
                value={codeSolution}
                onChange={(e) => setCodeSolution(e.target.value)}
                placeholder="Enter code solution"
                className="w-full min-h-[120px] bg-[#333333] border-none text-white p-3 rounded resize-y"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="testCases" className="block text-sm">
                Test Cases (JSON format)
              </label>
              <textarea
                id="testCases"
                value={JSON.stringify(testCases, null, 2)}
                onChange={(e) => {
                  try {
                    setTestCases(JSON.parse(e.target.value));
                  } catch (error) {
                    // Handle JSON parse error
                  }
                }}
                placeholder="Enter test cases in JSON format"
                className="w-full min-h-[120px] bg-[#333333] border-none text-white p-3 rounded resize-y font-mono text-sm"
              />
            </div>
          </div>
        )}

        {activeTab === "runtime" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm">
                What Language does this problem use? (you can add additional
                submission languages after publishing)
              </label>
              <select
                className="w-full bg-[#333333] border-none text-white p-3 rounded"
                defaultValue="C++"
              >
                <option value="C++">C++</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="JavaScript">JavaScript</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm">
                Write a function that can parse your Test Case sheet
              </label>
              <textarea
                className="w-full min-h-[120px] bg-[#333333] border-none text-white p-3 rounded resize-y font-mono text-sm"
                defaultValue={`std::vector<void*> > parsed;
void parser() {
  // parsing
}`}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm">
                Write a template function for users to put their solution in
              </label>
              <textarea
                className="w-full min-h-[120px] bg-[#333333] border-none text-white p-3 rounded resize-y font-mono text-sm"
                defaultValue={`void solution() {
  // code here
}`}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm">
                Write a solution to your problem
              </label>
              <textarea
                className="w-full min-h-[180px] bg-[#333333] border-none text-white p-3 rounded resize-y font-mono text-sm"
                defaultValue={`void solution() {
  // code here
}`}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm">
                Finally, write a function that tests the inputs you generated
                with the user's template function vs your solution. If it passes
                all test cases, this should only output "all to stdout. If it
                fails the first test, it should print 1, if it fails the second
                test, etc.
              </label>
              <textarea
                className="w-full min-h-[120px] bg-[#333333] border-none text-white p-3 rounded resize-y font-mono text-sm"
                defaultValue={`void testing() {
  // code here
}`}
              />
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            className="w-full bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white py-3 px-4 rounded transition-colors"
          >
            Create Question
          </button>
        </div>
      </form>
    </div>
  );
}
