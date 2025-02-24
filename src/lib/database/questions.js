import { dateToTimestamp } from "@/lib/epoch";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { generateRandomString } from "@/lib/rand_string";
import { db } from "@/lib/database/firebase";

import /** @type {FirebaseTimestamp}, @type {Error}, @type {CodeData}, @type {TestCase}, @type {Tags}, @type {Metadata}, @type {QuestionData} */ "@/lib/database/types";

/** @type {QuestionData} */
const base_question_data = {
  code: [],
  test_cases: [],
  metadata: {
    title: "Example Title",
    difficulty_sum: 0,
    difficulty_votes: 0,
    votes_bad: 0,
    votes_good: 0,
    tags: {
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
    },
    questionid: "Example ID",
    languages: [],
    display_publicly: true,
    author_id: "Example Author ID",
    author_name: "Anonymous",
    date_created: dateToTimestamp(new Date()),
    date_updated: dateToTimestamp(new Date()),
  },
  description: "Example Description",
};

/** @type {CodeData} */
const fake_code_data = {
  language: "javascript",
  inputs: [],
  template: [],
  solution: [],
  tester: [],
};

/**
 * Validates a question data object. Returns an object with either status = true or status = false and a reason for the failure.
 * @param {QuestionData} questionData - The question data
 * @returns {{status: boolean, reason?: string | null}} result - The result of the validation
 */
function validateQuestionData(questionData) {
  // Ensure all keys are present
  for (const key of Object.keys(base_question_data)) {
    if (questionData[key] === undefined) {
      return { status: false, reason: `Missing primary key: ${key}` };
    }
  }
  // Ensure no unknown keys are present
  for (const key of Object.keys(questionData)) {
    if (base_question_data[key] === undefined) {
      return { status: false, reason: `Unknown key: ${key}` };
    }
  }
  // Ensure code has at least 1 object
  if (questionData.code.length === 0) {
    return { status: false, reason: "No valid code objects" };
  }
  // Ensure all keys in metadata are present
  for (const key of Object.keys(base_question_data.metadata)) {
    if (questionData.metadata[key] === undefined) {
      return { status: false, reason: `Missing metadata key: ${key}` };
    }
  }
  // Ensure all tags are present
  for (const key of Object.keys(base_question_data.metadata.tags)) {
    if (questionData.metadata.tags[key] === undefined) {
      return { status: false, reason: `Missing tag: ${key}` };
    }
  }
  // Ensure all keys in every object in code are present
  for (const codeobj of questionData.code) {
    for (const key of Object.keys(fake_code_data)) {
      if (codeobj[key] === undefined) {
        return { status: false, reason: `Missing code object key: ${key}` };
      }
    }
  }
  // Ensure all keys in every object in test_cases are present
  for (const test_case of questionData.test_cases) {
    for (const key of Object.keys(base_question_data.test_cases[0])) {
      if (!test_case[key]) {
        return { status: false, reason: `Missing test case key: ${key}` };
      }
    }
  }
  return { status: true };
}

/**
 * Adds a question to the database. Must at least have 1 code object. All fields must be present and valid, id in questionid will be overwritten.
 * @param {QuestionData} questionData - The question data
 * @returns {QuestionData | Error} The question data
 */
async function addQuestion(questionData) {
  try {
    while (true) {
      const questionId = generateRandomString(6);
      // Ensure this id is unique
      const question = await getQuestion(questionId);
      if (!question.error) {
        continue;
      }
      // Ensure error is because it doesn't exist
      if (question.error !== "Question not found") {
        return { error: question.error };
      }
      // Set the id
      questionData.metadata.questionid = questionId;
      // Add the question
      return updateQuestion(questionId, questionData);
    }
  } catch (e) {
    console.log("Caught error while adding question to database", e);
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
    console.log("Caught error while getting question from database", e);
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
    if (!is_valid.status) {
      return { error: is_valid.reason };
    }

    const questionRef = doc(db, "questions", questionId);
    await setDoc(questionRef, data);

    // The "questions-short" is used for quick access question metadata without the full question data
    const shortQuestionRef = doc(db, "questions-short", questionId);
    await setDoc(shortQuestionRef, data.metadata);

    return data;
  } catch (e) {
    console.log("Caught error while updating question in database", e);
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
    console.log("Caught error while deleting question from database", e);
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
  validateQuestionData,
};
