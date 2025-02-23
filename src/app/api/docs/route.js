import { NextResponse } from "next/server";
import openapiSpecification from "@/lib/swagger";

/**
 * @openapi
 * /api/docs:
 *  get:
 *    summary: Retrieve OpenAPI specification.
 *    description: Retrieve OpenAPI specification in JSON format for API documentation.
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
