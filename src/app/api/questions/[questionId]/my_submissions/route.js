import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { getQuestion } from "@/lib/database/questions";
import { getUser } from "@/lib/database/users";
import { querySubmissions } from "@/lib/database/submissions";

/**
 * @openapi
 * /api/questions/{questionId}/my_submissions:
 *  get:
 *    summary: Queries your last 100 submissions
 *    description: Gets a list of the last 10 submissions for a question you've made for a specific question.
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: questionId
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the question to submit.
 *    responses:
 *      200:
 *        description: Query Successful. Returns the list of submissions.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                submissions:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      submission_id:
 *                        type: string
 *                        description: The ID of the submission.
 *                      question_id:
 *                        type: string
 *                        description: The ID of the question.
 *                      creator_id:
 *                        type: string
 *                        description: The ID of the user who created the submission.
 *                      code:
 *                        type: array
 *                        items:
 *                          type: string
 *                        description: The code submitted by the user.
 *                      piston_output:
 *                        type: string
 *                        description: The output of the code.
 *                      passed:
 *                        type: boolean
 *                        description: Whether the code passed the test cases.
 *                  description: The list of submissions made by the user.
 *      400:
 *        description: Invalid request or missing path parameter.
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
export async function GET(req, { params }) {
  const { questionId } = await params;

  // Ensure request is valid
  if (!questionId) {
    return NextResponse.json(
      { error: "questionId is required" },
      { status: 400 }
    );
  }

  // Confirm login
  const session = await getServerSession({ req, ...authOptions });
  const user_id = !session
    ? ""
    : session.user.image.match(/githubusercontent.com\/u\/(\d+)/)[1];
  const user = await getUser(user_id);
  if (!user || user.error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const question = await getQuestion(questionId);
  if (question.error) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const submissions = await querySubmissions(questionId, user_id);
  if (submissions.error) {
    return NextResponse.json(
      { error: "Failed to get submissions" },
      { status: 500 }
    );
  }

  return NextResponse.json({ submissions }, { status: 200 });
}
