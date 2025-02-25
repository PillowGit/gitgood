import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

import {
  getQuestion,
  getBaseQuestionData,
  addQuestion,
} from "@/lib/database/questions";

export async function GET(req, { params }) {
  const base = getBaseQuestionData();
  base.description = `Test question made on ${new Date().toISOString()}`;
  base.code.push({
    language: "javascript",
    inputs: [],
    template: [],
    solution: [],
    tester: [],
  });

  const res = await addQuestion(base);

  if ("error" in res) {
    return NextResponse.json(res, { status: 400 });
  } else {
    return NextResponse.json(res);
  }
}
