import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

import { getUser, addUser, updateUser } from "@/lib/database/users";

async function SyncGithubUsername(userId, username) {
  const githubUserData = await fetch(
    `https://api.github.com/user/${userId}`
  );
  const githubUser = await githubUserData.json();
  if (githubUser?.login !== username) {
    await updateUser(userId, { username: githubUser.login });
    return true;
  }
  return false;
}
async function SyncGithubDisplayName(userId, display_name) {
  const githubUserData = await fetch(
    `https://api.github.com/user/${userId}`
  );
  const githubUser = await githubUserData.json();
  if (githubUser?.name !== display_name) {
    await updateUser(userId, { display_name: githubUser.name });
    return true;
  }
  return false;
}

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
    // If the user doesn't exist but is logged in, and wants their data, create them
    if (user.error && userId === github_id) {
      // Request their username from Github
      const githubUserData = await fetch(
        `https://api.github.com/user/${github_id}`
      );
      const githubUser = await githubUserData.json();
      const userData = await addUser(
        github_id,
        githubUser.login,
        session.user.name,
        session.user.image
      );
      return NextResponse.json(userData);
    // If the user doesn't exist and the person logged in is not them, return error
    } else if (user.error) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );
    // If the user exists and is logged in, update their data
    } else if (userId === github_id) {
      let updated = await SyncGithubUsername(userId, session.user.name);
      if (updated) {
        user.username = session.user.name;
      }
      updated = await SyncGithubDisplayName(userId, session.user.name);
      if (updated) {
        user.display_name = session.user.name;
      }
      return NextResponse.json(user);
    // If the user exists and is logged in, but is not them, only show public info
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
      let updated = await SyncGithubUsername(userId, user.username);
      if (updated) {
        user.username = session.user.name;
      }
      updated = await SyncGithubDisplayName(userId, user.display_name);
      if (updated) {
        user.display_name = session.user.name;
      }
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
      let updated = await SyncGithubUsername(userId, user.username);
      if (updated) {
        user.username = session.user.name;
      }
      updated = await SyncGithubDisplayName(userId, user.display_name);
      if (updated) {
        user.display_name = session.user.name;
      }
      return NextResponse.json(user);
    }
  }
}
