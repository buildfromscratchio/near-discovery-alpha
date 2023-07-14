import React, { useEffect, useRef } from "react";

import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";

export default function EditorContainer(props) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.editor;

      monaco.languages.registerCompletionItemProvider("javascript", {
        provideCompletionItems: () => {
          const suggestions = [
            {
              label: "console",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "console",
            },
            {
              label: "log",
              kind: monaco.languages.CompletionItemKind.Method,
              insertText: "log",
            },
            // Add more suggestions as needed
          ];

          return { suggestions };
        },
      });
    }
  }, []);

  return (
    <Editor
      {...props}
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
