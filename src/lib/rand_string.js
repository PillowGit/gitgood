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

export { generateRandomString };
