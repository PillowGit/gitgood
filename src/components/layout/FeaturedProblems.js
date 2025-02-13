import { Card } from "@/components/ui/Card";

export default function FeaturedProblems() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mt-6 mb-2">Featured Problems</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Two Sum",
            author: "Yves Velasquez",
            image: "/featured.jpg",
          },
          {
            title: "Pillow's Quest",
            author: "Esteban Escartin",
            image: "/featured.jpg",
          },
          {
            title: "Pillow's Quest Two",
            author: "David Solano",
            image: "/featured.jpg",
          },
        ].map((problem, i) => (
          <Card key={i} className="bg-[#282828] border-none">
            <div className="p-0 bg-[#282828]">
              <img
                src={problem.image || "@/icon.svg"}
                alt={problem.title}
                width={300}
                height={200}
                className="w-full object-cover rounded-lg"
              />
            </div>
            <div className="bg-[#282828] pt-2">
              <h3 className="text-xl font-medium">{problem.title}</h3>
              <p className="text-sm text-gray-400">
                Created by: {problem.author}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
