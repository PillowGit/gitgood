"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const problems = [
  {
    title: "Smallest Path Between Nodes",
    author: "David Solano",
    date: "Sept 25, 2025",
    difficulty: 4.0,
  },
  {
    title: "Create a Web Socket",
    author: "Yves Velasquez",
    date: "July 13, 2025",
    difficulty: 7.5,
  },
  {
    title: "Database SQL Training",
    author: "Esteban Escartin",
    date: "July 10, 2025",
    difficulty: 3.2,
  },
  {
    title: "HTML Basics",
    author: "Kyle Ho",
    date: "April 12, 2025",
    difficulty: 1.5,
  },
  {
    title: "Traveling Salesman",
    author: "Bruce Mckenzie",
    date: "Feb 09, 2025",
    difficulty: 8.0,
  },
];

export default function ProblemList() {
  const [search, setSearch] = useState("");

  return (
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
        {problems
          .filter((problem) =>
            problem.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((problem, index) => (
            <Card key={index} className="p-4">
              <h3 className="text-lg font-bold">{problem.title}</h3>
              <p className="text-gray-400 text-sm">
                By: {problem.author} - {problem.date}
              </p>
              <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
                Difficulty: {problem.difficulty}
              </span>
            </Card>
          ))}
      </div>
    </div>
  );
}
