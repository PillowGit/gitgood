import Link from 'next/link';


export default function Home() {
  return <>
    <title>GitGood</title>
    <div className="min-w-screen min-h-screen bg-[#131313] absolute left-0 top-0 flex justify-center items-center flex-col">
      <p className="font-[#F7F7F2] font-bold text-3xl">GitGood.cc in development</p>
      <a href="https://github.com/PillowGit/gitgood" className="font-[#F7F7F2] font-bold text-3xl mt-8 underline transition hover:font-[#C4C4C2] hover:scale-105">github.com/PillowGit/gitgood</a>
      <Link href="/protected"
      className="mt-8 border-2 border-[#4e4e4ea4] rounded-lg transition hover:scale-110 hover:bg-[#4e4e4ea4] hover:border-[#4e4e4ea4] hover:text-[#F7F7F2] cursor-pointer"
      >
        <div className="my-2 mx-4">View Login Page</div>
      </Link>
    </div>
  </>;
}
