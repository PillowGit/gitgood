import { db } from "@/lib/database/firebase";
import { deepCopy } from "@/lib/utilities";
import { getUser } from "@/lib/database/users";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

import /** @type {DatabaseError}, @type {Tags}, @type {QueryOptions} @type {Metadata} */ "@/lib/database/types";

/** @type {Tags} */
const default_tags = {
  array: false,
  string: false,
  hash_table: false,
  dp: false,
  math: false,
  sorting: false,
  greedy: false,
  dfs: false,
  bfs: false,
  binary_search: false,
  matrix: false,
  tree: false,
  bit_manipulation: false,
  two_pointer: false,
  heap: false,
  stack: false,
  graph: false,
  sliding_window: false,
  back_tracking: false,
  linked_list: false,
  set: false,
  queue: false,
  memo: false,
  recursion: false,
  hashing: false,
  bit_mask: false,
};
/** @type {QueryOptions} */
const default_query_options = {
  filter_tag: "",
  order_by: "",
  limit: 10,
  start_after: "",
  start_at: "",
  difficulty: "",
  difficulty_range: "",
  author: "",
};

/**
 * Get the base query options
 * @returns {QueryOptions} The base query options
 */
function getBaseQueryOptions() {
  return deepCopy(default_query_options);
}

/**
 * Validate the query options
 * @param {QueryOptions} options - The query options to validate
 * @returns {{status: boolean, reason?: string | null}} The validation status and reason
 */
function validateQueryOptions(options) {
  // Ensure all keys are present
  for (const key of Object.keys(default_query_options)) {
    if (options[key] === undefined) {
      return { status: false, reason: `Missing key: ${key}` };
    }
  }
  // Ensure no unknown keys are present
  for (const key of Object.keys(options)) {
    if (default_query_options[key] === undefined) {
      return { status: false, reason: `Unknown key: ${key}` };
    }
  }
  // Ensure given tag is valid
  if (
    options.filter_tag !== "" &&
    default_tags[options.filter_tag] === undefined
  ) {
    return { status: false, reason: `Invalid tag: ${options.filter_tag}` };
  }
  // Ensure order_by is valid ("", "difficulty", "votes", "updated", "created")
  if (
    options.order_by !== "" &&
    options.order_by !== "difficulty" &&
    options.order_by !== "votes" &&
    options.order_by !== "updated" &&
    options.order_by !== "created"
  ) {
    return { status: false, reason: `Invalid order_by: ${options.order_by}` };
  }
  // Ensure difficulty is valid ("easy", "medium", "hard", "")
  if (
    options.difficulty !== "" &&
    options.difficulty !== "easy" &&
    options.difficulty !== "medium" &&
    options.difficulty !== "hard"
  ) {
    return {
      status: false,
      reason: `Invalid difficulty: ${options.difficulty}`,
    };
  }
  // Ensure difficulty_range is valid ("" or "0.0-10.0")
  if (options.difficulty === "" && options.difficulty_range !== "") {
    if (
      !options.difficulty_range.match(/^(\d\.\d)-(\d\.\d)$/) ||
      options.difficulty_range
        .split("-")
        .some((num) => Number(num) < 0.0 || Number(num) > 10.0)
    ) {
      return {
        status: false,
        reason: `Invalid difficulty_range: ${options.difficulty_range}`,
      };
    }
  }
  // Ensure limit is valid (1-20)
  if (options.limit < 1 || options.limit > 20) {
    return { status: false, reason: `Invalid limit: ${options.limit}` };
  }
  // Ensure not both start_after and start_at are present
  if (options.start_after !== "" && options.start_at !== "") {
    return {
      status: false,
      reason: "Cannot have both start_after and start_at",
    };
  }
  return { status: true };
}

/**
 * Query the question metadata collection
 * @param {QueryOptions} options - The query options
 * @returns {Metadata[] | DatabaseError} The metadata or an error
 */
