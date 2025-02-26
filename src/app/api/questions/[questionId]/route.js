import { NextResponse } from "next/server";

import { getQuestion } from "@/lib/database/questions";

/**
 * @openapi
 * /api/questions/{questionId}:
 *  get:
 *    summary: Retrieve question data for a specific question ID.
 *    description: Retrives all the information for the specified question
 *    parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question to retrieve.
 *    responses:
 *      200:
 *        description: Question retrieved successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                description:
 *                  type: string
 *                  description: The full description for the question.
 *                code:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      language:
 *                        type: string
 *                        description: The language the code is written in.
 *                      inputs:
 *                        type: array
 *                        items:
 *                          type: string
 *                          description: Lines of code that define the "input" section of a code challenge.
 *                      template:
 *                        type: array
 *                        items:
 *                          type: string
 *                          description: Lines of code that define the "template" section of a code challenge. This is the code that the user will modify.
 *                      solution:
 *                        type: array
 *                        items:
 *                          type: string
 *                          description: Lines of code that define the "solution" section of a code challenge. This is the correct answer.
 *                      tester:
 *                        type: array
 *                        items:
 *                          type: string
 *                          description: Lines of code that define the "tester" section of a code challenge. This is the code that will test the user's solution and compare with the solution.
 *                test_cases:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      ANSWER:
 *                        type: string
 *                        description: The expected output of the test case.
 *                      key:
 *                        type: string
 *                        description: Other key-value pairs exist, where the key can be any string. The value associated with these other keys are also strings.
 *                metadata:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                      description: The title of the question.
 *                    difficulty_sum:
 *                      type: number
 *                      description: The sum of the difficulty ratings of the question.
 *                    difficulty_votes:
 *                      type: number
 *                      description: The amount of difficulty ratings given to the question.
 *                    difficulty:
 *                      type: number
 *                      description: The average difficulty rating of the question.
 *                    votes_bad:
 *                      type: number
 *                      description: The downvotes given to the question.
 *                    votes_good:
 *                      type: number
 *                      description: The upvotes given to the question.
 *                    votes_sum:
 *                      type: number
 *                      description: The total votes given to the question.
 *                    questionid:
 *                      type: string
 *                      description: The ID of the question.
 *                    display_publicly:
 *                      type: boolean
 *                      description: Whether the question is public.
 *                    author_id:
 *                      type: string
 *                      description: The ID of the author of the question.
 *                    author_name:
 *                      type: string
 *                      description: The name of the author of the question.
 *                    languages:
 *                      type: array
 *                      items:
 *                        type: string
 *                      description: The available coding languages for the question.
 *                    date_created:
 *                      type: object
 *                      properties:
 *                        seconds:
 *                          type: number
 *                          description: The number of seconds since the epoch.
 *                        nanoseconds:
 *                          type: number
 *                          description: The number of nanoseconds since the epoch.
 *                    date_updated:
 *                      type: object
 *                      properties:
 *                        seconds:
 *                          type: number
 *                          description: The number of seconds since the epoch.
 *                        nanoseconds:
 *                          type: number
 *                          description: The number of nanoseconds since the epoch.
 *                    tags:
 *                      type: object
 *                      properties:
 *                        array:
 *                          type: boolean
 *                          description: The array tag.
 *                        string:
 *                          type: boolean
 *                          description: The string tag.
 *                        hash_table:
 *                          type: boolean
 *                          description: The hash_table tag.
 *                        dp:
 *                          type: boolean
 *                          description: The dp tag.
 *                        math:
 *                          type: boolean
 *                          description: The math tag.
 *                        sorting:
 *                          type: boolean
 *                          description: The sorting tag.
 *                        greedy:
 *                          type: boolean
 *                          description: The greedy tag.
 *                        dfs:
 *                          type: boolean
 *                          description: The dfs tag.
 *                        bfs:
 *                          type: boolean
 *                          description: The bfs tag.
 *                        binary_search:
 *                          type: boolean
 *                          description: The binary search tag.
 *                        matrix:
 *                          type: boolean
 *                          description: The matrix tag.
 *                        tree:
 *                          type: boolean
 *                          description: The tree tag.
 *                        bit_manipulation:
 *                          type: boolean
 *                          description: The bit manipulation tag.
 *                        two_pointer:
 *                          type: boolean
 *                          description: The two pointer tag.
 *                        heap:
 *                          type: boolean
 *                          description: The heap tag.
 *                        stack:
 *                          type: boolean
 *                          description: The stack tag.
 *                        graph:
 *                          type: boolean
 *                          description: The graph tag.
 *                        sliding_window:
 *                          type: boolean
 *                          description: The sliding window tag.
 *                        back_tracking:
 *                          type: boolean
 *                          description: The back tracking tag.
 *                        linked_list:
 *                          type: boolean
 *                          description: The linked list tag.
 *                        set:
 *                          type: boolean
 *                          description: The set tag.
 *                        queue:
 *                          type: boolean
 *                          description: The queue tag.
 *                        memo:
 *                          type: boolean
 *                          description: The memo tag.
 *                        recursion:
 *                          type: boolean
 *                          description: The recursion tag.
 *                        hashing:
 *                          type: boolean
 *                          description: The hashing tag.
 *                        bit_mask:
 *                          type: boolean
 *                          description: The bit mask tag.
 *
 *      400:
 *        description: Question ID is not present or field is not valid.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: The error message.
 *      404:
 *        description: Question not found.
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
  const { questionId } = await params;

  // Ensure request is valid
  if (!questionId) {
    return NextResponse.json(
      { error: "questionId is required" },
      { status: 400 }
    );
  }

  // Retrieve question from database
  const question = await getQuestion(questionId);

  // Ensure question exists
  if ("error" in question) {
    return NextResponse.json({ error: question.error }, { status: 404 });
  }

  return NextResponse.json(question);
}
