/**
 * @param {string} language - The language to submit in
 * @param {string} questionId - The id of the question to submit to
 * @param {string[]} code - The lines of code to submit
 * @returns {Promise<{ redirect_to: string } | { error: string }>} - The submission id or an error message
 */
async function proxySubmitQuestion(language, questionId, code) {
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

    if (response.status !== 302) {
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

/**
 * @param {string} questionId - The id of the question to submit to
 * @returns {Promise<{ submissions: SubmissionData[] } | { error: string }>} - The submission data or an error message
 */
async function proxyGetSubmissions(questionId) {
  try {
    const response = await fetch(
      `/api/questions/${questionId}/my_submissions`,
      {
        cache: "no-store",
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Failed to get submissions" };
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

export { proxySubmitQuestion, proxyGetSubmissions };
