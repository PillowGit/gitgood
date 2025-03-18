import Link from "next/link";
import { useState, useEffect } from "react";
import { proxyGetLeaderboard } from "@/lib/proxies/leaderboard";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([{ name: "???", points: 0 }]);

  useEffect(() => {
    proxyGetLeaderboard().then((data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].name = data[i].display_name;
        data[i].points = data[i].points_accumulated;
      }
      setLeaderboard(data);
    });
  }, []);

  return (
    <div className="bg-[#1a1a1a] sm:w-1/3 w-full rounded-lg p-4 mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Global Leader Board
      </h2>
      <div className="space-y-4">
        {leaderboard.map((user, i) => (
          <Link
            href={`/user/${user.github_id}`}
            key={i}
            className="flex items-center justify-between sm:space-x-4 space-x-2 transition hover:scale-[102%] focus:scale-105 group"
          >
            <span className="text-white font-bold w-6">{i + 1}</span>
            <img height={32} width={32} src={`/icon.svg`} />
            <div className="flex-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-400">
                Total Points: {user.points}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
