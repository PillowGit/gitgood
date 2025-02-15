"use client";

import Link from "next/link";

export default function Home() {
  async function test() {
    const id = "104609738";
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        alert(JSON.stringify(data));
      });
  }

  return (
    <>
      <title>GitGood</title>
      <div className="w-screen min-h-[70vh] bg-[#131313] flex justify-center items-center flex-col">
        <p className="font-[#F7F7F2] font-bold text-3xl">
          GitGood.cc in development
        </p>
        <a
          href="https://github.com/PillowGit/gitgood"
          className="font-[#F7F7F2] font-bold text-xl mt-8 underline transition hover:font-[#C4C4C2] hover:scale-105"
        >
          github.com/PillowGit/gitgood
        </a>
        <Link
          href="/protected"
          className="mt-8 border-2 border-[#4e4e4ea4] rounded-lg transition hover:scale-110 hover:bg-[#4e4e4ea4] hover:border-[#4e4e4ea4] hover:text-[#F7F7F2] cursor-pointer"
        >
          <div className="my-2 mx-4">View Login Page</div>
        </Link>

        <div
          className="mt-8 border-2 border-[#4e4e4ea4] rounded-lg transition hover:scale-110 hover:bg-[#4e4e4ea4] hover:border-[#4e4e4ea4] hover:text-[#F7F7F2] cursor-pointer"
          role="button"
          tabIndex="0"
          aria-pressed="false"
          onClick={test}
        >
          <h3 className="my-2 mx-4">Test Shit</h3>
        </div>
      </div>
    </>
  );
}
