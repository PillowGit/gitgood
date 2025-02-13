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
    <div className="w-1/3 bg-gray-900 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Global Leaderboard</h3>
      <ul>
        {leaderboard.map((user, index) => (
          <li
            key={index}
            className="flex justify-between py-2 border-b border-gray-700"
          >
            <span>
              {index + 1}. {user.name}
            </span>
            <span>{user.points} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
