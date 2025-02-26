import { NextResponse } from "next/server";


/**
 * @openapi
 * /api/execute:
 *  post:
 *    summary: Execute code using Piston API
 *    description: Execute given code in the specified language using Piston API
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              language:
 *                type: string
 *                description: The programming language to use for execution.
 *              code:
 *                type: string
 *                description: The source code to execute.
 *    responses:
 *      200:
 *        description: Successful execution.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                language:
 *                  type: string
 *                  description: The name of the language used.
 *                version:
 *                  type: string
 *                  description: The version of the language used.
 *                run:
 *                  type: object
 *                  description: Results from the run stage.
 *                  properties:
 *                    stdout:
 *                      type: string
 *                      description: Standard output of the run stage
 *                    stderr:
 *                      type: string
 *                      description: Standard error output of the run stage
 *                    output:
 *                      type: string
 *                      description: Combined stdout and stderr output of the run stage
 *                    code:
 *                      type: integer
 *                      nullable: true
 *                      description: Exit code of the run process. Null if signal is not null.
 *                    signal:
 *                      type: string
 *                      nullable: true
 *                      description: Signal from the run process. Null if code is not null.
 *                compile:
 *                  type: object
 *                  nullable: true
 *                  description: Results from the compile stage (if applicable)
 *                  properties:
 *                    stdout:
 *                      type: string
 *                      description: Standard output of the compile stage
 *                    stderr:
 *                      type: string
 *                      description: Standard error output of the compile stage
 *                    output:
 *                      type: string
 *                      description: Combined stdout and stderr output of the compile stage
 *                    code:
 *                      type: integer
 *                      nullable: true
 *                      description: Exit code of the compile process. Null if signal is not null.
 *                    signal:
 *                      type: string
 *                      nullable: true
 *                      description: Signal from the compile process. Null if code is not null.
 *      500:
 *        description: Execution failed.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message.
 */
export async function POST(req) {
  try {
    const { language, code } = await req.json();

    // Uses public API for Piston; rate-limited to 5 requests per second
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version: "*", // Uses the latest version of the language
        files: [{ content: code }],
        // stdin: "",
        // args: [],
        // run_timeout: PLACEHOLDER
        // compile_timeout: PLACEHOLDER
        // compile_memory_limit: PLACEHOLDER,
        // run_memory_limit: PLACEHOLDER
      }),
    });

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Execution failed" }, { status: 500 });
  }
}
