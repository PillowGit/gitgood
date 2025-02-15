import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

import { getUser, addUser } from "@/lib/database/users";

export async function GET(req, { params }) {
  const { userId } = await params;

  // Ensure request is valid
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  // Get session info
  const session = await getServerSession({ req, ...authOptions });
  const github_id = !session
    ? ""
    : session.user.image.match(/githubusercontent.com\/u\/(\d+)/)[1];

  // First, get user data
  const user = await getUser(userId);

  // Check if user is logged in
  if (github_id) {
    // If they are logged in but their data doesn't exist, create it
    // Otherwise, if they requested an invalid user, return error
    // Finally, if all is right, they are authorized to see all their data
    if (user.error && userId === github_id) {
      const userData = await addUser(
        github_id,
        session.user.name,
        session.user.name,
        session.user.image
      );
      return NextResponse.json(userData);
    } else if (user.error) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );
    } else {
      return NextResponse.json(user);
    }
  } else {
    // If they are not logged in and user doesn't exist, return error
    // Otherwise only show them public info
    if (user.error) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );
    } else {
      // Delete fields based off settings
      if (!user.ownership_is_public) {
        delete user.created;
      }
      if (!user.points_are_public) {
        delete user.points_accumulated;
      }
      if (!user.accepted_are_public) {
        delete user.accepted;
      }
      // Never used publicly
      delete user.attempted;
      delete user.can_create;
      // Settings are not public
      delete user.ownership_is_public;
      delete user.points_are_public;
      delete user.accepted_are_public;
      return NextResponse.json(user);
    }
  }
}
