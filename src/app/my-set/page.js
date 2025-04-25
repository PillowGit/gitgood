"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function MySet() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const githubId = session?.user?.image?.match(
      /githubusercontent\.com\/u\/(\d+)/
    )?.[1];
    if (!githubId) {
      setError("Could not determine your GitHub ID");
      setLoading(false);
      return;
    }

    async function loadMyQuestions() {
      try {
        const userRes = await fetch(`/api/users/${githubId}`);
        if (!userRes.ok) throw new Error("Failed to load user");
        const userData = await userRes.json();
        const createdIds = userData.created || [];

        if (createdIds.length === 0) {
          setQuestions([]);
          return;
        }

        const qs = await Promise.all(
          createdIds.map((qid) =>
            fetch(`/api/questions/${qid}`).then((r) => {
              if (!r.ok) throw new Error(`Couldn’t load question ${qid}`);
              return r.json();
            })
          )
        );
        setQuestions(qs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMyQuestions();
  }, [status, session, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#222222] text-white p-8 px-14">
        <p>Loading your problems…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#222222] text-white p-8 px-14">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222222] text-white p-8 px-14">
      <h1 className="text-3xl font-bold mb-6">My Created Problems</h1>

      {questions.length === 0 ? (
        <p>You haven’t created any problems yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {questions.map((q) => (
            <div
              key={q.metadata.questionid}
              className="bg-[#333] rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {q.metadata.title}
                </h2>
                <p className="text-sm line-clamp-3 mb-4">{q.description}</p>
              </div>

              <div className="mt-auto">
                <Link href={`/my-set/${q.metadata.questionid}`}>
                  <div className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded">
                    Edit
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
