import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

import {
  getUser,
  addUser,
  updateUser,
  addUserChallenge
} from "@/lib/database/users";

async function SyncGithubUsername(userId, username) {
  const githubUserData = await fetch(`https://api.github.com/user/${userId}`);
  const githubUser = await githubUserData.json();
  if (githubUser?.login !== username) {
    await updateUser(userId, { username: githubUser.login });
    return true;
  }
  return false;
}
async function SyncGithubDisplayName(userId, display_name) {
  const githubUserData = await fetch(`https://api.github.com/user/${userId}`);
  const githubUser = await githubUserData.json();
  if (githubUser?.name !== display_name) {
    await updateUser(userId, { display_name: githubUser.name });
    return true;
  }
  return false;
}
/**
 * @openapi
 * /api/users/{userId}:
 *  get:
 *    summary: Retrieve user data for a specific user ID.
 *    description: |
 *      # When the request is coming from an authorized client:
 *
 *      **1. If the user doesn't exist in our database, but that user is requesting their data**
 *      - We create an account for them, return their data after finished
 *
 *      **2. If the user doesn't exist in our database, and the requester is not the person whose data they want**
 *      - Return 404. The user does not exist
 *
 *      **3. If the user exists in the database and the requester is that user**
 *      - Return to them all of their data
 *
 *      **4. If the user exists in the database, but the requester is not that user**
 *      - Send them only public data of the user
 *
 *      # When the request is coming from an unauthorized client:
 *
 *      **1. If the user doesn't exist in our database**
 *      - Return 404. The user does not exist
 *
 *      **2. If the user does exist in our database**
 *      - Send them only public data of the user
 *    parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve.
 *    responses:
 *      200:
 *        description: User retrieved successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                github_id:
 *                  type: string
 *                  description: The user's github id. Always included.
 *                username:
 *                  type: string
 *                  description: The user's username. Always included.
 *                display_name:
 *                  type: string
 *                  description: The user's display name. Always included.
 *                avatar:
 *                  type: string
 *                  description: The user's avatar URL (github url). Always included.
 *                accepted:
 *                  type: array
 *                  items:
 *                    type: string
 *                  description: The list of challenges the user has completed.
 *                created:
 *                  type: array
 *                  items:
 *                    type: string
 *                  description: The list of challenges the user has created.
 *                points_accumulated:
 *                  type: number
 *                  description: The user's total points (calculated by the sum of the difficulty rating of all accepted challenges)
 *      400:
 *        description: User ID is invalid.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: The error message.
 *      404:
 *        description: User not found.
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
      return NextResponse.json(user);
    }
  }
}

/**
 * @openapi
 * /api/users/{userId}:
 *  patch:
 *    summary: Update user settings for the authenticated user.
 *    description: Update profile settings for the authenticated user. Only works if the authenticated user is updating their own profile.
 *    parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              display_name:
 *                type: string
 *                description: Updated display name.
 *              points_are_public:
 *                type: boolean
 *                description: Whether to show points publicly.
 *              accepted_are_public:
 *                type: boolean
 *                description: Whether to show completed challenges publicly.
 *              ownership_is_public:
 *                type: boolean
 *                description: Whether to show created challenges publicly.
 *    responses:
 *      200:
 *        description: User settings updated successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  description: Indicates if the operation was successful.
 *                message:
 *                  type: string
 *                  description: Success message.
 *      400:
 *        description: Bad request or invalid input.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message.
 *      401:
 *        description: Unauthorized - User not authenticated.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message.
 *      403:
 *        description: Forbidden - User trying to modify another user's profile.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message.
 *      404:
 *        description: User not found.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message.
 */
export async function PATCH(req, { params }) {
  const { userId } = await params;

  // Ensure request is valid
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  // Get session info to authenticate the user
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // Extract github_id from the user's image URL
  const github_id = session.user.image.match(/githubusercontent.com\/u\/(\d+)/)[1];

  // Verify that the user is updating their own profile
  if (userId !== github_id) {
    return NextResponse.json(
      { error: "User can only update their own profile" },
      { status: 403 }
    );
  }

  try {
    // Parse the request body to get the updated settings
    const updateData = await req.json();
    const allowedFields = [
      "display_name",
      "points_are_public",
      "accepted_are_public",
      "ownership_is_public"
    ];

    // Filter to only include allowed fields
    const sanitizedData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        // Skip undefined values completely
        if (updateData[key] === undefined) return obj;

        // Empty strings should be converted to null for Firebase
        obj[key] = updateData[key] === "" ? null : updateData[key];
        return obj;
      }, {});

    if (Object.keys(sanitizedData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Update the user data in the database
    await updateUser(userId, sanitizedData);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
