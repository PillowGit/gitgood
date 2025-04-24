import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { getQuestion } from "@/lib/database/questions";
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
