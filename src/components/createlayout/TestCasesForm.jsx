"use client";

export default function TestCasesForm({ testCases, setTestCases }) {
  return (
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
              <label className="block text-sm">Custom Inputs for Key</label>
              {testCase.key &&
              typeof testCase.key === "object" &&
              Object.keys(testCase.key).length > 0 ? (
                Object.entries(testCase.key).map(([inputName, value], kIndex) => (
                  <div key={kIndex} className="flex items-center gap-2">
                    {/* Input Name Field */}
                    <input
                      type="text"
                      placeholder="Input Name"
                      value={inputName}
                      onChange={(e) => {
                        const newTestCases = [...testCases];
                        const newKeyObj = { ...newTestCases[index].key };
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
                        const newKeyObj = { ...newTestCases[index].key };
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
                        const newKeyObj = { ...newTestCases[index].key };
                        delete newKeyObj[inputName];
                        newTestCases[index].key = newKeyObj;
                        setTestCases(newTestCases);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No custom inputs added.</div>
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
                  const newInputName = "input" + (Object.keys(keyObj).length + 1);
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
          onClick={() => setTestCases([...testCases, { ANSWER: "", key: {} }])}
          className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white py-2 px-4 rounded"
        >
          Add Test Case
        </button>
      </div>
    </div>
  );
}
