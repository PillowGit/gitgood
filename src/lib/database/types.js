//
// Generic Types
//

/**
 * Error message object
 * @typedef {Object} DatabaseError
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
 * The available tags for a question
 * @typedef {Object} Tags
 * @property {boolean} array - The array tag
 * @property {boolean} string - The string tag
 * @property {boolean} hash_table - The hash_table tag
 * @property {boolean} dp - The dp tag
 * @property {boolean} math - The math tag
 * @property {boolean} sorting - The sorting tag
 * @property {boolean} greedy - The greedy tag
 * @property {boolean} dfs - The dfs tag
 * @property {boolean} bfs - The bfs tag
 * @property {boolean} binary_search - The binary_search tag
 * @property {boolean} matrix - The matrix tag
 * @property {boolean} tree - The tree tag
 * @property {boolean} bit_manipulation - The bit_manipulation tag
 * @property {boolean} two_pointer - The two_pointer tag
 * @property {boolean} heap - The heap tag
 * @property {boolean} stack - The stack tag
 * @property {boolean} graph - The graph tag
 * @property {boolean} sliding_window - The sliding_window tag
 * @property {boolean} back_tracking - The back_tracking tag
 * @property {boolean} linked_list - The linked_list tag
 * @property {boolean} set - The set tag
 * @property {boolean} queue - The queue tag
 * @property {boolean} memo - The memo tag
 * @property {boolean} recursion - The recursion tag
 * @property {boolean} hashing - The hashing tag
 * @property {boolean} bit_mask - The bit_mask tag
 */

/**
 * How the important metadata for each question is stored in the database
 * @typedef {Object} Metadata
 * @property {string} title - The title of the question
 * @property {number} difficulty_sum - The sum of the difficulty ratings of the question
 * @property {number} difficulty_votes - The number of difficulty ratings given to the question
 * @property {number} difficulty - The average difficulty rating of the question
 * @property {number} votes_bad - The number of "bad" votes given to the question
 * @property {number} votes_good - The number of "good" votes given to the question
 * @property {number} votes_sum - The sum of the votes given to the question
 * @property {Tags} tags - The tags associated with the question
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

//
// Data Query Types
//

/**
 * An object defining options for a query. All fields are required. Leave fields empty if not needed/wanted.
 * @typedef {Object} QueryOptions
 * @property {Tags} tags - The tags to filter by. Only one can be marked as true, as you can only filter by one tag at a time.
 * @property {string} order_by - The field to order by. Can be empty string, "difficulty", "votes", "updated", or "created"
 * @property {boolean} order_asc - Whether to order in ascending order
 * @property {number} limit - The maximum number of results to return. Absolute max is 20
 * @property {string} start_after - The question ID to start after. Leave empty if not wanted. Cannot have both start_after and start_at
 * @property {string} start_at - The question ID to start at. Leave empty if not wanted. Cannot have both start_after and start_at
 * @property {string} difficulty - The difficulty to filter by. "easy", "medium", "hard", or empty string. Easy is 0.0-3.2, medium is 3.3-6.6, hard is 6.7-10.0, empty is no filter
 * @property {string} difficulty_range - The difficulty range to filter by, if custom range is wanted. Format is "0.0-10.0". Range is inclusive and must be between 0.0-10.0. Leave empty if not wanted. Only gets checked if "difficulty" is empty
 * @property {string} author - The ID of the author to filter by. Leave empty if not wanted
 * @property {string} language - The language to filter by. Leave empty if not wanted
 */
