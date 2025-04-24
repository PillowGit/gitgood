import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "@/lib/database/firebase";

import /** @type {DatabaseError}, @type {UserData} */ "@/lib/database/types";

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
  ownership_is_public: true
};

/**
 * Adds a user to the database
 * @param {string} userId - The user's id
 * @param {string} username - The user's username
 * @param {string} display_name - The user's display name
 * @param {string} avatar - The user's avatar URL
 * @returns {UserData | DatabaseError} The user's data
 */
async function addUser(userId, username, display_name, avatar) {
  try {
    const userData = {
      ...base_user_data,
      github_id: userId,
      username,
      display_name,
      avatar
    };
    const result = await updateUser(userId, userData);
    return result;
  } catch (e) {
    console.log("Caught error while adding user to database", e);
    return { error: e.message };
  }
}

/**  Retrieves a user from the database
 * @param {string} userId - The user's id
 * @returns {UserData | DatabaseError} The user's data or an error message
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
    console.log("Caught error while getting user from database", e);
    return { error: e.message };
  }
}

/**
 * Updates a user in the database
 * @param {string} userId - The user's id
 * @param {UserData} data - The user's data
 * @param {boolean} [merge=true] - Whether to merge the data with the existing data, or just replace it
 * @returns {UserData | DatabaseError} The user's data
 */
async function updateUser(userId, data, merge = true) {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, data, { merge });
    return data;
  } catch (e) {
    console.log("Caught error while updating user in database ", e);
    return { error: e.message };
  }
}

/**
 * Deletes a user from the database
 * @param {string} userId - The user's id
 * @returns {void | DatabaseError}
 */
async function deleteUser(userId) {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
  } catch (e) {
    console.log("Caught error while deleting user from database", e);
    return { error: e.message };
  }
}

/**
 * Gets the top 10 users from the database ordered by points_accumulated
 * @returns {UserData[] | DatabaseError}
 */
async function topTenUsers() {
  const query_params = [];
  query_params.push(collection(db, "users"));
  query_params.push(where("points_are_public", "==", true));
  query_params.push(orderBy("points_accumulated", "desc"));
  query_params.push(limit(10));
  const q = query(...query_params);
  const querySnapshot = await getDocs(q);
  const users = [];
  querySnapshot.forEach((doc) => {
    users.push(doc.data());
  });
  return users;
}

export { getUser, addUser, updateUser, deleteUser, topTenUsers };
