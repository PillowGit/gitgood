"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
  const [difficultySum, setDifficultySum] = useState(0);

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
    console.log(languages);
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
        tags: tags,
        languages: languages,
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
    <div className="sm:w-full md:w-2/3 lg:w-5/6 pr-6 space-y-6 mx-auto bg-[#1a1a1a] rounded-lg p-3">
      <h1 className="text-xl font-semibold text-gray-200">
        Create a New Question
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <Input
            placeholder="Enter question title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full py-2 text-white bg-[#222222] border border-gray-600 hover:border-gray-400 rounded-lg"
          />
        </div>

        {/* Description Input */}
        <div>
          <Input
            placeholder="Enter question description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full py-2 text-white bg-[#222222] border border-gray-600 hover:border-gray-400 rounded-lg"
          />
        </div>

        {/* Difficulty Sum */}
        <div>
          Difficulty:
          <input
            type="number"
            min="0"
            max="10"
            placeholder="Enter difficulty sum"
            onChange={(e) => setDifficultySum(Number(e.target.value))}
            className="w-full py-2 px-2 text-white bg-[#222222] border border-gray-600 hover:border-gray-400 rounded-lg"
          />
        </div>

        {/* Tags Input */}
        <div>
          <Input
            placeholder="Enter tags (comma separated)"
            onChange={changeTags}
            className="w-full py-2 text-white bg-[#222222] border border-gray-600 hover:border-gray-400 rounded-lg"
          />
        </div>

        {/* Languages Input */}
        <div>
          <Input
            placeholder="Enter programming languages (comma separated)"
            onChange={changeLanguages}
            className="w-full py-2 text-white bg-[#222222] border border-gray-600 hover:border-gray-400 rounded-lg"
          />
        </div>

        {/* Code Template Input */}
        <div>
          <Input
            placeholder="Enter the problem prompt"
            value={codeTemplate}
            onChange={(e) => setCodeTemplate(e.target.value)}
            className="w-full py-2 text-white bg-[#222222] border border-gray-600 hover:border-gray-400 rounded-lg"
          />
        </div>

        {/* Code Solution Input */}
        <div>
          <Input
            placeholder="Enter code solution"
            value={codeSolution}
            onChange={(e) => setCodeSolution(e.target.value)}
            className="w-full py-2 text-white bg-[#222222] border border-gray-600 hover:border-gray-400 rounded-lg"
          />
        </div>

        {/* Test Cases Input */}
        <div>
          <textarea
            value={JSON.stringify(testCases, null, 2)}
            onChange={(e) => setTestCases(JSON.parse(e.target.value))}
            className="w-full py-2 text-white bg-[#222222] border border-gray-600 hover:border-gray-400 rounded-lg"
            placeholder="Enter test cases (JSON format)"
          />
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            variant="outline"
            className="w-full py-2 text-white border-gray-600 hover:border-gray-400"
          >
            Create Question
          </Button>
        </div>
      </form>
    </div>
  );
}
