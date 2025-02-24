import { NextResponse } from "next/server";

import { getBaseQueryOptions, queryQuestions } from "@/lib/database/queries";
import { getBaseQuestionData, addQuestion } from "@/lib/database/questions";

export async function GET(req, { params }) {
  const options = getBaseQueryOptions();
  const questions = await queryQuestions(options);
  const ids = questions.map((question) => question.questionid);
  return NextResponse.json({
    data: `Queried the following question ids: ${ids}`,
  });
}
