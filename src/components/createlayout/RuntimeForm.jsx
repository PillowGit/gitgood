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
            This section handles your challenge's logic. You are responsible for writing
            all the test case variables, solution function, template function, and the 
            function that will run tests between the two. Your code will not be executed
            and quality checked, so please ensure that it is correct.
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
          Write down (hard code) all of the testcase variables in this function. Note that this
          is the top of the file, so you should add any libraries you want here. Also
          note that if you are using a language that requires a main function, you
          will need to add that main function somewhere in the code.
        </label>
        <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <Editor
            id="inputs"
            language={mapLanguage(codeLanguage)}
            onChange={(value, event) => setInputs(value?.split("\n") || [])}
            theme="vs-dark"
            defaultValue={`#include <vector>\n#include <iostream>\nstd::vector<int> testCases = {5, 10, 15, 20};`}
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
          The user will get this empty function, and it shoudl be clear for them to fill out and submit.
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
          Write a solution function to your problem. This is the function that will be
          compared against the user's template function.
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
          cases, this should only output "all" to stdout. If it fails, then any
          output you make will be shown to the user.
        </label>

        <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <Editor
            id="parseCode"
            language={mapLanguage(codeLanguage)}
            onChange={(value, event) => setTester(value?.split("\n") || [])}
            theme="vs-dark"
            defaultValue={`void testing() {
  for (int i = 0; i < testCases.size(); i++) {
    int n = testCases[i];
    if (isNOdd(n) != solution(n)) { 
      std::cout << n << " is wrong"; 
      return;
    }
  }
  std::cout << "all";
}
int main() {
  testing();
  return 0;
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
