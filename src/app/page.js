'use client';

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";

export function Card({ children, className }) {
  return <div className={`p-4 border rounded bg-gray-800 ${className}`}>{children}</div>;
}

export function Button({ children, className, ...props }) {
  return <button className={`px-4 py-2 bg-blue-500 text-white rounded ${className}`} {...props}>{children}</button>;
}

export function Input({ className, ...props }) {
  return <input className={`p-2 border rounded bg-gray-700 text-white ${className}`} {...props} />;
}

export default function Home() {
  const [search, setSearch] = useState("");

  const problems = [
    { title: "Smallest Path Between Nodes", author: "David Solano", date: "Sept 25, 2025", difficulty: 4.0 },
    { title: "Create a Web Socket", author: "Yves Velasquez", date: "July 13, 2025", difficulty: 7.5 },
    { title: "Database SQL Training", author: "Esteban Escartin", date: "July 10, 2025", difficulty: 3.2 },
    { title: "HTML Basics", author: "Kyle Ho", date: "April 12, 2025", difficulty: 1.5 },
    { title: "Traveling Salesman", author: "Bruce Mckenzie", date: "Feb 09, 2025", difficulty: 8.0 },
  ];

  const leaderboard = [
    { name: "David Solano", points: 4300 },
    { name: "Mike Chen", points: 3600 },
    { name: "Terry Blant", points: 3100 },
    { name: "Courtney Frayse", points: 3050 },
    { name: "Teresa Cianne", points: 3000 },
    { name: "John Doe", points: 2990 },
    { name: "Adam Whitsty", points: 2800 },
    { name: "Leo Cuul", points: 2750 },
    { name: "Nancy Maguel", points: 2600 },
    { name: "Calton Johnson", points: 2500 },
  ];

  return (
    <div className="min-h-screen bg-[#131313] text-white p-6">
      <header className="flex justify-between items-center p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">GitGood</h1>
        <nav>
          <Link href="#" className="mr-4">Problems</Link>
          <Link href="#" className="mr-4">My Set</Link>
          <Link href="#" className="mr-4">Create</Link>
          <Link href="#" className="underline">Sign in with GitHub</Link>
        </nav>
      </header>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Featured Problems</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card className="h-32">Two Sum</Card>
          <Card className="h-32">Pillow's Quest</Card>
          <Card className="h-32">Pillow's Quest Two</Card>
        </div>
      </div>

      <div className="mt-8 flex">
        <div className="w-2/3 pr-6">
          <div className="flex justify-between mb-4">
            <Button className="bg-gray-700">Filters</Button>
            <Input
              type="text"
              placeholder="Search problems"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-1/2"
            />
          </div>
          <div className="space-y-4">
            {problems.map((problem, index) => (
              <Card key={index} className="p-4">
                <h3 className="text-lg font-bold">{problem.title}</h3>
                <p className="text-gray-400 text-sm">By: {problem.author} - {problem.date}</p>
                <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded">Difficulty: {problem.difficulty}</span>
              </Card>
            ))}
          </div>
        </div>

        <div className="w-1/3 bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-4">Global Leader Board</h3>
          <ul>
            {leaderboard.map((user, index) => (
              <li key={index} className="flex justify-between py-2 border-b border-gray-700">
                <span>{index + 1}. {user.name}</span>
                <span>{user.points} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
