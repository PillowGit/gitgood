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
 *              - language
 *            properties:
 *              language:
 *               type: string
 *               description: The language the code is written in.
 *              code:
 *                type: array
 *                items:
 *                  type: string
 *                description: The code submitted by the user.
 *    responses:
 *      302:
 *        description: Submission created successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                redirect_to:
 *                  type: string
 *                  description: The URL to redirect to after submission.
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
  const { questionId } = await params;
  const data = await req.json();

  // Confirm login
  const session = await getServerSession({ req, ...authOptions });
  const user_id = !session
    ? ""
    : session.user.image.match(/githubusercontent.com\/u\/(\d+)/)[1];
  const user = await getUser(user_id);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Confirm request body
  if (!data || !data.code || !data.language) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  // Get question data
  const question = await getQuestion(questionId);
  if (question.error) {
    return NextResponse.json(
      { error: `Failed to get question with id "${questionId}"` },
      { status: 400 }
    );
  }
  const question_code_data = question.code;
  if (!question_code_data) {
    return NextResponse.json(
      { error: `Question with id "${questionId}" has no code data` },
      { status: 400 }
    );
  }
  if (!Array.isArray(question_code_data)) {
    return NextResponse.json(
      { error: `Question with id "${questionId}" has invalid code data` },
      { status: 400 }
    );
  }
  const specific_code_data = question_code_data.filter(
    (code_data) => code_data.language === data.language
  );
  if (specific_code_data.length === 0) {
    return NextResponse.json(
      {
        error: `Question with id "${questionId}" has no code data for language "${data.language}"`,
      },
      { status: 400 }
    );
  }

  // Validate user code
  if (!Array.isArray(data.code)) {
    return NextResponse.json(
      { error: "Code must be an array of strings, each being a line of code" },
      { status: 400 }
    );
  }

  // Combine user code with question code
  const combined_code =
    specific_code_data[0].inputs.join("\n") +
    "\n\n" +
    data.code.join("\n") +
    "\n\n" +
    specific_code_data[0].solution.join("\n") +
    "\n\n" +
    specific_code_data[0].tester.join("\n");

  // Run the code with piston
  const response = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: data.language,
      version: "*",
      files: [{ content: combined_code }],
    }),
  });

  const result = await response.json();

  // Validate and process the result
  const submission = {
    creator_id: user_id,
    question_id: questionId,
    code: data.code,
    piston_output: undefined,
    passed: false,
    language: data.language,
  };

  if (result.error) {
    return NextResponse.json(
      { error: `Failed to run code: ${result.error}` },
      { status: 500 }
    );
  }
  if (!result.run) {
    return NextResponse.json(
      { error: "No run result in pistons response" },
      { status: 500 }
    );
  }

  if (result.run.code !== 0) {
    submission.passed = false;
  }
  if (result.run.code === 0) {
    submission.passed =
      !result.run.stderr && result.run.stdout.trim() === "all";
  }
  submission.piston_output = result.run.stderr || result.run.stdout;

  // Prepare to potentially update user data
  if (
    submission.passed &&
    user.accepted.find((id) => id === questionId) === undefined
  ) {
    console.log(user.points_accumulated);
    console.log(question.metadata.difficulty);
    await updateUser(
      user_id,
      {
        accepted: [...user.accepted, questionId],
        points_accumulated:
          user.points_accumulated + question.metadata.difficulty,
      },
      true
    );
  }

  // Add the new submission to the database
  const submissionData = await addSubmission(
    user_id,
    questionId,
    data.code,
    submission.piston_output,
    submission.passed,
    data.language
  );

  if (submissionData.error) {
    return NextResponse.json(
      {
        error: `Failed to add submission to database: ${submissionData.error}`,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      redirect_to: `https://gitgood.cc/challenge/${questionId}/${submissionData.submission_id}`,
    },
    { status: 302 }
  );
}
