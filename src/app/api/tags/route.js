import { NextResponse } from "next/server";
import /** @type {Tags} */ "@/lib/database/types";

/** @type {Tags} */
const tags = {
  array: false,
  string: false,
  hash_table: false,
  dp: false,
  math: false,
  sorting: false,
  greedy: false,
  dfs: false,
  bfs: false,
  binary_search: false,
  matrix: false,
  tree: false,
  bit_manipulation: false,
  two_pointer: false,
  heap: false,
  stack: false,
  graph: false,
  sliding_window: false,
  back_tracking: false,
  linked_list: false,
  set: false,
  queue: false,
  memo: false,
  recursion: false,
  hashing: false,
  bit_mask: false,
};

/**
 * @openapi
 * /api/tags:
 *  get:
 *    summary: Get available question tags.
 *    description: Gets all available question tags in JSON format.
 *    responses:
 *      200:
 *        description: Successfully retrieved question tags.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              description: The expected question tags object format.
 */
export function GET() {
  return NextResponse.json(tags);
}
