"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import { getQuestion } from "@/lib/database/questions";

export default function ClientComponent() {
  const { data: session } = useSession();

  const [question_data, setQuestionData] = useState("Loading...");

  const params = useParams();
  const slug = params.slug;

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
    <>
      <div className="min-h-screen bg-[#222222] text-white p-8 px-14">
        <div>{question_data}</div>
      </div>
    </>
  );
}
