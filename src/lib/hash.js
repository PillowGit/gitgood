const safe_characters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.~";

/**
 * Generates a hash string of a specified length using a simple hashing algorithm.
 * @param {string} str The input string to hash.
 * @param {number} length The desired length of the hash string.
 * @param {string} characters The set of characters to use for the hash.
 * @returns {string} The generated hash string.
 */
function generateHash(str, length) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hash = (hash * 31 + charCode) % 2 ** 32; // poly hash
  }
  let result = "";
  for (let i = 0; i < length; i++) {
    result += safe_characters.charAt(Math.abs(hash) % safe_characters.length);
    hash = Math.floor(hash / safe_characters.length);
  }
  return result;
}

/**
 * Generates a URL-friendly hash string of a specified length.
 * @param {string} str The input string.
 * @param {number} length The desired length of the hash.
 * @returns {string} The URL-friendly hash.
 */
function hashURLSafe(str, length) {
  return generateHash(str, length);
}

/**
 * Generates a shorter URL-friendly hash using Base62 encoding.
 * @param {string} str The input string.
 * @param {number} length The desired length of the hash.
 * @returns {string} The Base62 encoded hash.
 */
function hashBase62URLSafe(str, length) {
  return generateHash(str, length);
}

export { hashURLSafe, hashBase62URLSafe };
