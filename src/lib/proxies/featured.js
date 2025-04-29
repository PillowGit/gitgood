import { getQuestion } from "@/lib/database/questions";

/**
 * Returns the featured questions for this week
 * @returns {Promise<Metadata[] | DatabaseError>} The metadata of the featured questions
 */
async function getFeaturedQuestions() {
  // This is a placeholder for the real implementation

  const questions = [
    await getQuestion("E30b.w"),
    await getQuestion("LevMdL"),
    await getQuestion("mBNZwt"),
  ];

  return questions.map((question) => question.metadata);
}

export { getFeaturedQuestions };
