import { Card } from "@/components/ui/Card";
import { getFeaturedQuestions } from "@/lib/proxies/featured";
import Link from "next/link";
import { useState } from "react";

export default function FeaturedProblems() {
  const [questions, setQuestions] = useState([
    {
      title: "???",
      author: "Unknown",
      image: "/gray.png",
    },
    {
      title: "???",
      author: "Unknown",
      image: "/gray.png",
    },
    {
      title: "???",
      author: "Unknown",
      image: "/gray.png",
    },
  ]);

  getFeaturedQuestions().then((questions) => {
    for (let i = 0; i < questions.length; i++) {
      if (questions[i]) {
        questions[i].image = "/featured.jpg";
        questions[i].author = questions[i].author_name;
      }
    }
    setQuestions(questions);
  });

  return (
    <section className="mb-12">
      <h2 className="text-2xl mt-6 mb-4">Featured Problems</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {questions.map((problem, i) => (
          <Link href={`/challenge/${problem.questionid}`} key={i}>
            <Card
              key={i}
              className="bg-[#282828] border-none transition hover:scale-[103%] hover:shadow-lg focus:scale-[103%] focus:shadow-lg"
            >
              <div className="p-0 bg-[#282828]">
                <img
                  src={problem.image || "@/icon.svg"}
                  alt={problem.title}
                  width={300}
                  height={200}
                  className="h-fit w-fit rounded-lg"
                />
              </div>
              <div className="bg-[#282828] pt-2">
                <h3 className="text-xl font-medium">{problem.title}</h3>
                <p className="text-sm text-gray-400">
                  Created by: {problem.author}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
