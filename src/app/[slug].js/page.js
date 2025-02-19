"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

export default function Protected() {
  const { data: session } = useSession();
  const [sampleText, setSampleText] = useState("Loading...");

  // Get github_id from session, if applicable
  const github_id = !session
    ? ""
    : session["user"]["image"].match(/githubusercontent.com\/u\/(\d+)/)[1];

  // On Mount, fetch sample_text (if applicable again)
  useEffect(() => {
    if (github_id) {
      fetch(`/api/users/sample_text?userId=${github_id}`)
        .then((res) => res.json())
        .then((data) => {
          setSampleText(data.sample_text);
        });
    } else {
      setSampleText("User not found");
    }
  }, [github_id]);

  // Form text updater
  function onFieldChange(e) {
    setSampleText(e.target.value);
  }

  // Update database with new sample_text
  function submitSampleText() {
    fetch(`/api/users/sample_text?userId=${github_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sample_text: sampleText }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert("Sample text synced with firebase");
        }
      });
  }

  if (session) {
    return (
      <div className="min-w-screen min-h-[70vh] bg-[#131313] flex justify-center items-center flex-col">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-4 rounded-full m-16 text-4xl"
        >
          Buenos días {session.user.name}
        </motion.div>
        <img src="protected.jpg" className="w-[min(50vw,50vh)] m-4" />

        {/* Going to be an input field to update sample_text */}
        <div className="flex flex-col items-center justify-center rounded-lg m-4">
          <div className="text-2xl">
            The following text is <span className="text-bold">persistent</span>{" "}
            (shoutout firebase):
          </div>
          <div className="flex flex-row align-center">
            <input
              className="w-96 h-12 text-2xl rounded-lg m-4 bg-[#131313] border border-[#4e4e4ea4]"
              value={sampleText}
              onChange={onFieldChange}
            />
            <button
              onClick={submitSampleText}
              className="h-12 m-4 text-lg border-2 border-[#4e4e4ea4] rounded-lg transition hover:scale-110 hover:bg-[#4e4e4ea4] hover:border-[#4e4e4ea4] hover:text-[#F7F7F2] cursor-pointer"
            >
              <div className="my-2 mx-4">Sync Text</div>
            </button>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="mt-8 text-lg border-2 border-[#4e4e4ea4] rounded-lg transition hover:scale-110 hover:bg-[#4e4e4ea4] hover:border-[#4e4e4ea4] hover:text-[#F7F7F2] cursor-pointer"
        >
          <div className="my-2 mx-4">Sign Out</div>
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-screen min-h-[70vh] bg-[#131313] flex justify-center items-center flex-col">
      <div className="text-2xl">You are not signed in D:</div>
      <button
        onClick={() => signIn("github")}
        className="mt-8 text-lg border-2 border-[#4e4e4ea4] rounded-lg transition hover:scale-110 hover:bg-[#4e4e4ea4] hover:border-[#4e4e4ea4] hover:text-[#F7F7F2] cursor-pointer"
      >
        <div className="my-2 mx-4">Sign In</div>
      </button>
    </div>
  );
}
