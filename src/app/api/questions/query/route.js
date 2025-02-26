import { NextResponse } from "next/server";

import {
  getBaseQueryOptions,
  validateQueryOptions,
  queryQuestions,
} from "@/lib/database/queries";

/**
 * @openapi
 * /api/questions/query:
 *   get:
 *     summary: Query a list of questions
 *     description: Query a list of questions from the database given some query parameters
 *     parameters:
 *       - in: body
 *         name: limit
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             limit:
 *               type: number
 *               example: 10
 *         description: (Required) The maximum number of questions to return. Must be between 1-20
 *       - in: body
 *         name: order_by
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             limit:
 *               type: number
 *               example: 10
 *             order_by:
 *               type: string
 *               example: "difficulty"
 *         description: (Optional) The field to order by. Can be "", "difficulty", "votes", "updated", or "created"
 *       - in: body
 *         name: order_asc
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             limit:
 *               type: number
 *               example: 10
 *             order_asc:
 *               type: boolean
 *               example: true
 *         description: (Optional) Whether to order in ascending order. Default is false
 *       - in: body
 *         name: start_after
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             limit:
 *               type: number
 *               example: 10
 *             start_after:
 *               type: string
 *               example: "q3EdfG"
 *         description: (Optional) The question ID to start after. Can be empty for none. Cannot have both start_after and start_at
 *       - in: body
 *         name: start_at
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             limit:
 *               type: number
 *               example: 10
 *             start_at:
 *               type: string
 *               example: "q3EdfG"
 *         description: (Optional) The question ID to start at. Can be empty for none. Cannot have both start_after and start_at
 *       - in: body
 *         name: difficulty
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             limit:
 *               type: number
 *               example: 10
 *             difficulty:
 *               type: string
 *               example: "easy"
 *         description: (Optional) The difficulty to filter by. Can be "easy", "medium", "hard". Easy is 0.0-3.2, medium is 3.3-6.6, hard is 6.7-10.0
 *       - in: body
 *         name: difficulty_range
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             limit:
 *               type: number
 *               example: 10
 *             difficulty:
 *               type: string
 *               example: ""
 *             difficulty_range:
 *               type: string
 *               example: "0.0-10.0"
 *         description: (Optional) The difficulty range to filter by. Can be a string of the format "0.0-10.0", range is inclusive, and must be between 0.0-10.0. Only gets checked if "difficulty" is empty
 *       - in: body
 *         name: author
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             limit:
 *               type: number
 *               example: 10
 *             author:
 *               type: string
 *               example: "104609738"
 *         description: (Optional) The ID of the author to filter by
 *       - in: body
 *         name: language
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             limit:
 *               type: number
 *               example: 10
 *             language:
 *               type: string
 *               example: "c++"
 *         description: (Optional) The language to filter by
 *     responses:
 *       200:
 *         description: Returns a list of question metadata objects that match the query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: The title of the question.
 *                   difficulty_sum:
 *                     type: number
 *                     description: The sum of the difficulty ratings of the question.
 *                   difficulty_votes:
 *                     type: number
 *                     description: The amount of difficulty ratings given to the question.
 *                   difficulty:
 *                     type: number
 *                     description: The average difficulty rating of the question.
 *                   votes_bad:
 *                     type: number
 *                     description: The downvotes given to the question.
 *                   votes_good:
 *                     type: number
 *                     description: The upvotes given to the question.
 *                   votes_sum:
 *                     type: number
 *                     description: The total votes given to the question.
 *                   questionid:
 *                     type: string
 *                     description: The ID of the question.
 *                   display_publicly:
 *                     type: boolean
 *                     description: Whether the question is public.
 *                   author_id:
 *                     type: string
 *                     description: The ID of the author of the question.
 *                   author_name:
 *                     type: string
 *                     description: The name of the author of the question.
 *                   languages:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: The available coding languages for the question.
 *                   date_created:
 *                     type: object
 *                     properties:
 *                       seconds:
 *                         type: number
 *                         description: The number of seconds since the epoch.
 *                       nanoseconds:
 *                         type: number
 *                         description: The number of nanoseconds since the epoch.
 *                   date_updated:
 *                     type: object
 *                     properties:
 *                       seconds:
 *                         type: number
 *                         description: The number of seconds since the epoch.
 *                       nanoseconds:
 *                         type: number
 *                         description: The number of nanoseconds since the epoch.
 *                   tags:
 *                     type: object
 *                     properties:
 *                       array:
 *                         type: boolean
 *                         description: The array tag.
 *                       string:
 *                         type: boolean
 *                         description: The string tag.
 *                       hash_table:
 *                         type: boolean
 *                         description: The hash_table tag.
 *                       dp:
 *                         type: boolean
 *                         description: The dp tag.
 *                       math:
 *                         type: boolean
 *                         description: The math tag.
 *                       sorting:
 *                         type: boolean
 *                         description: The sorting tag.
 *                       greedy:
 *                         type: boolean
 *                         description: The greedy tag.
 *                       dfs:
 *                         type: boolean
 *                         description: The dfs tag.
 *                       bfs:
 *                         type: boolean
 *                         description: The bfs tag.
 *                       binary_search:
 *                         type: boolean
 *                         description: The binary search tag.
 *                       matrix:
 *                         type: boolean
 *                         description: The matrix tag.
 *                       tree:
 *                         type: boolean
 *                         description: The tree tag.
 *                       bit_manipulation:
 *                         type: boolean
 *                         description: The bit manipulation tag.
 *                       two_pointer:
 *                         type: boolean
 *                         description: The two pointer tag.
 *                       heap:
 *                         type: boolean
 *                         description: The heap tag.
 *                       stack:
 *                         type: boolean
 *                         description: The stack tag.
 *                       graph:
 *                         type: boolean
 *                         description: The graph tag.
 *                       sliding_window:
 *                         type: boolean
 *                         description: The sliding window tag.
 *                       back_tracking:
 *                         type: boolean
 *                         description: The back tracking tag.
 *                       linked_list:
 *                         type: boolean
 *                         description: The linked list tag.
 *                       set:
 *                         type: boolean
 *                         description: The set tag.
 *                       queue:
 *                         type: boolean
 *                         description: The queue tag.
 *                       memo:
 *                         type: boolean
 *                         description: The memo tag.
 *                       recursion:
 *                         type: boolean
 *                         description: The recursion tag.
 *                       hashing:
 *                         type: boolean
 *                         description: The hashing tag.
 *                       bit_mask:
 *                         type: boolean
 *                         description: The bit mask tag.
 *       400:
 *         description: Limit field is not present or field is not valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *       400:
 *         description: Unknown key is present.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 */
export async function GET(req, { params }) {
  try {
    const data = await req.json();

    if (data.limit === undefined) {
      return NextResponse.json(
        { error: "Limit field is not present" },
        { status: 400 }
      );
    } else if (data.limit < 1 || data.limit > 20) {
      return NextResponse.json(
        { error: "Limit field is not valid" },
        { status: 400 }
      );
    }

    const queryData = { ...getBaseQueryOptions(), ...data };
    const validation = validateQueryOptions(queryData);

    if (validation.reason) {
      return NextResponse.json({ error: validation.reason }, { status: 400 });
    }

    const questions = await queryQuestions(queryData);
    return NextResponse.json(questions);
  } catch (e) {
    console.log("Server error in GET /api/questions/query", e);
    return NextResponse.error();
  }
}
