"use client";

// Function imports
import { proxyGetQuestion, proxyVoteQuestion } from "@/lib/proxies/question";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";


// Component imports
import ProblemDescription from "@/components/createlayout/ProblemDescription";
import ProblemEditor from "@/components/createlayout/ProblemEditor";

function formatTimestamp(timestamp) {
  if (!timestamp || typeof timestamp.seconds !== "number") {
    return 'Invalid date';
  }
  try {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch (e) {
    console.log("Error formatting timestamp: ", e);
    return 'Invalid date';
  }
}

function getTags(tags) {
  if (!tags) return [];
  return Object.entries(tags)
    .filter(([tagName, isActive]) => isActive === true)
    .map(([tagName]) => tagName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
}

function difficultyLevel(level) {
  if (level === undefined || level === null) return "Unknown";
  if (level <= 3.3) return 'Easy';
  if (level <= 6.6) return 'Medium';
  if (level <= 10) return 'Hard';
  return 'Unknown';
}

export default function ClientComponent() {
  // Necessary page data
  const { data: session } = useSession();
  const params = useParams();
  const slug = params?.slug;

  // Page state data
  const [questionData, setQuestionData] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Voting state
  const [votingInProgress, setVotingInProgress] = useState(false);
  const [userVote, setUserVote] = useState(null);

  // Editor state data
  const language_mappings = {
    'Unknown/Unspecified': 'plaintext',
    'c++': 'cpp',
    'C++': 'cpp',
    'python': 'python',
    'Python': 'python',
    'python3': 'python',
    'Python3': 'python',
  }
  const [editorLanguage, setEditorLanguage] = useState("cpp");
  const [editorCode, setEditorCode] = useState(`// Start coding here!`);
  const editorRef = useRef(null);
  function setRef(editor, monaco) {
    editorRef.current = editor;
  }

  useEffect(() => {
    if (!slug) {
      setError("No slug provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuestionData(null);

    proxyGetQuestion(slug)
      .then((res) => {
        if (res.error) {
          console.error("Error fetching question data: ", res.error);
          setError(res.error);
          setQuestionData(null);
        } else if (!res) {
          setError("Question data not found or is empty for some reason");
          setQuestionData(null);
        } else {
          setQuestionData(res);
          const lang = res.code?.language || 'plaintext';
          setEditorLanguage(language_mappings[lang] || lang);
          setEditorCode((res.code?.template || []).join("\n") || `// Start coding here!`);
          setUserVote(res.metadata?.userVote || null);
        }
      })
      .catch((err) => {
        console.error("Error fetching question data: ", err);
        setError(err);
        setQuestionData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Editor setup
  function handleEditorMount(editor, monaco) {
    editorRef.current = editor;
  }  
  function handleEditorChange(value, event) {
    setEditorCode(value);
  }

  // Voting logic
  function handleVote(voteType) {
    if (votingInProgress || !session || !questionData?.metadata?.questionid) return;

    setVotingInProgress(true);
    proxyVoteQuestion(questionData.metadata.questionid, voteType)
      .then((res) => {
        if (res.error) {
          console.error("Error voting on question: ", res.error);
          alert(`Failed to vote: ${res.error}`);
        } else {
          // Update the question data with the new vote counts
          setQuestionData({
            ...questionData,
            metadata: {
              ...questionData.metadata,
              votes_good: res.votes_good,
              votes_bad: res.votes_bad,
              votes_sum: res.votes_sum
            }
          });
          setUserVote(res.userVote);
        }
      })
      .catch((err) => {
        console.error("Error voting on question: ", err);
        alert("Something went wrong while voting");
      })
      .finally(() => {
        setVotingInProgress(false);
      });
  }

  // Render Logic
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#222222] text-white p-8">
        Loading question details...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[#222222] text-red-400 p-8 px-14">
        <h1 className="text-2xl font-bold mb-4">Error Loading Question</h1>
        <p>Could not load the question data for '{slug}'.</p>
        <p className="mt-2 font-mono bg-gray-700 p-2 rounded">Details: {error}</p>
      </div>
    );
  }
  if (!questionData) {
    return (
      <div className="min-h-screen bg-[#222222] text-yellow-400 p-8 px-14">
        Question data could not be loaded or is unavailable for '{slug}'.
      </div>
    );
  }

  const tags = getTags(questionData.metadata?.tags);
  const difficulty = difficultyLevel(questionData.metadata?.difficulty);
  const dates = {
    created: formatTimestamp(questionData.metadata?.date_created),
    updated: formatTimestamp(questionData.metadata?.date_updated),
  }
  const lang = questionData.code?.language || "Unknown/Unspecified"

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-[#222222] text-gray-200 pt-16 md:pt-4">
        <ProblemDescription
          questionData={questionData}
          tags={tags}
          difficulty={difficulty}
          language={lang}
          dates={dates}
          onVote={handleVote}
          userVote={userVote}
          votingInProgress={votingInProgress}
          session={session}
        />
        <ProblemEditor
          codeData={questionData?.code}
          editorLanguage={editorLanguage}
          setEditorLanguage={setEditorLanguage}
          editorCode={editorCode}
          setEditorCode={setEditorCode}
          language_mappings={language_mappings}
          session={session}
          questionid={questionData?.metadata?.questionid}
        />
      </div>
    </>
  )
}
