/**
 * @returns {Promise<LeaderboardUserData[] | DatabaseError>} - A promise that, when resolved, returns either the top 10 users for the leaderboard sorted by points or the error if failed
 */
async function proxyGetLeaderboard() {
  try {
    const response = await fetch(`/api/users/leaderboard`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return { error: `Failed to fetch leaderboard: ${response.statusText}` };
    }
    const data = await response.json();

    if ("error" in data) {
      return /** @type {DatabaseError} */ (data);
    } else {
      return /** @type {LeaderboardUserData[]} */ (data);
    }
  } catch (error) {
    return /** @type {DatabaseError} */ ({
      error: `Caught client error while running proxy function: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
}

export { proxyGetLeaderboard };
