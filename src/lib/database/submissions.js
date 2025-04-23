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
