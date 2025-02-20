import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/database/firebase";

/**
 * The base user data structure
 * @typedef {Object} UserData
 * @property {string[]} accepted - The list of challenges the user has completed
 * @property {string[]} attempted - The list of challenges the user has attempted
 * @property {string[]} created - The list of challenges the user has created
 * @property {string} github_id - The user's github id
 * @property {string} username - The user's username
 * @property {string} display_name - The user's display name
 * @property {string} avatar - The user's avatar URL (github url)
 * @property {number} points_accumulated - The user's total points (calculated by the sum of the difficulty rating of all accepted challenges)
 * @property {boolean} can_create - Whether the user can create challenges (used for banning users who violate terms)
 * @property {boolean} accepted_are_public - Whether the user's accepted challenges are displayed on their profile
 * @property {boolean} points_are_public - Whether the user's points are displayed on their profile
 * @property {boolean} ownership_is_public - Whether the user's name appears on challenges they create
 */

/**
 * Error message object
 * @typedef {Object} Error
 * @property {string} error - The error message
 */

/** @type {UserData} */
const base_user_data = {
  accepted: [],
  attempted: [],
  created: [],
  github_id: "",
  username: "",
  display_name: "",
  avatar: "",
  points_accumulated: 0,
  can_create: true,
  accepted_are_public: true,
  points_are_public: true,
  ownership_is_public: true,
};

/**
 * Adds a user to the database
 * @param {string} userId - The user's id
 * @param {string} username - The user's username
 * @param {string} display_name - The user's display name
 * @param {string} avatar - The user's avatar URL
 * @returns {UserData | Error} The user's data
 */
async function addUser(userId, username, display_name, avatar) {
  const userData = {
    ...base_user_data,
    github_id: userId,
    username,
    display_name,
    avatar,
  };
  const result = await updateUser(userId, userData);
  return result;
}

/**  Retrieves a user from the database
 * @param {string} userId - The user's id
 * @returns {UserData | Error} The user's data or an error message
 */
async function getUser(userId) {
  try {
    // Fetch from Firestore
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    // If not exist, return error
    if (!userSnap.exists()) {
      return { error: "User not found" };
    }
    const userData = userSnap.data();
    return userData;
  } catch (e) {
    return { error: e.message };
  }
}

/**
 * Updates a user in the database
 * @param {string} userId - The user's id
 * @param {UserData} data - The user's data
 * @param {boolean} [merge=true] - Whether to merge the data with the existing data, or just replace it
 * @returns {UserData | Error} The user's data
 */
async function updateUser(userId, data, merge = true) {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, data, { merge });
    return data;
  } catch (e) {
    return { error: e.message };
  }
}

/**
 * Deletes a user from the database
 * @param {string} userId - The user's id
 * @returns {void | Error}
 */
async function deleteUser(userId) {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, null);
  } catch (e) {
    return { error: e.message };
  }
}

export { getUser, addUser, updateUser, deleteUser };
