"use client";

import Editor from "@monaco-editor/react";

function RuntimeForm({ codeLanguage, setCodeLanguage, mapLanguage, codeTemplate, setCodeTemplate, codeSolution, setCodeSolution }) {
  return (
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
  );
}

export default RuntimeForm;