async function queryQuestions(options) {
  try {
    // Validate the query options
    const validation = validateQueryOptions(options);
    if (!validation.status) {
      return { error: validation.reason };
    }

    if (options.author !== "") {
      // Make sure the requested author actually exists
      const user = await getUser(options.author);
      if (user.error) {
        return {
          error: `Author ID given during query, but failed to fetch Author due to: ${user.error}`,
        };
      }

      // Start building parameters for the query
      const query_params = [];
      query_params.push(collection(db, "questions-short"));

      // Filter by author
      query_params.push(where("author_id", "==", options.author));

      // Allow cursoring through the results
      if (options.start_after !== "") {
        const questRef = collection(db, "questions-short");
        const cursorSnap = await getDoc(doc(questRef, options.start_after));
        query_params.push(startAfter(cursorSnap));
      } else if (options.start_at !== "") {
        const questRef = collection(db, "questions-short");
        const cursorSnap = await getDoc(doc(questRef, options.start_at));
        query_params.push(startAt(cursorSnap));
      }

      // Use the given limit
      query_params.push(limit(options.limit));

      // Make query
      const q = query(...query_params);
      const querySnapshot = await getDocs(q);

      // Return result
      const metadata = [];
      querySnapshot.forEach((queryDocSnap) => {
        metadata.push(queryDocSnap.data());
      });
      return metadata;
    } else {
      // Begin building the query by listing out the query parameters
      const query_params = [];
      query_params.push(collection(db, "questions-short"));

      // Never show unlisted questions
      query_params.push(where("display_publicly", "==", true));

      // Filter by difficulty first
      if (options.difficulty !== "") {
        let lower = 0.0;
        let upper = 0.0;
        if (options.difficulty === "easy") {
          lower = 0.0;
          upper = 3.2;
        } else if (options.difficulty === "medium") {
          lower = 3.3;
          upper = 6.6;
        } else if (options.difficulty === "hard") {
          lower = 6.7;
          upper = 10.0;
        }
        query_params.push(where("difficulty", ">=", lower));
        query_params.push(where("difficulty", "<=", upper));
        // Filter by range if no difficulty and range filled out
      } else if (options.difficulty_range !== "") {
        const range = options.difficulty_range.split("-");
        query_params.push(where("difficulty", ">=", range[0]));
        query_params.push(where("difficulty", "<=", range[1]));
      }

      // Filter by tag if given
      if (options.filter_tag !== "") {
        query_params.push(where(`tags.${options.filter_tag}`, "==", true));
      }

      // Order by
      let ordering = "votes_sum";
      if (options.order_by === "difficulty") {
        ordering = "difficulty";
      } else if (options.order_by === "updated") {
        ordering = "date_updated";
      } else if (options.order_by === "created") {
        ordering = "date_created";
      }
      if (options.order_asc) {
        query_params.push(orderBy(ordering));
      } else {
        query_params.push(orderBy(ordering, "desc"));
      }

      // Limit
      query_params.push(limit(options.limit));

      // Cursors for paging
      if (options.start_after !== "") {
        const questRef = collection(db, "questions-short");
        const cursorSnap = await getDoc(doc(questRef, options.start_after));
        query_params.push(startAfter(cursorSnap));
      } else if (options.start_at !== "") {
        const questRef = collection(db, "questions-short");
        const cursorSnap = await getDoc(doc(questRef, options.start_at));
        query_params.push(startAt(cursorSnap));
      }

      // Spread out the query params into a query object and make query
      let q = query(...query_params);
      const querySnapshot = await getDocs(q);

      // Get the documents
      const metadata = [];
      querySnapshot.forEach((queryDocSnap) => {
        metadata.push(queryDocSnap.data());
      });
      return metadata;
    }
  } catch (e) {
    console.log("Caught error while querying questions", e);
    return { error: e.message };
  }
}

export { getBaseQueryOptions, validateQueryOptions, queryQuestions };
