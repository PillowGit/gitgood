"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ClientComponent() {
  // Auth session
  const { data: session } = useSession();
  // User slug
  const params = useParams();
  const slug = params.slug;

  async function testQuery() {
    fetch("/api/questions/query", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        alert(JSON.stringify(data));
      });
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
