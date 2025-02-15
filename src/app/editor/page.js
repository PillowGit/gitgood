"use client";

import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";

import CodeEditor from "@/components/CodeEditor";

export default function Page() {

  // When setting up a new editor, pass in a useRef() object to get the editor instance
  // And also pass in a settings object with the language, code, and theme
  const editorRef = useRef(null);
  const editorSettings = {
    language: "python",
    code: `def hello_world():
  print("Hello, World!")
  return "Hello, World!"`,
    theme: "vs-dark",
  };

  // Demonstration of extracting lines from the editor, super easily
  // lines is an array of strings, each string representing a line of code
  function printLines() {
    const editor = editorRef.current;
    const model = editor.getModel();
    const lines = model.getLinesContent();
    alert(lines);
  }

  return (
    <>
    <div className="w-screen min-h-screen bg-[#131313] flex justify-center items-center flex-col">
      <div className="border border-red-600 w-[50vw] h-[50vh]">
        <CodeEditor editorRef={editorRef} settings={editorSettings}/>
        <button onClick={printLines}>Print Lines</button>
      </div>
    </div>
    </>
  );
}