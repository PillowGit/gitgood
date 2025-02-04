import { motion } from "motion/react";
import Link from 'next/link';


export default function Home() {
  return <>
    <title>GitGood</title>
    <div className="w-screen min-h-screen bg-[#131313] absolute left-0 top-0 flex justify-center items-center flex-col">
      <p className="font-[#F7F7F2] font-bold text-3xl">GitGood.cc in development</p>
      <Link href={"/protected"}> PRESS HERE</Link>
      <a href="https://github.com/PillowGit/gitgood" className="font-[#F7F7F2] font-bold text-3xl mt-8 underline transition hover:font-[#C4C4C2] hover:scale-105">github.com/PillowGit/gitgood</a>
    </div>

  </>;
}
