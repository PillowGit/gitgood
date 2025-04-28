import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { getQuestion, updateQuestion } from "@/lib/database/questions";
import { getUser, updateUser } from "@/lib/database/users";

/**
 * @openapi
 * /api/questions/{questionId}/vote:
 *   post:
 *     summary: Vote on a question
 *     description: Submit an upvote or downvote on a specific question
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question to vote on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - voteType
 *             properties:
 *               voteType:
 *                 type: string
 *                 enum: [up, down]
 *                 description: Type of vote (up or down)
 *     responses:
 *       200:
 *         description: Vote recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 votes_good:
 *                   type: number
 *                   description: The new count of upvotes
 *                 votes_bad:
 *                   type: number
 *                   description: The new count of downvotes
 *                 votes_sum:
 *                   type: number
 *                   description: The new total of votes (upvotes - downvotes)
 *       400:
 *         description: Invalid request or missing required fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
export async function POST(req, { params }) {
  // Extract questionId from params
  const { questionId } = await params;

  // Authentication check
  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json(
      { error: "You must be signed in to vote" },
      { status: 401 }
    );
  }

  // Get user ID from session
  const userId = session.user.image.match(/githubusercontent.com\/u\/(\d+)/)[1];
  if (!userId) {
    return NextResponse.json(
      { error: "Could not determine user ID" },
      { status: 401 }
    );
  }

  // Get user data to check if they've already voted
  const user = await getUser(userId);
  if (user?.error) {
    return NextResponse.json(
      { error: "Failed to retrieve user data" },
      { status: 500 }
    );
  }

  // Initialize voted structure if it doesn't exist
  const userVotes = user.voted || {};

  // Parse request body
  try {
    const data = await req.json();
    const { voteType } = data;

    // Validate vote type
    if (!voteType || !["up", "down", "none"].includes(voteType)) {
      return NextResponse.json(
        { error: "Invalid vote type. Must be 'up', 'down', or 'none'" },
        { status: 400 }
      );
    }

    // Get the question
    const question = await getQuestion(questionId);
    if (question?.error) {
      return NextResponse.json(
        { error: question.error || "Question not found" },
        { status: 404 }
      );
    }

    const updatedMetadata = { ...question.metadata };
    // Check if the user has already voted on this question
    if (userVotes[questionId]) {
      const previousVote = userVotes[questionId];

      // If they're voting the same way again, remove their vote
      if (voteType === previousVote || voteType === "none") {
        // Remove the previous vote count
        if (previousVote === "up") {
          updatedMetadata.votes_good = Math.max(0, (updatedMetadata.votes_good || 0) - 1);
        } else if (previousVote === "down") {
          updatedMetadata.votes_bad = Math.max(0, (updatedMetadata.votes_bad || 0) - 1);
        }

        // Remove their vote record
        delete userVotes[questionId];

        // If explicit "none" was passed, don't add a new vote
        if (voteType === "none") {
          // Calculate sum
          updatedMetadata.votes_sum = updatedMetadata.votes_good + updatedMetadata.votes_bad;

          // Update the question with new vote counts
          const updatedQuestion = { ...question, metadata: updatedMetadata };
          const result = await updateQuestion(questionId, updatedQuestion);

          if (result?.error) {
            return NextResponse.json(
              { error: result.error },
              { status: 500 }
            );
          }

          // Update user's voting record
          await updateUser(userId, { voted: userVotes });

          // Return updated vote counts with no userVote (vote removed)
          return NextResponse.json({
            votes_good: updatedMetadata.votes_good,
            votes_bad: updatedMetadata.votes_bad,
            votes_sum: updatedMetadata.votes_sum,
            userVote: null
          });
        }
      } else {
        // They're changing their vote
        // Remove the previous vote count
        if (previousVote === "up") {
          updatedMetadata.votes_good = Math.max(0, (updatedMetadata.votes_good || 0) - 1);
        } else if (previousVote === "down") {
          updatedMetadata.votes_bad = Math.max(0, (updatedMetadata.votes_bad || 0) - 1);
        }
      }
    }

    // Add the new vote
    if (voteType === "up") {
      updatedMetadata.votes_good = (updatedMetadata.votes_good || 0) + 1;
    } else if (voteType === "down") {
      updatedMetadata.votes_bad = (updatedMetadata.votes_bad || 0) + 1;
    }

    // Calculate sum
    updatedMetadata.votes_sum = updatedMetadata.votes_good + updatedMetadata.votes_bad;

    // Update the question with new vote counts
    const updatedQuestion = { ...question, metadata: updatedMetadata };
    const result = await updateQuestion(questionId, updatedQuestion);

    if (result?.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Record the user's vote
    userVotes[questionId] = voteType;
    await updateUser(userId, { voted: userVotes });

    // Return updated vote counts
    return NextResponse.json({
      votes_good: updatedMetadata.votes_good,
      votes_bad: updatedMetadata.votes_bad,
      votes_sum: updatedMetadata.votes_sum,
      userVote: voteType
    });

  } catch (error) {
    return NextResponse.json(
      { error: `Failed to process vote: ${error.message}` },
      { status: 500 }
    );
  }
}
