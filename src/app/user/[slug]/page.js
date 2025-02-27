"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import { getDefaultQuery, makeQuery } from "@/lib/proxies/queries";

import { getBaseQuestionData } from "@/lib/database/questions";
import { deepCopy } from "@/lib/utilities";

export default function ClientComponent() {
  // Auth session
  const { data: session } = useSession();
  // User slug
  const params = useParams();
  const slug = params.slug;

  async function testQuery() {
    const default_query_options = getDefaultQuery();
    default_query_options.limit = 5;
    default_query_options.difficulty = "easy";
    const tags = Object.keys(deepCopy(getBaseQuestionData().metadata.tags));
    tags.push("");
    const orderings = ["difficulty", "votes", "updated", "created"];

    // Have this generate "create new index" links for each combination of tag and ordering

    // For each tag
    for (const tag of tags) {
      // For each ordering
      for (const ordering of orderings) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const options = deepCopy(default_query_options);
        options.filter_tag = tag;
        options.order_by = ordering;
        const response = await makeQuery(options);
      }
    }

    alert("all done");

    return;
    const response = await makeQuery(query_options);

    if (response.error) {
      alert(response.error);
      return;
    } else {
      let str = "Query Results:\n";
      let i = 1;
      for (const question of response) {
        str += `${i++}. ${question.questionid}\n`;
      }
      alert(str);
    }
  }

  async function testQuestion() {
    fetch("/api/questions/5~Csvu", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        alert(JSON.stringify(data));
      });
  }

  const [userdata, setUserdata] = useState("Loading...");

  useEffect(() => {
    fetch(`/api/users/${slug}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setUserdata(JSON.stringify(data));
      });
  }, [slug]);

  return (
    <>
      <div className="min-h-screen bg-[#222222] text-white p-8 px-14">
        <button
          className="h-12 m-4 text-lg border-2 border-[#4e4e4ea4] rounded-lg transition hover:scale-110 hover:bg-[#4e4e4ea4] hover:border-[#4e4e4ea4] hover:text-[#F7F7F2] cursor-pointer"
          onClick={testQuery}
        >
          <div className="my-2 mx-4">Test Query Function</div>
        </button>
        <button
          className="h-12 m-4 text-lg border-2 border-[#4e4e4ea4] rounded-lg transition hover:scale-110 hover:bg-[#4e4e4ea4] hover:border-[#4e4e4ea4] hover:text-[#F7F7F2] cursor-pointer"
          onClick={testQuestion}
        >
          <div className="my-2 mx-4">Test Question Fetch</div>
        </button>
        <div>{userdata}</div>
      </div>
    </>
  );
}
