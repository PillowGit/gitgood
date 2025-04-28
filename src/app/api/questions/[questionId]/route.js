import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import {
  getQuestion,
  updateQuestion,
  deleteQuestion
} from "@/lib/database/questions";

import { getUser, updateUser } from "@/lib/database/users";

/**
 * @openapi
 * /api/questions/{questionId}:
 *   get:
 *     summary: Retrieve question data for a specific question ID.
 *     description: Retrieves all the information for the specified question.
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question to retrieve.
 *     responses:
 *       200:
 *         description: Question retrieved successfully.
 *       400:
 *         description: Missing or invalid questionId.
 *       404:
 *         description: Question not found.
 *   put:
 *     summary: Update an existing question by ID.
 *     description: Updates the question data for the specified question ID.
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               metadata:
 *                 type: object
 *               code:
 *                 type: array
 *                 items:
 *                   type: object
 *               test_cases:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Question updated successfully.
 *       400:
 *         description: Invalid input or missing questionId.
 *       404:
 *         description: Question not found.
 *       500:
 *         description: Server error.
 */
export async function GET(req, { params }) {
  const { questionId } = await params;

  if (!questionId) {
    return NextResponse.json(
      { error: "questionId is required" },
      { status: 400 }
    );
  }

  const question = await getQuestion(questionId);
  if (question?.error) {
    return NextResponse.json(
      { error: question.error || "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(question);
}

export async function PUT(req, { params }) {
  const { questionId } = await params;

  if (!questionId) {
    return NextResponse.json(
      { error: "questionId is required" },
      { status: 400 }
    );
  }

  let updatedData;
  try {
    updatedData = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Ensure question exists
  const existing = await getQuestion(questionId);
  if (existing?.error) {
    return NextResponse.json(
      { error: existing.error || "Not found" },
      { status: 404 }
    );
  }
  const session = await getServerSession({ req, ...authOptions });
  const githubId = session.user.image?.match(
    /githubusercontent\.com\/u\/(\d+)/
  )?.[1];

  if (existing.metadata.author_id !== githubId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await updateQuestion(questionId, updatedData);
    if (result?.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { questionId } = await params;
  if (!questionId) {
    return NextResponse.json(
      { error: "questionId is required" },
      { status: 400 }
    );
  }

  // 1️⃣ Ensure it exists
  const question = await getQuestion(questionId);
  if (question?.error) {
    return NextResponse.json(
      { error: question.error || "Not found" },
      { status: 404 }
    );
  }

  // 2️⃣ Delete the question doc
  const del = await deleteQuestion(questionId);
  if (del.error) {
    return NextResponse.json({ error: del.error }, { status: 500 });
  }

  // 3️⃣ Remove from the author's `created` list
  try {
    const authorId = question.metadata.author_id;
    const user = await getUser(authorId);
    if (!user.error) {
      const updatedCreated = (user.created || []).filter(
        (id) => id !== questionId
      );
      await updateUser(authorId, { created: updatedCreated });
    }
  } catch (e) {
    console.error("Failed to update user's created list:", e);
    // non-fatal: we don't block delete on this error
  }

  return NextResponse.json({ success: true });
}
