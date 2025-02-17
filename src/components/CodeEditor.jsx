import Editor from '@monaco-editor/react';

export default function CodeEditor({ editorRef, settings }) {

  function handleMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <Editor
      onMount={handleMount}
      height="100%"
      defaultLanguage={settings?.language || 'javascript'}
      defaultValue={settings?.code || '// Start coding here!'}
      theme={settings?.theme || 'vs-dark'}
    />
  )
}