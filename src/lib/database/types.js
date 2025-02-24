//
// Generic Types
//

/**
 * Error message object
 * @typedef {Object} Error
 * @property {string} error - The error message
 */

//
// Firebase Types
//

/**
 * A Firebase Timestamp object.
 * @typedef {Object} FirebaseTimestamp
 * @property {number} seconds - The number of seconds since the epoch.
 * @property {number} nanoseconds - The number of nanoseconds since the epoch.
 */

//
// Question Database Types
//

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
 * Data for a single test case
 * @typedef {Object} TestCase
 * @property {string} ANSWER - The expected output of the test case
 * @property {string} [key] - Other key-value pairs exist, where the key can be any string. The value associated with these other keys are also strings.
 */

/**
 * How the important metadata for each question is stored in the database
 * @typedef {Object} Metadata
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
 * @property {TestCase[]} test_cases - The test cases
 * @property {Metadata} metadata - The important metadata
 * @property {string} description - The description of the question
 */

//
// User Database Types
//

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
