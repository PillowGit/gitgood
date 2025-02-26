import { getBaseQueryOptions } from "../database/queries";

/**
 * Returns the default query options for the question database, meant to be modified as needed then passed into the "makeQuery" function
 * @returns {QueryOptions} The default query options
 */
function getDefaultQuery() {
  return getBaseQueryOptions();
}

/**
 * Makes a query for a list of questions to the database. The options object should be created using the "getDefaultQuery" function then modified as needed.
 * @param {QueryOptions} options The options for the query
 * @returns {Promise<Metadata[] | DatabaseError>} The metadata of the questions that match the query, or an error
 */
async function makeQuery(options) {
  try {
    console.log("Got query with the following options: ", options);
    const response = await fetch("/api/questions/query", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      return {
        error: `Failed to query questions: ${response.statusText}`,
      };
    } else {
      return await response.json();
    }
  } catch (e) {
    console.log("Client query error: ", e);
    return {
      error: e.message,
    };
  }
}

export { getDefaultQuery, makeQuery };
