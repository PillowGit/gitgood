// Next Route Handling
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Database functions
import {
  validateQuestionData,
  getBaseQuestionData,
  addQuestion,
} from "@/lib/database/questions";
import { getUser } from "@/lib/database/users";

/**
 * @openapi
 * /api/questions/create:
 *  post:
 *    summary: Create a new coding question.
 *    description: Adds a new coding question to the database.
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - description
 *              - metadata
 *              - code
 *              - test_cases
 *            properties:
 *              description:
 *                type: string
 *                description: The full description for the question.
 *              metadata:
 *                type: object
 *                required:
 *                  - title
 *                  - difficulty_votes
 *                  - tags
 *                  - languages
 *                  - display_publicly
 *                properties:
 *                  title:
 *                    type: string
 *                    description: The title of the question.
 *                  difficulty_votes:
 *                    type: number
 *                    description: User input rating from 0.0 to 10.0.
 *                  difficulty_sum:
 *                    type: number
 *                    description: The sum of difficulty ratings (default 1).
 *                  tags:
 *                    type: array
 *                    items:
 *                      type: string
 *                    description: Array of tags (must be valid tags from a predefined list).
 *                  languages:
 *                    type: array
 *                    items:
 *                      type: string
 *                    description: Array of supported programming languages.
 *                  display_publicly:
 *                    type: boolean
 *                    description: Whether the question is publicly visible.
 *              code:
 *                type: object
 *                required:
 *                  - language
 *                  - inputs
 *                  - template
 *                  - solution
 *                  - tester
 *                properties:
 *                  language:
 *                    type: string
 *                    description: The programming language of the code snippet.
 *                  inputs:
 *                    type: array
 *                    items:
 *                      type: string
 *                    description: Array of input lines for the coding challenge.
 *                  template:
 *                    type: array
 *                    items:
 *                      type: string
 *                    description: Array of template lines for the coding challenge.
 *                  solution:
 *                    type: array
 *                    items:
 *                      type: string
 *                    description: Array of solution lines for the coding challenge.
 *                  tester:
 *                    type: array
 *                    items:
 *                      type: string
 *                    description: Array of tester lines for the coding challenge.
 *              test_cases:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    ANSWER:
 *                      type: string
 *                      description: The expected output of the test case.
 *                    key:
 *                      type: string
 *                      description: Key-value pairs representing inputs and expected outputs.
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
 *        description: Invalid request body or missing required fields.
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

async function fetchGithubUserData(userId) {
  const githubUserResponse = await fetch(
    `https://api.github.com/user/${userId}`
  );
  return await githubUserResponse.json();
}

export async function POST(req) {
  try {
    const data = await req.json(); // Body data

    // User session authentication
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const github_id = session.user.image.match(
      /githubusercontent.com\/u\/(\d+)/
    )[1];

    // Check if user exists in database
    const user = await getUser(github_id);
    if (!user) {
      return NextResponse.json(
        { error: "User account data not found" },
        { status: 400 }
      );
    }

    const githubUser = await fetchGithubUserData(github_id);

    // Validate required fields in request body
    if (
      !data.description ||
      !data.metadata ||
      !data.metadata.title ||
      typeof data.metadata.difficulty_votes !== "number" ||
      typeof data.metadata.difficulty_sum !== "number" ||
      !Array.isArray(data.metadata.tags) ||
      !Array.isArray(data.metadata.languages) ||
      typeof data.metadata.display_publicly !== "boolean" ||
      !data.code ||
      typeof data.code.language !== "string" ||
      !Array.isArray(data.code.inputs) ||
      !Array.isArray(data.code.template) ||
      !Array.isArray(data.code.solution) ||
      !Array.isArray(data.code.tester) ||
      !Array.isArray(data.test_cases)
    ) {
      return NextResponse.json(
        { error: "Invalid or missing fields in request body" },
        { status: 400 }
      );
    }

    // Create a tags object
    const baseQuestionData = getBaseQuestionData();
    data.metadata.tags.forEach((tag) => {
      if (tag in baseQuestionData.metadata.tags) {
        baseQuestionData.metadata.tags[tag] = true;
      }
    });

    // Populate base question data
    const questionData = {
      ...baseQuestionData,
      description: data.description,
      metadata: {
        ...baseQuestionData.metadata,
        ...data.metadata,
        tags: baseQuestionData.metadata.tags,
        author_id: github_id,
        author_name: githubUser.login,
        difficulty:
          data.metadata.difficulty_sum / data.metadata.difficulty_votes,
      },
      code: [data.code], // Only one code object initially
      test_cases: data.test_cases,
    };

    // Validate question data
    const validationError = validateQuestionData(questionData);
    if (!validationError.status) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Add question to database
    const addedQuestion = await addQuestion(questionData);

    // Return the question ID upon success
    return NextResponse.json(
      { questionId: addedQuestion.metadata.questionid },
      { status: 201 }
    );
  } catch (e) {
    console.error("/api/questions/create server error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
