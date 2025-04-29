"use client";

// Function imports
import { proxyGetQuestion } from "@/lib/proxies/question";
import { proxyGetSubmissions } from "@/lib/proxies/submissions";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

// Component imports
import { Editor } from "@monaco-editor/react";
import Link from "next/link";

const language_mappings = {
  "Unknown/Unspecified": "plaintext",
  "c++": "cpp",
  "C++": "cpp",
  python: "python",
  Python: "python",
  python3: "python",
  Python3: "python"
};

function formatTimestamp(timestamp) {
  if (!timestamp || typeof timestamp.seconds !== "number") {
    return "Invalid date";
  }
  try {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch (e) {
    console.log("Error formatting timestamp: ", e);
    return "Invalid date";
  }
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const questionSlug = params?.slug;
  const currentSubmissionId = params?.submission;

  // State variables
  const [questionTitle, setQuestionTitle] = useState("Loading...");
  const [allsubmissions, setAllSubmissions] = useState([]);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!questionSlug || !currentSubmissionId) {
      setError("Invalid question slug or submission ID");
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      setQuestionTitle("Loading...");
      setAllSubmissions([]);
      setCurrentSubmission(null);

      try {
        const questionData = await proxyGetQuestion(questionSlug);
        if (questionData.error) {
          setError(questionData.error);
          return;
        }
        setQuestionTitle(questionData.metadata?.title || "Untitled");
        const submissionsResult = await proxyGetSubmissions(questionSlug);
        if (submissionsResult.error) {
          setError(submissionsResult.error);
          return;
        }
        const fetchedSubmissions = submissionsResult.submissions || [];
        setAllSubmissions(fetchedSubmissions);
        const foundSubmission = fetchedSubmissions.find(
          (sub) => sub.submission_id === currentSubmissionId
        );
        if (!foundSubmission) {
          setError("Submission not found");
          return;
        }
        setCurrentSubmission(foundSubmission);
      } catch (error) {
        console.error("Error in useEffect: ", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [questionSlug, currentSubmissionId]);

  function goBackToChallenge() {
    router.push(`/challenge/${questionSlug}`);
  }

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#222222] text-white p-8">
        Loading details...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[#222222] text-red-400 p-8 px-14">
        <h1 className="text-2xl font-bold mb-4">Error loading submission</h1>
        <p>Could not load the submittion data</p>
        <p className="mt-2 font-mono bg-gray-700 p-2 rounded">
          Details: {error}
        </p>
      </div>
    );
  }
  if (!currentSubmission) {
    return (
      <div className="min-h-screen bg-[#222222] text-yellow-400 p-8 px-14">
        Data for this submission is not available
      </div>
    );
  }

  const submissionCode = (currentSubmission.code || []).join("\n");
  const submissionLanguage =
    language_mappings[currentSubmission.language] ||
    currentSubmission.language?.toLowerCase() ||
    "plaintext";
  const otherSubmissions = allsubmissions.filter(
    (sub) => sub.submission_id !== currentSubmissionId
  );

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-[#222222] text-gray-200 pt-16 md:pt-4">
        {/* ===== Left Pane ===== */}
        <div className="w-full md:w-1/2 p-4 md:p-6 lg:p-8 overflow-y-auto border-r-0 md:border-r border-gray-700 flex flex-col">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            {/* Question Title */}
            <h1 className="text-xl lg:text-2xl font-bold mb-4 text-white flex-shrink-0 text-wrap">
              {questionTitle} - Submission Details
            </h1>
            <button
              onClick={goBackToChallenge}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 ml-4 py-1 rounded transition duration-150 ease-in-out"
            >
              Back to Challenge
            </button>
          </div>

          {/* Submitted Code (Read-Only Editor) */}
          <div className="mb-6 flex-shrink-0">
            <h2 className="text-lg font-semibold mb-2 text-gray-100">
              Submitted Code ({currentSubmission.language})
            </h2>
            <div className="border border-gray-700 rounded-md overflow-hidden h-64">
              {" "}
              {/* Fixed height for editor */}
              <Editor
                height="100%"
                language={submissionLanguage}
                value={submissionCode}
                theme="vs-dark"
                onMount={handleEditorDidMount}
                options={{
                  readOnly: true, // Make editor read-only
                  domReadOnly: true, // Prevent interaction
                  fontSize: 13, // Slightly smaller font potentially
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  wrappingIndent: "indent",
                  minimap: { enabled: false }
                }}
              />
            </div>
          </div>

          {/* List of Other Submissions */}
          <div className="flex-grow overflow-y-auto">
            {" "}
            {/* Allow this section to scroll */}
            <h2 className="text-lg font-semibold mb-2 text-gray-100 flex-shrink-0">
              Other Submissions
            </h2>
            {otherSubmissions.length > 0 ? (
              <ul className="space-y-2">
                {otherSubmissions.map((sub) => (
                  <li
                    key={sub.submission_id}
                    className="bg-[#2d2d2d] p-3 rounded-md border border-gray-700 hover:bg-gray-600 transition duration-150"
                  >
                    <Link
                      href={`/challenge/${questionSlug}/${sub.submission_id}`}
                      className="block"
                    >
                      <div className="flex justify-between items-center text-sm">
                        <span
                          className={`font-mono text-xs px-2 py-0.5 rounded ${
                            sub.passed
                              ? "bg-green-700 text-green-100"
                              : "bg-red-700 text-red-100"
                          }`}
                        >
                          {sub.passed ? "Passed" : "Failed"}
                        </span>
                        <span className="text-gray-400">
                          {formatTimestamp(sub.date_created)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        Language: {sub.language}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">
                No other submissions found for this question.
              </p>
            )}
          </div>
        </div>{" "}
        {/* End Left Pane */}
        {/* ===== Right Pane ===== */}
        <div className="w-full md:w-1/2 p-4 md:p-6 lg:p-8 flex flex-col">
          <h2 className="text-xl lg:text-2xl font-bold mb-4 text-white flex-shrink-0">
            Result
          </h2>
          {/* Conditional Rendering based on 'passed' status */}
          {currentSubmission.passed ? (
            // Success Message
            <div className="flex-grow bg-green-900 border border-green-700 rounded-md p-4 text-green-100 flex items-center justify-center">
              <div className="text-center">
                {/* You can add an icon here */}
                <h3 className="text-2xl font-semibold mb-2">
                  Congratulations!
                </h3>
                <p>All test cases passed.</p>
              </div>
            </div>
          ) : (
            <div className="flex-grow bg-[#1e1e1e] border border-gray-700 rounded-md p-4 overflow-y-auto">
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Execution Output / Error
              </h3>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap break-words">
                {currentSubmission.piston_output || "No output captured."}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
