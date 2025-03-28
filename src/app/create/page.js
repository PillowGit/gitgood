"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import BasicInfoForm from "@/components/createlayout/BasicInfoForm";
import TestCasesForm from "@/components/createlayout/TestCasesForm";
import RuntimeForm from "@/components/createlayout/RuntimeForm";

/**
 * Helper function to map language names to editor identifiers.
 */
function mapLanguage(lang) {
  const normalized = lang.trim().toLowerCase();
  if (normalized === "c++" || normalized === "c") return "cpp";
  if (normalized === "javascript") return "javascript";
  if (normalized === "java") return "java";
  if (normalized === "python" || normalized === "python3") return "python";
  return normalized;
}

export default function CreateQuestion() {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [difficultySum, setDifficultySum] = useState(5);
  const [editMode, setEditMode] = useState(false);
  const [displayPublicly, setDisplayPublicly] = useState(true);
  const [tags, setTags] = useState({
    array: false,
    string: false,
    hash_table: false,
    dp: false,
    math: false,
    sorting: false,
    greedy: false,
    dfs: false,
    bfs: false,
    binary_search: false,
    matrix: false,
    tree: false,
    bit_manipulation: false,
    two_pointer: false,
    heap: false,
    stack: false,
    graph: false,
    sliding_window: false,
    back_tracking: false,
    linked_list: false,
    set: false,
    queue: false,
    memo: false,
    recursion: false,
    hashing: false,
    bit_mask: false
  });
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [codeTemplate, setCodeTemplate] = useState("");
  const [codeSolution, setCodeSolution] = useState("");
  const [testCases, setTestCases] = useState([{ ANSWER: "", key: {} }]);
  const [activeTab, setActiveTab] = useState("basic-info");
  const [codeLanguage, setCodeLanguage] = useState("C++");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newQuestion = {
      description,
      metadata: {
        title,
        difficulty_votes: 1,
        difficulty_sum: difficultySum,
        tags: Object.keys(tags).filter((tag) => tags[tag]),
        languages,
        display_publicly: displayPublicly
      },
      code: {
        language: codeLanguage,
        inputs: ["string"],
        template: [codeTemplate],
        solution: [codeSolution],
        tester: ["string"]
      },
      test_cases: testCases
    };

    try {
      const response = await fetch("/api/questions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion)
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
          type="button"
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
          type="button"
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
          type="button"
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
          <BasicInfoForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            difficultySum={difficultySum}
            setDifficultySum={setDifficultySum}
            editMode={editMode}
            setEditMode={setEditMode}
            displayPublicly={displayPublicly}
            setDisplayPublicly={setDisplayPublicly}
            languages={languages}
            setLanguages={setLanguages}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            tags={tags}
            setTags={setTags}
            codeLanguage={codeLanguage}
            setCodeLanguage={setCodeLanguage}
          />
        )}

        {activeTab === "test-cases" && (
          <TestCasesForm testCases={testCases} setTestCases={setTestCases} />
        )}

        {activeTab === "runtime" && (
          <RuntimeForm
            codeLanguage={codeLanguage}
            setCodeLanguage={setCodeLanguage}
            mapLanguage={mapLanguage}
            codeTemplate={codeTemplate}
            setCodeTemplate={setCodeTemplate}
            codeSolution={codeSolution}
            setCodeSolution={setCodeSolution}
          />
        )}

        <button
          type="submit"
          className="w-full bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white py-3 px-4 rounded transition-colors"
        >
          Create Question
        </button>
      </form>
    </div>
  );
}
