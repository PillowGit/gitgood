"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import BasicInfoForm from "@/components/createlayout/BasicInfoForm";
import TestCasesForm from "@/components/createlayout/TestCasesForm";
import RuntimeForm from "@/components/createlayout/RuntimeForm";
import { useSession } from "next-auth/react";
import Link from "next/link";

/**
 * Helper function to map language names to editor identifiers.
 */
function mapLanguage(lang) {
  const normalized = lang.trim().toLowerCase();
  if (normalized === "c++" || normalized === "c") return "cpp";
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
  const [codeTemplate, setCodeTemplate] = useState([
    "bool isNOdd(int n) {",
    "\t// code ",
    "}"
  ]);
  const [inputs, setInputs] = useState([
    "#include <vector>",
    "#include <iostream>",
    "std::vector<int> testCases = {5, 10, 15, 20};"
  ]);
  const [tester, setTester] = useState([
    "void testing() {",
    "\tfor (int i = 0; i < testCases.size(); i++) {",
    "\t\tint n = testCases[i];",
    "\t\tif (isNOdd(n) != solution(n)) { ",
    '\t\t\tstd::cout << n << "is wrong"; ',
    "\t\t\treturn;",
    "\t\t}",
    "\t}",
    '\tstd::cout << "all";',
    "}",
    "int main() {",
    "\ttesting();",
    "\treturn 0;",
    "}"
  ]);
  const [codeSolution, setCodeSolution] = useState([
    "bool solution(int n) {",
    "\treturn n % 2;",
    "}"
  ]);
  const [testCases, setTestCases] = useState([
    { ANSWER: "15", inputs: { n: "5", arr: "[1, 2, 3, 4, 5]" } },
    { ANSWER: "1", inputs: { n: "1", arr: "[1]" } }
  ]);
  const [activeTab, setActiveTab] = useState("basic-info");
  const [codeLanguage, setCodeLanguage] = useState("C++");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timerId = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timerId);
  }, [cooldown]);

  const { data: session, status } = useSession();
  const isSignedIn = !!session;
  const githubId = session?.user?.image?.match(
    /githubusercontent.com\/u\/(\d+)/
  )?.[1];

  const isFormValid = () => {
    return (
      isSignedIn &&
      title.trim() &&
      description.trim() &&
      codeTemplate.length > 0 &&
      codeSolution.length > 0 &&
      tester.length > 0 &&
      inputs.length > 0 &&
      languages.length > 0 &&
      Object.values(tags).some(Boolean) &&
      testCases.length > 0
    );
  };

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
        inputs: inputs,
        template: codeTemplate,
        solution: codeSolution,
        tester: tester
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
        const createdQuestion = await response.json();
        setCooldown(10);
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
        <Link href="/my-set" className="font-medium">
          My Creations
        </Link>
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
            isEdit={false}
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
            inputs={inputs}
            setInputs={setInputs}
            tester={tester}
            setTester={setTester}
          />
        )}

        <button
          type="submit"
          disabled={!isFormValid() || cooldown > 0}
          className={`w-full text-white py-3 px-4 rounded transition-colors
            ${
              isFormValid() && cooldown === 0
                ? "bg-[#4a4a4a] hover:bg-[#5a5a5a]"
                : "bg-[#1a1a1a] text-gray-500 cursor-not-allowed"
            }`}
        >
          {!isSignedIn
            ? `Sign in to Create a Question!`
            : cooldown > 0
            ? `Please wait ${cooldown}s`
            : "Create Question"}
        </button>
      </form>
    </div>
  );
}
