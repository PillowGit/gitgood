/**
 * @param {string} language - The language to submit in
 * @param {string} questionId - The id of the question to submit to
 * @param {string[]} code - The lines of code to submit
 * @returns {Promise<{ redirect_to: string } | { error: string }>} - The submission id or an error message
 */
async function proxySubmitSubmission(language, questionId, code) {
  try {
    const response = await fetch(`/api/questions/${questionId}/submit`, {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        code,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Failed to submit submission" };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: `Caught client error while running proxy function: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export { proxySubmitSubmission };
