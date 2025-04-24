import { getQuestion } from "@/lib/database/questions";

/**
 * Returns the featured questions for this week
 * @returns {Promise<Metadata[] | DatabaseError>} The metadata of the featured questions
 */
async function getFeaturedQuestions() {
  // This is a placeholder for the real implementation

  const questions = [
    await getQuestion("0QvyVG"),
    await getQuestion("5dAfOe"),
    await getQuestion("gs1PoS")
  ];

  return questions.map((question) => question.metadata);
}

export { getFeaturedQuestions };
