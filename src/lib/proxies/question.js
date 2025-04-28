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

export { proxyGetQuestion };
