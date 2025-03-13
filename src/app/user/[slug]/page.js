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

  const [userdata, setUserdata] = useState("Loading...");

  useEffect(() => {
    fetch(`/api/users/${slug}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setUserdata("idk bro there was an error or something");
        } else {
          setUserdata(JSON.stringify(data, null, 2));
        }
      });
  }, [slug]);

  return (
    <>
      <div className="min-h-screen bg-[#222222] text-white p-8 px-14">
        <div>{userdata}</div>
      </div>
    </>
  );
}
