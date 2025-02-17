"use client";

import { useState, useEffect, useRef } from "react";

import CodeEditor from "@/components/CodeEditor";

export default function Page() {
  const editorRef = useRef(null);
  const editorSettings = {
    language: "python",
    code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:`,
    theme: "vs-dark",
  };

  const [output, setOutput] = useState("");

  const challenge = {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    tests: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]" },
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]" }
    ]
  };

  function runCode() {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      try {
        // TODO: Replace this with an API call to actually run the code
        setOutput(`Running...\n`);
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      }
    }
  }

  return (
    <div className="flex h-screen">

      {/* Left Panel: Challenge */}
      <div className="w-1/3 p-5 border-r">
        <h1 className="text-xl font-bold ">{challenge.title}</h1>
        <p className="mt-2">{challenge.description}</p>
        <h2 className="mt-4 text-lg font-bold">Examples:</h2>

        {challenge.tests.map((test, idx) => (
          <div key={idx} className="mt-2">
            <p className="font-semibold">Example {idx + 1}: </p>
            <p className="text-sm"><b>Input:</b> {test.input}</p>
            <p className="text-sm"><b>Output:</b> {test.output}</p>
          </div>
        ))}
      </div>

      {/* Right Panel: Editor and Tests */}
      <div className="w-2/3 flex flex-col">
        {/* Editor */}
        <div className="flex-1 h-screen">
          <CodeEditor editorRef={editorRef} settings={editorSettings} />
        </div>

        {/* Tests */}
        <div className="h-1/3 p-3 flex-col">
          <button
            className="border-2 px-1 border-[#4e4e4ea4] rounded-lg transition hover:bg-[#4e4e4ea4] hover:border-[#4e4e4ea4] cursor-pointer"
            onClick={runCode}>
            Run Code
          </button>
          <p className="mt-2 overflow-auto">{output}</p>
        </div>
      </div>
    </div>
  );
}
