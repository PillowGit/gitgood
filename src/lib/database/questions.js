import { dateToTimestamp } from "@/lib/epoch";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { hashBase62URLSafe } from "@/lib/hash";
import { db } from "@/lib/database/firebase";

/**
 * A Firebase Timestamp object.
 * @typedef {Object} FirebaseTimestamp
 * @property {number} seconds - The number of seconds since the epoch.
 * @property {number} nanoseconds - The number of nanoseconds since the epoch.
 */

/**
 * How code for each question is stored in the database
 * @typedef {Object} CodeData
 * @property {string} language - The language the code is written in
 * @property {string[]} inputs - Lines of code that define the "input" section of a code challenge
 * @property {string[]} template - Lines of code that define the "template" section of a code challenge. This is the code that the user will modify
 * @property {string[]} solution - Lines of code that define the "solution" section of a code challenge. This is the correct answer
 * @property {string[]} tester - Lines of code that define the "tester" section of a code challenge. This is the code that will test the user's solution and compare with the solution
 */

/**
 * How test cases, for display purposes, are stored
 * @typedef {Array<Object>} TestCaseData
 * @property {string} ANSWER - The expected output of the test case
 * @property {string} [key] - Other key-value pairs exist, where the key can be any string. The value associated with these other keys are also strings.
 */

/**
 * How the important metadata for each question is stored in the database
 * @typedef {Object} important
 * @property {string} title - The title of the question
 * @property {number} difficulty_sum - The sum of the difficulty ratings of the question
 * @property {number} difficulty_votes - The number of difficulty ratings given to the question
 * @property {number} votes_bad - The number of "bad" votes given to the question
 * @property {number} votes_good - The number of "good" votes given to the question
 * @property {string[]} tags - The tags associated with the question
 * @property {string} questionid - The id of the question
 * @property {string[]} languages - The languages the question is available in
 * @property {boolean} display_publicly - Whether the question is public
 * @property {string} author_id - The id of the author of the question
 * @property {string} author_name - The name of the author of the question
 * date created next
 * @property {FirebaseTimestamp} date_created - The date the question was created
 * @property {FirebaseTimestamp} date_updated - The date the question was last modified
 */

/**
 * The base question data structure
 * @typedef {Object} QuestionData
 * @property {CodeData[]} code - The code data available for the question
 * @property {TestCaseData} test_cases - The test cases
 * @property {important} important - The important metadata
 * @property {string} description - The description of the question
 */

/**
 * Error message object
 * @typedef {Object} Error
 * @property {string} error - The error message
 */

/** @type {QuestionData} */
const base_question_data = {
  code: [],
  test_cases: [],
  important: {
    title: "",
    difficulty_sum: 0,
    difficulty_votes: 0,
    votes_bad: 0,
    votes_good: 0,
    tags: [],
    questionid: "",
    languages: [],
    display_publicly: true,
    author_id: "",
    author_name: "",
    date_created: dateToTimestamp(new Date()),
    date_updated: dateToTimestamp(new Date()),
  },
  description: "",
};

/**
 * Validates a question data object
 * @param {QuestionData} questionData - The question data
 * @returns {boolean} Whether the question data is valid
 */
function validateQuestionData(questionData) {
  // Ensure all keys are present
  for (const key of Object.keys(base_question_data)) {
    if (!questionData[key]) {
      return false;
    }
  }
  // Ensure no unknown keys are present
  for (const key of Object.keys(questionData)) {
    if (!base_question_data[key]) {
      return false;
    }
  }
  // Ensure code has at least 1 object
  if (questionData.code.length === 0) {
    return false;
  }
  // Ensure all keys in important are present
  for (const key of Object.keys(base_question_data.important)) {
    if (!questionData.important[key]) {
      return false;
    }
  }
  // Ensure all keys in every object in code are present
  for (const code of questionData.code) {
    for (const key of Object.keys(base_question_data.code[0])) {
      if (!code[key]) {
        return false;
      }
    }
  }
  // Ensure all keys in every object in test_cases are present
  for (const test_case of questionData.test_cases) {
    for (const key of Object.keys(base_question_data.test_cases[0])) {
      if (!test_case[key]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Adds a question to the database. Must at least have 1 code object. All fields must be present and valid, id in questionid will be overwritten.
 * @param {QuestionData} questionData - The question data
 * @returns {QuestionData | Error} The question data
 */
async function addQuestion(questionData) {
  try {
    while (true) {
      const questionId = hashBase62URLSafe(new Date().toISOString(), 10);
      // Ensure this id is unique
      const question = getQuestion(questionId);
      if (!question.error) {
        continue;
      }
      // Ensure error is because it doesn't exist
      if (question.error !== "Question not found") {
        return { error: question.error };
      }
      // Set the id
      questionData.important.questionid = questionId;
      // Add the question
      return updateQuestion(questionId, questionData);
    }
  } catch (e) {
    return { error: e.message };
  }
}

/**
 * Retrieves a question from the database
 * @param {string} questionId - The question's id
 * @returns {QuestionData | Error} The question data or an error message
 */
async function getQuestion(questionId) {
  try {
    // Fetch from Firestore
    const questionRef = doc(db, "questions", questionId);
    const questionSnap = await getDoc(questionRef);
    // If not exist, return error
    if (!questionSnap.exists()) {
      return { error: "Question not found" };
    }
    const questionData = questionSnap.data();
    return questionData;
  } catch (e) {
    return { error: e.message };
  }
}

/**
 * Updates a question in the database. Completely overwrites, so all fields in data must be present and valid.
 * @param {string} questionId - The question's id
 * @param {QuestionData} data - The question data
 * @returns {QuestionData | Error} The question data
 */
async function updateQuestion(questionId, data) {
  try {
    const is_valid = validateQuestionData(data);
    if (!is_valid) {
      return { error: "Invalid question data format" };
    }

    const questionRef = doc(db, "questions", questionId);
    await setDoc(questionRef, data);

    // The "questions-short" is used for quick access question metadata without the full question data
    const shortQuestionRef = doc(db, "questions-short", questionId);
    await setDoc(shortQuestionRef, data.important);

    return data;
  } catch (e) {
    return { error: e.message };
  }
}

/**
 * Deletes a question from the database
 * @param {string} questionId - The question's id
 * @returns {void | Error}
 */
async function deleteQuestion(questionId) {
  try {
    const questionRef = doc(db, "questions", questionId);
    await deleteDoc(questionRef);
    const shortQuestionRef = doc(db, "questions-short", questionId);
    await deleteDoc(shortQuestionRef);
  } catch (e) {
    return { error: e.message };
  }
}

/**
 * Deep copies an object recursively
 * @param {any} obj - The object to copy
 * @returns {any} The copied object
 */
function deepCopy(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  const copy = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    copy[key] = deepCopy(obj[key]);
  }
  return copy;
}

/**
 * Returns the base question data structure
 * @returns {QuestionData}
 */
function getBaseQuestionData() {
  return deepCopy(base_question_data);
}

export {
  addQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getBaseQuestionData,
};
