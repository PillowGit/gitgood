import { Button } from "../ui/Button";

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

export default function Leaderboard() {
  return (
    <div className="bg-[#1a1a1a] w-1/3 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Global Leader Board</h2>
      <div className="space-y-4">
        {[
          { name: "David Solano", points: 4300 },
          { name: "Esteban Escartin", points: 3500 },
          { name: "Yves Velasquez", points: 3300 },
          { name: "Kyle Ho", points: 3100 },
          { name: "Terry Blant", points: 3100 },
          { name: "Terry Blant", points: 3100 },
          { name: "Terry Blant", points: 3100 },
          { name: "Terry Blant", points: 3100 },
          { name: "Terry Blant", points: 3100 },
          { name: "Terry Blant", points: 3100 },
          // Add more users...
        ].map((user, i) => (
          <div key={i} className="flex items-center space-x-3">
            <span className="text-white font-bold  w-6">{i + 1}</span>
            <img height={32} width={32} src={`/icon.svg`} />
            <div className="flex-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-400">
                Total Points: {user.points}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Button className="w-full mt-8 text-[#1152b2] bg-">View More</Button>
    </div>
  );
}
