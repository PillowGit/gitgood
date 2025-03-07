"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Editor from "@monaco-editor/react";

/**
 * CreateQuestion component for adding a new coding question.
 *
 * This component allows users to input the question details such as title, difficulty, tags, and coding solution.
 * It also provides a submit button to submit the data to an API endpoint.
 *
 * @component
 * @example
 * return (
 *   <CreateQuestion />
 * );
 */
export default function CreateQuestion() {
  /**
   * State for the question description.
   * @type {string}
   */
  const [description, setDescription] = useState("");

  /**
   * State for the title of the question.
   * @type {string}
   */
  const [title, setTitle] = useState("");

  /**
   * State for difficulty sum.
   * @type {number}
   */
  const [difficultySum, setDifficultySum] = useState(5);

  /**
   * State for checking if we are editing the difficulty bar.
   * @type {bool}
   */
  const [editMode, setEditMode] = useState(false);

  /**
   * State for public display setting.
   * @type {Array<bool>}
   */

  const [displayPublicly, setDisplayPublicly] = useState(true);

  /**
   * State for tags.
   * @type {Object}
   */
  const [tags, setTags] = useState({
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
    bit_mask: false
  });

  const changeTags = (e) => {
    setTags(e.target.value.split(",").map((tag) => tag.trim()));
  };

  /**
   * State for programming languages.
   * @type {Array<string>}
   */
  const [languages, setLanguages] = useState([]);

  /**
   * State for curernt programming language.
   * @type {string}
   */

  const [selectedLanguage, setSelectedLanguage] = useState("");

  /**
   * State for code template.
   * @type {string}
   */
  const [codeTemplate, setCodeTemplate] = useState("");

  /**
   * State for code solution.
   * @type {string}
   */
  const [codeSolution, setCodeSolution] = useState("");

  /**
   * State for test cases.
   * @type {Array<{ANSWER: string, key: string}>}
   */
  const [testCases, setTestCases] = useState([{ ANSWER: "", key: "" }]);

  /**
   * State for active tab.
   * @type {string}
   */
  const [activeTab, setActiveTab] = useState("basic-info");

  /**
   * State for code langauge used.
   * @type {string}
   */
  const [codeLanguage, setCodeLanguage] = useState("C++");

  function mapLanguage(lang) {
    const normalized = lang.trim().toLowerCase();
    if (normalized === "c++" || normalized === "c") {
      return "cpp";
    }
    if (normalized === "javascript") {
      return "javascript";
    }
    if (normalized === "java") {
      return "java";
    }
    if (normalized === "python" || normalized === "python3") {
      return "python";
    }
    // Return the normalized language if no mapping is needed
    return normalized;
  }

  /**
   * Handles form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newQuestion = {
      description,
      metadata: {
        title,
        difficulty_votes: 1,
        difficulty_sum: difficultySum,
        tags: Object.keys(tags).filter((tag) => tags[tag]),
        languages,
        display_publicly: displayPublicly
      },
      code: {
        language: codeLanguage,
        inputs: ["string"],
        template: [codeTemplate],
        solution: [codeSolution],
        tester: ["string"]
      },
      test_cases: testCases
    };

    // try {
    //   const response = await fetch("/api/questions/create", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(newQuestion),
    //   });

    //   if (response.ok) {
    //     alert("Question created successfully!");
    //   } else {
    //     const data = await response.json();
    //     alert(`Error: ${data.error}`);
    //   }
    // } catch (error) {
    //   console.error("Error submitting question:", error);
    //   alert("Something went wrong, please try again later.");
    // }
    console.log(newQuestion);
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-4 max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-2">
        <ChevronLeft className="h-5 w-5" />
        <span className="font-medium">My Creations</span>
      </div>

      <div className="flex mb-6 space-x-2">
        <button
          className={`rounded-full px-4 py-2 ${
            activeTab === "basic-info"
              ? "bg-[#4a4a4a]"
              : "bg-[#333333] hover:bg-[#444444]"
          }`}
          onClick={() => setActiveTab("basic-info")}
        >
          Basic Info
        </button>
        <button
          className={`rounded-full px-4 py-2 ${
            activeTab === "test-cases"
              ? "bg-[#4a4a4a]"
              : "bg-[#333333] hover:bg-[#444444]"
          }`}
          onClick={() => setActiveTab("test-cases")}
        >
          Test Cases
        </button>
        <button
          className={`rounded-full px-4 py-2 ${
            activeTab === "runtime"
              ? "bg-[#4a4a4a]"
              : "bg-[#333333] hover:bg-[#444444]"
          }`}
          onClick={() => setActiveTab("runtime")}
        >
          Runtime
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === "basic-info" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter question title"
                className="w-full bg-[#333333] border-none text-white p-3 rounded"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm">
                Description (markdown supported)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter question description"
                className="w-full min-h-[180px] bg-[#333333] border-none text-white p-3 rounded resize-y"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={difficultySum}
                  onChange={(e) => setDifficultySum(parseFloat(e.target.value))}
                  className="w-full"
                />
                {editMode ? (
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={difficultySum}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setDifficultySum(
                        isNaN(val)
                          ? difficultySum
                          : Math.min(10, Math.max(0.1, val))
                      );
                    }}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      setDifficultySum(
                        isNaN(val)
                          ? difficultySum
                          : Math.min(10, Math.max(0.1, val))
                      );
                      setEditMode(false);
                    }}
                    autoFocus
                    className="mt-2 bg-[#333333] rounded px-3 py-1 w-16 text-center"
                  />
                ) : (
                  <div
                    className="mt-2 bg-[#333333] rounded px-3 py-1 w-16 text-center cursor-pointer"
                    onClick={() => setEditMode(true)}
                  >
                    {difficultySum.toFixed(1)}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-center">
                  Display Publicly?
                  <br />
                  If unchecked, your question can only be accessed via link
                </label>
                <div className="flex justify-center items-center h-12">
                  <div className="h-6 w-6 rounded bg-[#333333] flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={displayPublicly}
                      onChange={(e) => setDisplayPublicly(e.target.checked)}
                      className="h-6 w-6 rounded bg-[#333333] accent-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-center">
                  How many test cases should
                  <br />
                  users see?
                </label>
                <div className="flex justify-center">
                  <input
                    type="number"
                    min="0"
                    defaultValue="3"
                    className="w-16 text-center bg-[#333333] border-none text-white p-2 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="languages" className="block text-sm">
                Programming Languages
              </label>
              <div className="flex items-center space-x-2">
                <select
                  id="languages"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-[#333333] border-none text-white p-3 rounded"
                >
                  <option value="">Select a Language</option>
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                  <option value="Python3">Python3</option>
                  <option value="C">C</option>
                  <option value="JavaScript">JavaScript</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      selectedLanguage &&
                      !languages.includes(selectedLanguage)
                    ) {
                      setLanguages([...languages, selectedLanguage]);
                      setSelectedLanguage("");
                    }
                  }}
                  className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white py-2 px-4 rounded"
                >
                  Add
                </button>
              </div>
              {languages.length > 0 && (
                <ul className="mt-2">
                  {languages.map((lang, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span>{lang}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setLanguages(languages.filter((l) => l !== lang))
                        }
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="block text-sm">
                Question Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(tags).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setTags({
                        ...tags,
                        [tag]: !tags[tag]
                      })
                    }
                    className={`px-3 py-1 rounded ${
                      tags[tag]
                        ? "bg-blue-500 text-white"
                        : "bg-[#333333] text-white"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "test-cases" && (
          <div className="space-y-6">
            {/* JSON Preview */}
            <div className="space-y-2">
              <label htmlFor="testCases" className="block text-sm">
                Test Cases (JSON format)
              </label>
              <textarea
                id="testCases"
                value={JSON.stringify(testCases, null, 2)}
                onChange={(e) => {
                  try {
                    setTestCases(JSON.parse(e.target.value));
                  } catch (error) {
                    // Optionally handle JSON parse error here
                  }
                }}
                placeholder="Enter test cases in JSON format"
                className="w-full min-h-[120px] bg-[#333333] border-none text-white p-3 rounded resize-y font-mono text-sm"
              />
            </div>

            {/* Elegant UI for editing test cases */}
            <div className="space-y-2">
              <label className="block text-sm">Add / Edit Test Cases</label>
              {testCases.map((testCase, index) => (
                <div key={index} className="space-y-4 border p-3 rounded">
                  {/* Answer Input */}
                  <div className="flex items-center gap-2">
                    <label className="w-20">Answer:</label>
                    <input
                      type="text"
                      placeholder="Answer"
                      value={testCase.ANSWER}
                      onChange={(e) => {
                        const newTestCases = [...testCases];
                        newTestCases[index].ANSWER = e.target.value;
                        setTestCases(newTestCases);
                      }}
                      className="w-full bg-[#333333] border-none text-white p-2 rounded"
                    />
                  </div>

                  {/* Custom Inputs for the "key" */}
                  <div className="space-y-2">
                    <label className="block text-sm">
                      Custom Inputs for Key
                    </label>
                    {testCase.key &&
                    typeof testCase.key === "object" &&
                    Object.keys(testCase.key).length > 0 ? (
                      Object.entries(testCase.key).map(
                        ([inputName, value], kIndex) => (
                          <div key={kIndex} className="flex items-center gap-2">
                            {/* Input Name Field */}
                            <input
                              type="text"
                              placeholder="Input Name"
                              value={inputName}
                              onChange={(e) => {
                                const newTestCases = [...testCases];
                                const newKeyObj = {
                                  ...newTestCases[index].key
                                };
                                const newInputName = e.target.value;
                                // Rename the key
                                delete newKeyObj[inputName];
                                newKeyObj[newInputName] = value;
                                newTestCases[index].key = newKeyObj;
                                setTestCases(newTestCases);
                              }}
                              className="w-1/2 bg-[#333333] border-none text-white p-2 rounded"
                            />

                            {/* Input Value Field */}
                            <input
                              type="text"
                              placeholder="Value"
                              value={value}
                              onChange={(e) => {
                                const newTestCases = [...testCases];
                                const newKeyObj = {
                                  ...newTestCases[index].key
                                };
                                newKeyObj[inputName] = e.target.value;
                                newTestCases[index].key = newKeyObj;
                                setTestCases(newTestCases);
                              }}
                              className="w-1/2 bg-[#333333] border-none text-white p-2 rounded"
                            />

                            {/* Remove Key Field */}
                            <button
                              type="button"
                              onClick={() => {
                                const newTestCases = [...testCases];
                                const newKeyObj = {
                                  ...newTestCases[index].key
                                };
                                delete newKeyObj[inputName];
                                newTestCases[index].key = newKeyObj;
                                setTestCases(newTestCases);
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        )
                      )
                    ) : (
                      <div className="text-gray-400">
                        No custom inputs added.
                      </div>
                    )}

                    {/* Button to add a new custom input */}
                    <button
                      type="button"
                      onClick={() => {
                        const newTestCases = [...testCases];
                        let keyObj = newTestCases[index].key;
                        if (typeof keyObj !== "object" || keyObj === null) {
                          keyObj = {};
                        }
                        // Generate a default input name based on the current count
                        const newInputName =
                          "input" + (Object.keys(keyObj).length + 1);
                        keyObj[newInputName] = "";
                        newTestCases[index].key = keyObj;
                        setTestCases(newTestCases);
                      }}
                      className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white py-2 px-4 rounded"
                    >
                      Add Custom Input
                    </button>
                  </div>

                  {/* Remove entire test case */}
                  <button
                    type="button"
                    onClick={() =>
                      setTestCases(testCases.filter((_, i) => i !== index))
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Remove Test Case
                  </button>
                </div>
              ))}

              {/* Button to add a new test case */}
              <button
                type="button"
                onClick={() =>
                  setTestCases([...testCases, { ANSWER: "", key: {} }])
                }
                className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white py-2 px-4 rounded"
              >
                Add Test Case
              </button>
            </div>
          </div>
        )}

        {activeTab === "runtime" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm">
                What Language does this problem use? (you can add additional
                submission languages after publishing)
              </label>
              <select
                className="w-full bg-[#333333] border-none text-white p-3 rounded"
                defaultValue="C++"
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
              >
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
                <option value="Python3">Python3</option>
                <option value="C">C</option>
                <option value="JavaScript">JavaScript</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm">
                Write a function that can parse your Test Cases
              </label>
              <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg">
                <Editor
                  id="parseCode"
                  language={mapLanguage(codeLanguage) || "javascript"}
                  theme="vs-dark"
                  defaultValue={`std::vector<void*> parsed;
void parser() {
// parsing
}`}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    automaticLayout: true
                  }}
                  className="w-full h-64" // fixed height for better consistency
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm">
                Write a template function for users to put their solution in
              </label>
              <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg">
                <Editor
                  id="codeTemplate"
                  language={mapLanguage(codeLanguage) || "javascript"}
                  onChange={(value, event) => setCodeTemplate(value)}
                  theme="vs-dark"
                  defaultValue={`void solution() {
  // code here
}`}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    automaticLayout: true
                  }}
                  className="w-full h-64" // fixed height for better consistency
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm">
                Write a solution to your problem
              </label>
              <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg">
                <Editor
                  id="codeSolution"
                  language={mapLanguage(codeLanguage) || "javascript"}
                  onChange={(value, event) => setCodeSolution(value)}
                  theme="vs-dark"
                  defaultValue={`void solution() {
  // code here
}`}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    automaticLayout: true
                  }}
                  className="w-full h-64" // fixed height for better consistency
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm">
                Finally, write a function that tests the inputs you generated
                with the user's template function vs your solution. If it passes
                all test cases, this should only output "all to stdout. If it
                fails the first test, it should print 1, if it fails the second
                test, etc.
              </label>

              <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg">
                <Editor
                  id="parseCode"
                  language={mapLanguage(codeLanguage) || "javascript"}
                  theme="vs-dark"
                  defaultValue={`void testing() {
  // code here
}`}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    automaticLayout: true
                  }}
                  className="w-full h-64" // fixed height for better consistency
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            className="w-full bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white py-3 px-4 rounded transition-colors"
          >
            Create Question
          </button>
        </div>
      </form>
    </div>
  );
}
