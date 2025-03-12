import { NextResponse } from "next/server";

import { topTenUsers } from "@/lib/database/users";

/**
 * @openapi
 * /api/users/leaderboard:
 *  get:
 *    summary: Retrieve the top 10 users sorted by points.
 *    description: Retrieve the top 10 users sorted by points. Ignores everyone who has their points set to public.
 *    responses:
 *      200:
 *        description: Leaderboard retrieved successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  github_id:
 *                    type: string
 *                    description: The user's github id. Always included.
 *                  display_name:
 *                    type: string
 *                    description: The user's display name. Always included.
 *                  avatar:
 *                    type: string
 *                    description: The user's avatar URL (github url). Always included.
 *                  points_accumulated:
 *                    type: number
 *                    description: The user's total points (calculated by the sum of the difficulty rating of all accepted challenges)
 *      400:
 *        description: There was an error retrieving the leaderboard.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: The error message.
 */
export async function GET(req, { params }) {
  const topUsers = await topTenUsers();
  if (topUsers.error) {
    return NextResponse.error({ error: topUsers.error });
  }
  // Filter out unused data before returning
  const filteredUsers = topUsers.map((user) => {
    const { github_id, display_name, avatar, points_accumulated } = user;
    return { github_id, display_name, avatar, points_accumulated };
  });
  return NextResponse.json(filteredUsers);
}
