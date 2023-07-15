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
          let suggestions = [
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
              label: "platform('nearpad.dev')",
              kind: monaco.languages.CompletionItemKind.Method,
              insertText: "platform('nearpad.dev')",
            },
            {
              label: `console.log("")`,
              kind: monaco.languages.CompletionItemKind.Method,
              insertText: "console.log($1)",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range: new monaco.Range(
                position.lineNumber,
                position.column - 1,
                position.lineNumber,
                position.column - 1
              ),
              detail: "Log a message to the console",
            },

            {
              label: `<Widget src="" />`,
              kind: monaco.languages.CompletionItemKind.Method,
              insertText: `<Widget src="$1" props={{$2}}/>`,
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range: new monaco.Range(
                position.lineNumber,
                position.column - 100,
                position.lineNumber,
                position.column - 100
              ),
              detail: "Add a near widget",
            },

            // Add more suggestions as needed
          ];

          const wordUntilPosition = model.getWordUntilPosition(position);
          const { word } = wordUntilPosition;

          console.log(word);

          // Show suggestions for properties and methods of console object
          if (word == "badhon") {
            console.log("THE ORLD I badhon!!!");
            suggestions.push({
              label: "warn",
              kind: monaco.languages.CompletionItemKind.Method,
              insertText: "warn($1)",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range: new monaco.Range(
                position.lineNumber,
                position.column - word.length,
                position.lineNumber,
                position.column
              ),
              detail: "Log a warning message to the console",
            });
          }

          return { suggestions };
        },
      });
    }
  }, [monacoRef]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  return <Editor {...props} editorDidMount={handleEditorDidMount} />;
}
