import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { generateRandomString, dateToTimestamp } from "@/lib/utilities";
import { db } from "@/lib/database/firebase";

import /** @type {FirebaseTimestamp}, @type {DatabaseError}, @type {SubmissionData} */ "@/lib/database/types";

/** Validates that an object fits the SubmissionData type */
function validateSubmissionData(data) {
  if (
    !data ||
    typeof data !== "object" ||
    !data.submission_id ||
    !data.creator_id ||
    !data.question_id ||
    !data.code ||
    typeof data.code !== "object" ||
    !data.piston_output ||
    data.passed === undefined ||
    !data.language ||
    !data.date_created ||
    typeof data.date_created !== "object"
  ) {
    return false;
  }
  return true;
}

/**
 * Adds a submission to the database
 * @param {string} creator_id - The id of the user who created the submission
 * @param {string} question_id - The id of the question
 * @param {string[]} code - The code submitted by the user
 * @param {string} piston_output - The output of the code
 * @param {boolean} passed - Whether the code passed the test cases
 * @param {string} language - The language the code was written in
 * @returns {SubmissionData | DatabaseError} The submission data or an error message
 */
async function addSubmission(
  creator_id,
  question_id,
  code,
  piston_output,
  passed,
  language
) {
  try {
    let submission_id = generateRandomString(16);
    while (true) {
      const check = await getSubmission(submission_id);
      if (check.error && check.error === "Submission not found") {
        break;
      }
      submission_id = generateRandomString(16);
    }
    const submissionData = {
      date_created: dateToTimestamp(new Date()),
      submission_id,
      creator_id,
      question_id,
      code,
      piston_output,
      passed,
      language,
    };
    if (!validateSubmissionData(submissionData)) {
      return { error: "Invalid submission data" };
    }
    // On collection "submissions"
    const docRef = doc(db, "submissions", submission_id);
    await setDoc(docRef, submissionData);
    return submissionData;
  } catch (e) {
    console.log("Caught error while adding submission to database", e);
    return { error: e.message };
  }
}

/**
 * Retrieves a submission from the database
 * @param {string} submission_id - The id of the submission
 * @returns {SubmissionData | DatabaseError} The submission data or an error message
 */
async function getSubmission(submission_id) {
  try {
    const submissionRef = doc(db, "submissions", submission_id);
    const submissionSnap = await getDoc(submissionRef);
    if (!submissionSnap.exists()) {
      return { error: "Submission not found" };
    }
    const submissionData = submissionSnap.data();
    return submissionData;
  } catch (e) {
    console.log("Caught error while getting submission from database", e);
    return { error: e.message };
  }
}

/**
 * Deletes a submission from the database
 * @param {string} submission_id - The id of the submission
 * @returns {void | DatabaseError} The submission data or an error message
 */
async function deleteSubmission(submission_id) {
  try {
    const submissionRef = doc(db, "submissions", submission_id);
    await deleteDoc(submissionRef);
  } catch (e) {
    console.log("Caught error while deleting submission from database", e);
    return { error: e.message };
  }
}

/**
 * Queries on the last 10 submissions from the collection with question_id && creator_id
 * @param {string} question_id - The id of the question
 * @param {string} creator_id - The id of the user who created the submission
 * @returns {SubmissionData[] | DatabaseError} The submission data or an error message
 */
async function querySubmissions(question_id, creator_id) {
  try {
    const query_params = [];
    query_params.push(collection(db, "submissions"));
    query_params.push(where("question_id", "==", question_id));
    query_params.push(where("creator_id", "==", creator_id));
    query_params.push(orderBy("date_created", "desc"));
    query_params.push(limit(100));
    const q = query(...query_params);
    const querySnapshot = await getDocs(q);
    const submissions = [];
    querySnapshot.forEach((queryDocSnap) => {
      submissions.push(queryDocSnap.data());
    });
    return submissions;
  } catch (e) {
    console.log("Caught error while querying submissions from database", e);
    return { error: e.message };
  }
}

export {
  validateSubmissionData,
  addSubmission,
  getSubmission,
  deleteSubmission,
  querySubmissions,
};
