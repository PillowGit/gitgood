"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import { getQuestion } from "@/lib/database/questions";
import CodeEditor from "@/components/CodeEditor";

export default function Page() {
  const { data: session } = useSession();

  const editorRef = useRef(null);
  const [editorSettings, setEditorSettings] = useState({
    language: "python",
    code: `# Loading code...`,
    theme: "vs-dark",
  });

  const [output, setOutput] = useState("");
  const [question, setQuestion] = useState({
    metadata: { title: "Loading..." },
    description: "Loading question details...",
    test_cases: [],
    code: []
  });

  const [loading, setLoading] = useState(true);

  const params = useParams();
  const slug = params.slug;

  const displayTests = question.test_cases.map((test, idx) => {
    const inputs = test.key ? Object.entries(test.key).map(([key, value]) => `${key}: ${value}`).join(", ") : "No inputs.";

    return {
      input: inputs,
      output: test.ANSWER
    };
  });

  async function runCode() {
    // Runs code from editor
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
          // result.message appears if there is an error in input to Piston
          result.message
            ? `Execution Error: ${result.message}`
            : result.compile?.stderr
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
          setQuestion(`Error loading question: ${data.error}`);
        } else {
          setQuestion(data);

          // Set editor settings using question metadata
          if (data.code && data.code.length > 0) {
            const codeObj = data.code[0];
            setEditorSettings({
              language: codeObj.language,
              code: codeObj.template ? codeObj.template.join('\n') : "// No template provided",
            });
          }

          setLoading(false);
        }
      })
      .catch(error => {
        setOutput(`Error fetching question: ${error.message}`);
        setLoading(false);
      });
  }, [slug]);

  return (
    <div className="flex h-screen">
      {/* Left Panel: Challenge */}
      <div className="w-1/3 p-5 border-r overflow-auto">
        <h1 className="text-xl font-bold ">{question.metadata.title}</h1>
        <p className="mt-2">{question.description}</p>
        <h2 className="mt-4 text-lg font-bold">Examples:</h2>

        {displayTests.map((test, idx) => (
          <div key={idx} className="mt-2 p-3 bg-[#222] rounded">
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
            disabled={loading}
          >
            Run Code
          </button>
          <pre className="mt-2 overflow-auto">{output}</pre>
        </div>
      </div>
    </div>
  );
}
