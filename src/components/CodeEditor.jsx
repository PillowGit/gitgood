import Editor from '@monaco-editor/react';

export default function CodeEditor({ editorRef, settings }) {

  function handleMount(editor, monaco) {
    editorRef.current = editor;
  }

  const language_mappings = {
    'c++': 'cpp',
    'C++': 'cpp',
    'Python': 'python',
    'Python3': 'python',
  }
  return (
    <Editor
      onMount={handleMount}
      height="100%"
      defaultLanguage={!settings?.language ? 'javascript' : language_mappings[settings?.language] || settings?.language}
      defaultValue={settings?.code || '// Start coding here!'}
      theme={settings?.theme || 'vs-dark'}
      minimap={{ enabled: false }}
      options={{
        fontSize: 14,
        lineHeight: 1.5,
        fontFamily: 'Fira Code, monospace',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        wrappingIndent: 'indent',
      }}
    />
  )
}