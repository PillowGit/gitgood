"use client";

import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";

import { proxySubmitQuestion } from "@/lib/proxies/submissions";

export default function ProblemEditor({
  codeData,
  editorLanguage,
  setEditorLanguage,
  editorCode,
  setEditorCode,
  language_mappings,
  session,
  questionid
}) {
  // Editor state handling
  const editorRef = useRef(null);
  const [editorLines, setEditorLines] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }
  function handleEditorChange(value, event) {
    setEditorCode(value);
  }

  // Submit code

  // Converts "monaco friendly" language names to "piston friendly" language names
  function getLanguage(lang) {
    if (lang === "cpp") {
      return "c++";
    } else if (lang === "python") {
      return "python3";
    } else {
      return lang;
    }
  }

  function getLines() {
    const editor = editorRef.current;
    const model = editor.getModel();
    const lines = model.getLinesContent();
    setEditorLines(lines);
    return lines;
  }

  function submit() {
    alert("Submitting code... Please wait.");
    setSubmitting(true);
    const lines = getLines();
    const lang = getLanguage(editorLanguage);
    proxySubmitQuestion(lang, questionid, lines).then((res) => {
      console.log(res);
      if (res.error) {
        console.error("Error submitting code: ", res.error);
        alert(res.error);
      } else {
        window.location.href = res.redirect_to;
      }
      setSubmitting(false);
    });
  }

  return (
    <>
      <div className="w-full md:w-1/2 p-4 md:p-6 lg:p-8 flex flex-col h-[calc(100vh-4rem)] md:h-auto">

        {/* Editor Top Bar */}
        <div className="flex justify-between items-center mb-3">

          {/* Language Picker (TODO: implement later) */}
          {/*<div>
            <label htmlFor="language-select" className="sr-only">Language</label>
            <select
              id="language-select"
              value={editorLanguage}
              onChange={(e) => setEditorLanguage(language_mappings[e.target.value] || e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
            >
              {Object.entries(codeData).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.language}
                </option>
              ))}
            </select>
          </div>*/}

          {/* Submit */}
          <div className="flex gap-2">
            <button
              className={ !session ?
                "font-bold py-2 px-4 rounded transition duration-150 ease-in-out bg-green-800 text-gray-400 cursor-not-allowed"
                : "font-bold py-2 px-4 rounded transition duration-150 ease-in-out bg-green-600 hover:bg-green-500 text-white"
              }
              disabled={!session || submitting}
              title={!session ? "Login to submit" : "Submit"}
              onClick={submit}
            >
              {!session ? "Login to submit" : "Submit"}
            </button>
          </div>

        </div>

        {/* Editor */}
        <div className="flex-grow border border-gray-700 rounded-md overflow-hidden h-64 md:h-auto">
          <Editor 
            height="100%"
            language={editorLanguage}
            theme="vs-dark"
            defaultValue={editorCode || "// Start coding here!"}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
            options={{
              fontSize: 14,
              lineHeight: 1.5,
              fontFamily: "Fira Code, Consolas, 'Courier New', monospace",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              wrappingIndent: "indent",
              minimap: { enabled: false },
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
            }}
          />
        </div>

      </div>
    </>
  );
}