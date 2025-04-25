"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import BasicInfoForm from "@/components/createlayout/BasicInfoForm";
import TestCasesForm from "@/components/createlayout/TestCasesForm";
import RuntimeForm from "@/components/createlayout/RuntimeForm";

export default function EditPage({ params }) {
  const { questionId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState("basic-info");

  // State mirroring the create component
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [difficultySum, setDifficultySum] = useState(5);
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
  const [codeLanguage, setCodeLanguage] = useState("");
  const [codeTemplate, setCodeTemplate] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [codeSolution, setCodeSolution] = useState([]);
  const [tester, setTester] = useState([]);
  const [testCasesState, setTestCases] = useState([]);

  // Fetch existing question
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    fetch(`/api/questions/${questionId}`)
      .then((res) => {
        if (res.status === 404) router.push("/my-set");
        return res.json();
      })
      .then((data) => {
        setQuestion(data);
        // initialize states
        setDescription(data.description);
        setTitle(data.metadata.title);
        setDifficultySum(data.metadata.difficulty_sum);
        setDisplayPublicly(data.metadata.display_publicly);
        setTags(data.metadata.tags);
        setLanguages(data.metadata.languages);
        setCodeLanguage(data.code.language);
        setInputs(data.code.inputs);
        setCodeTemplate(data.code.template);
        setCodeSolution(data.code.solution);
        setTester(data.code.tester);
        setTestCases(data.test_cases);
      })
      .finally(() => setLoading(false));
  }, [session, status, questionId, router]);

  const isFormValid = () => {
    return (
      title.trim() &&
      description.trim() &&
      codeTemplate.length &&
      tester.length > 0 &&
      inputs.length > 0 &&
      languages.length > 0 &&
      Object.values(tags).some(Boolean) &&
      testCasesState.length > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedQuestion = {
      description,
      metadata: {
        title,
        difficulty_votes: question.metadata.difficulty_votes,
        difficulty_sum: difficultySum,
        difficulty: question.metadata.difficulty,
        tags: tags,
        languages,
        display_publicly: displayPublicly,
        votes_bad: question.metadata.votes_bad,
        votes_good: question.metadata.votes_good,
        votes_sum: question.metadata.votes_sum,
        questionid: question.metadata.questionid,
        author_id: question.metadata.author_id,
        author_name: question.metadata.author_name,
        date_created: question.metadata.date_created,
        date_updated: question.metadata.date_updated
      },
      code: {
        language: codeLanguage,
        inputs,
        template: codeTemplate,
        solution: codeSolution,
        tester
      },
      test_cases: testCasesState
    };

    const res = await fetch(`/api/questions/${questionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedQuestion)
    });
    if (res.ok) {
      router.push("/my-set");
    } else {
      const { error } = await res.json();
      alert(`Error: ${error}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-4 max-w-3xl mx-auto">
      <div
        className="mb-6 flex items-center gap-2 cursor-pointer"
        onClick={() => router.push("/my-set")}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="font-medium">Back to My Set</span>
      </div>

      <div className="flex mb-6 space-x-2">
        {["basic-info", "test-cases", "runtime"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`rounded-full px-4 py-2 ${
              activeTab === tab
                ? "bg-[#4a4a4a]"
                : "bg-[#333333] hover:bg-[#444444]"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "basic-info"
              ? "Basic Info"
              : tab === "test-cases"
              ? "Test Cases"
              : "Runtime"}
          </button>
        ))}
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
          <TestCasesForm
            testCases={testCasesState}
            setTestCases={setTestCases}
          />
        )}

        {activeTab === "runtime" && (
          <RuntimeForm
            codeLanguage={codeLanguage}
            setCodeLanguage={setCodeLanguage}
            mapLanguage={(lang) =>
              lang.trim().toLowerCase() === "c++"
                ? "cpp"
                : lang.trim().toLowerCase()
            }
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
          disabled={!isFormValid()}
          className={`w-full text-white py-3 px-4 rounded transition-colors ${
            isFormValid()
              ? "bg-[#4a4a4a] hover:bg-[#5a5a5a]"
              : "bg-[#1a1a1a] text-gray-500 cursor-not-allowed"
          }`}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
