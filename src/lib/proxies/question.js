/**
 * @param {questionid} id - The id of the question to fetch
 * @returns {Promise<QuestionData | DatabaseError>} - A promise that, when resolved, returns either the questions full data or the error if failed
 */
async function proxyGetQuestion(questionId) {
    try {
        //fetch from api route /api/questions/${questionId}
        const response = await fetch(`/api/questions/${questionId}`, { cache: "no-store" });
        if (!response.ok) {
            return { error: `Failed to fetch question: ${response.statusText}` };
        }
        const data = await response.json();

        if ("error" in data) {
            return /** @type {DatabaseError} */ (data);
        } else {
            return /** @type {QuestionData} */ (data);
        }
    } catch (error) {
        return /** @type {DatabaseError} */ ({
            error: `Caught client error while running proxy function: ${error instanceof Error ? error.message : String(error)}`
        });
    }
}

/**
 * @param {string} questionId - The id of the question to vote on
 * @param {"up" | "down"} voteType - Whether to upvote or downvote
 * @returns {Promise<{ votes_good: number, votes_bad: number, votes_sum: number, userVote?: string } | { error: string }>} - A promise that, when resolved, returns updated vote counts or an error
 */
async function proxyVoteQuestion(questionId, voteType) {
    try {
        const response = await fetch(`/api/questions/${questionId}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ voteType }),
        });

        const data = await response.json();

        if (!response.ok || "error" in data) {
            return {
                error: data.error || `Failed to vote on question: ${response.statusText}`
            };
        }

        return {
            votes_good: data.votes_good,
            votes_bad: data.votes_bad,
            votes_sum: data.votes_sum,
            userVote: data.userVote
        };
    } catch (error) {
        return {
            error: `Caught client error while voting: ${error instanceof Error ? error.message : String(error)}`
        };
    }
}

export { proxyGetQuestion, proxyVoteQuestion };
