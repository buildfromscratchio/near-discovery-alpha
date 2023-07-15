import React, { useEffect, useRef } from "react";

import * as monaco from "monaco-editor";
import { Editor, useMonaco } from "@monaco-editor/react";

export default function EditorContainer(props) {
  const editorRef = useRef(null);
  const monacoRef = useMonaco();

  useEffect(() => {
    if (monacoRef) {
      monacoRef.languages.registerCompletionItemProvider("javascript", {
        provideCompletionItems: (model, position) => {
          const suggestions = [
            {
              label: "console",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "console",
            },
            {
              label: "log3",
              kind: monaco.languages.CompletionItemKind.Method,
              insertText: "log3",
            },
            {
              label: "platform",
              kind: monaco.languages.CompletionItemKind.Method,
              insertText: "platform('nearpad.dev')",
            },
            // Add more suggestions as needed
          ];

          return { suggestions };
        },
      });
    }
  }, [monacoRef]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      {...props}
      // language="javascript"
      // defaultLanguage="javascript"
      // onMount={(editor, monaco) => {
      //   editorRef.current = editor;
      // }}

      editorDidMount={handleEditorDidMount}

      // editorDidMount={(editor, monaco) => {
      //   editorRef.current = editor;
      // }}

      //   // This is for props
      //   theme={theme.name === "dark" ? "vs-dark" : "light"}
      //   options={{
      //     minimap: {
      //       enabled: false,
      //     },
      //     wordWrap: "on",
      //     fontSize: editorFontSize || "16px",
      //   }}
      //   value={code}
      //   path={widgetPath}
      //   defaultLanguage="javascript"
      //   onChange={(code) => {
      //     if (showLiveCodePreview) debouncedFunction();
      //     updateCode(path, code);
      //   }}
      //   wrapperProps={{
      //     onBlur: () => reformat(path, code),
      //   }}
    />
  );
}
