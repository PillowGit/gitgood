import { NextResponse } from "next/server";

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
