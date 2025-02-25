/**
 * A Firebase Timestamp object.
 * @typedef {Object} FirebaseTimestamp
 * @property {number} seconds - The number of seconds since the epoch.
 * @property {number} nanoseconds - The number of nanoseconds since the epoch.
 */

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

export { timestampToDate, dateToTimestamp };
