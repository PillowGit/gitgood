"use client";

import Editor from "@monaco-editor/react";
import { languageList } from "@/constants/languageList";

function RuntimeForm({
  codeLanguage,
  setCodeLanguage,
  mapLanguage,
  codeTemplate,
  setCodeTemplate,
  codeSolution,
  setCodeSolution,
  inputs,
  setInputs,
  tester,
  setTester
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm">
          <strong>
            This section handles your challenge's logic. You are responsible for
            creating all of your test cases, parsing them, providing the template for the user,
            and running the parsed test cases against your solution. Imagine all of these sections were combined to
            create one large file. 

          </strong>
        </label>
        <label className="block text-sm">
          What language does this problem use? (you can add additional
          submission languages after publishing)
        </label>
        <select
          className="w-full bg-[#333333] border-none text-white p-3 rounded"
          value={codeLanguage}
          onChange={e => setCodeLanguage(e.target.value)}
        >
          <option value="c++">c++</option>
          <option value="python">python3</option>
          {languageList.map(language => {
            return (
              <option key={language} value={language}>
                {language}
              </option>
            );
          })}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm">
          Write down all of the testcases and ensure that that they can be
          parsed in the function that you create at the very bottom.
        </label>
        <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <Editor
            id="inputs"
            language={mapLanguage(codeLanguage)}
            onChange={(value, event) => setInputs(value?.split("\n") || [])}
            theme="vs-dark"
            defaultValue={`std::vector<int> testCases = {5, 10, 15, 20};`}
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
          Write the template function that users must complete. Ensure all of the parameters are in the header.
        </label>
        <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <Editor
            id="codeTemplate"
            language={mapLanguage(codeLanguage)}
            onChange={(value, event) => setCodeTemplate(value?.split("\n") || [])}
            theme="vs-dark"
            defaultValue={`bool isNOdd(int n) {
  // code 
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
          Write a solution to your problem.
        </label>
        <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <Editor
            id="codeSolution"
            language={mapLanguage(codeLanguage)}
            onChange={(value, event) => setCodeSolution(value?.split("\n") || [])}
            theme="vs-dark"
            defaultValue={`bool solution(int n) {
  return n % 2;
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
          Finally, write a function that tests the inputs you generated with the
          user's template function vs your solution. If it passes all test
          cases, this should only output "all" to stdout. If it fails the first
          test, it should print 1, if it fails the second test, etc.
        </label>

        <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <Editor
            id="parseCode"
            language={mapLanguage(codeLanguage)}
            onChange={(value, event) => setTester(value?.split("\n") || [])}
            theme="vs-dark"
            defaultValue={`void testing() {
  for (int i = 0; i < testCases.size(); i++) {
    int n = testCases[i]
    if (isNOdd(n) != solution(n)) { 
      std::cout << i + 1; 
      return;
    }
  }
  std::cout << "all";
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
