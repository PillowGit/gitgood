import { NextResponse } from "next/server";
import { createQuestion } from "@/lib/database/questions";

/**
 * @openapi
 * /api/questions:
 *  post:
 *    summary: Create a new question.
 *    description: Adds a new coding question to the database.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              description:
 *                type: string
 *                description: The full description for the question.
 *              code:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    language:
 *                      type: string
 *                      description: The language the code is written in.
 *                    inputs:
 *                      type: array
 *                      items:
 *                        type: string
 *                    template:
 *                      type: array
 *                      items:
 *                        type: string
 *                    solution:
 *                      type: array
 *                      items:
 *                        type: string
 *                    tester:
 *                      type: array
 *                      items:
 *                        type: string
 *              test_cases:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    ANSWER:
 *                      type: string
 *                    key:
 *                      type: string
 *              metadata:
 *                type: object
 *                properties:
 *                  title:
 *                    type: string
 *                  author_id:
 *                    type: string
 *                  author_name:
 *                    type: string
 *                  display_publicly:
 *                    type: boolean
 *                  languages:
 *                    type: array
 *                    items:
 *                      type: string
 *    responses:
 *      201:
 *        description: Question created successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                questionId:
 *                  type: string
 *                  description: The ID of the newly created question.
 *      400:
 *        description: Invalid request body.
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
export async function POST(req) {
  try {
    const body = await req.json();

    // Validate required fields
    if (
      !body.description ||
      !body.metadata?.title ||
      !body.metadata?.author_id
    ) {
      return NextResponse.json(
        { error: "Missing required fields (description, title, or author_id)" },
        { status: 400 }
      );
    }

    // Save the new question in the database
    const newQuestion = await createQuestion(body);

    return NextResponse.json({ questionId: newQuestion.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
