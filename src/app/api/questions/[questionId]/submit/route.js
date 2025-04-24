import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { getQuestion } from "@/lib/database/questions";
import { addSubmission } from "@/lib/database/submissions";
import { getUser, updateUser } from "@/lib/database/users";

/**
 * @openapi
 * /api/questions/{questionId}/submit:
 *  post:
 *    summary: Submits a coding question
 *    description: Submits a coding question and returns the result.
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: questionId
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the question to submit.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - code
 *            properties:
 *              code:
 *                type: array
 *                items:
 *                  type: string
 *                description: The code submitted by the user.
 *    responses:
 *      201:
 *        description: Submission created successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                submission_id:
 *                  type: string
 *                  description: The ID of the created submission.
 *      400:
 *        description: Invalid request or missing required fields.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *      401:
 *        description: Unauthorized. User session is required.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *      500:
 *        description: Internal server error.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 */
export async function POST(req, { params }) {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
