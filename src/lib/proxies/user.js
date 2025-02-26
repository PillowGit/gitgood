/**
 * @param {string} id - The id of the user to fetch
 * @returns {Promise<UserData | PublicUserData | DatabaseError>} - A promise that, when resolved, returns either the users full data (if authorized), the users public data (if not authorized), or the error if failed
 */

async function proxyGetUser(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`, { cache: "no-store" });
        if (!response.ok) {
            return {error: `Failed to fetch user: ${response.statusText}`};
        }
        const data = await response.json();

        if ("error" in data) {
            return /** @type {DatabaseError} */ (data);
        } else if ("can_create" in data) {
            return /** @type {UserData} */ (data);
        } else {
            return /** @type {PublicUserData} */ (data);
        }
    } catch (error) {

        return /** @type {DatabaseError} */ ({ 
            error: `Caught client error while running proxy function: ${error instanceof Error ? error.message : String(error)}`
        });
    }
}

export { proxyGetUser }