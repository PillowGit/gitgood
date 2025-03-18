"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import { getQuestion } from "@/lib/database/questions";
import CodeEditor from "@/components/CodeEditor";

export default function Page() {
  const { data: session } = useSession();

  const editorRef = useRef(null);
  const editorSettings = {
    language: "python",
    code: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
      # Add code here

if __name__ == "__main__":
  nums = [2, 7, 11, 15]
  target = 9
  expected = [0, 1]
  solution = Solution()
  result = solution.twoSum(nums, target)
  if result != expected: print("Incorrect!")
  else: print("Correct!")
  print(f"Result: {result}")
  print(f"Expected: {expected}")`,
    theme: "vs-dark",
  };

  const [output, setOutput] = useState("");

  const [question_data, setQuestionData] = useState("Loading...");

  const params = useParams();
  const slug = params.slug;

  async function runCode() {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      setOutput(`Running...\n`);
      try {
        const response = await fetch("/api/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            language: editorSettings.language,
          }),
        });

        const result = await response.json();

        setOutput(
          result.compile?.stderr
            ? `Compilation Error:\n${result.compile.stderr}`
            : result.run.output || "No output"
        );
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      }
    }
  }

  useEffect(() => {
    fetch(`/api/questions/${slug}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setQuestionData("idk bro there was an error or something");
        } else {
          setQuestionData(JSON.stringify(data, null, 2));
        }
      });
  }, []);

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
            <p className="text-sm">
              <b>Input:</b> {test.input}
            </p>
            <p className="text-sm">
              <b>Output:</b> {test.output}
            </p>
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
            onClick={runCode}
          >
            Run Code
          </button>
          <pre className="mt-2 overflow-auto">{output}</pre>
        </div>
      </div>
    </div>
    // export default function ClientComponent() {
    //   return (
    //     <>
    //       <div className="min-h-screen bg-[#222222] text-white p-8 px-14">
    //         <div>{question_data}</div>
    //       </div>
    //     </>
  );
}
