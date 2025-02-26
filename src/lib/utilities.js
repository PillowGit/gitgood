import /** @type {FirebaseTimestamp} */ "@/lib/database/types";

/**
 * Converts a Firebase Timestamp to a JavaScript Date object.
 * @param {FirebaseTimestamp} timestamp - The Firebase Timestamp to convert.
 * @returns {Date} A JavaScript Date object representing the same point in time.
 */
function timestampToDate(timestamp) {
  const milliseconds =
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
  return new Date(milliseconds);
}

/**
 * Converts a JavaScript Date object to a Firebase Timestamp.
 * @param {Date} date - The JavaScript Date object to convert.
 * @returns {FirebaseTimestamp} A Firebase Timestamp object representing the same point in time.
 */
function dateToTimestamp(date) {
  const milliseconds = date.getTime();
  const seconds = Math.floor(milliseconds / 1000);
  const nanoseconds = (milliseconds % 1000) * 1000000;

  return {
    seconds: seconds,
    nanoseconds: nanoseconds,
  };
}

const safe_characters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.~";

/**
 * Generates a random string of a specified length.
 * @param {number} length The desired length of the random string.
 * @returns {string} The generated random string.
 */
function generateRandomString(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * safe_characters.length);
    result += safe_characters.charAt(randomIndex);
  }
  return result;
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

export { generateRandomString, dateToTimestamp, timestampToDate, deepCopy };
