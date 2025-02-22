import { NextResponse } from "next/server";
import openapiSpecification from "../../../../swagger";

/**
 * @openapi
 * /api/docs:
 *  get:
 *    description: Retrieve OpenAPI specification.
 *    responses:
 *      200:
 *        description: Successfully retrieved OpenAPI specification.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              description: The OpenAPI specification.
 */
export function GET() {
  return NextResponse.json(openapiSpecification);
}
