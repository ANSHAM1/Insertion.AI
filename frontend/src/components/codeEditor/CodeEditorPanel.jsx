import React from "react";
import Editor from "@monaco-editor/react";

export function defineInsertionTheme(monaco) {
  monaco.editor.defineTheme("insertion-dark", {
    base: "vs-dark",
    inherit: true,

    rules: [
      { token: "comment", foreground: "6B7280", fontStyle: "italic" },
      { token: "keyword", foreground: "FF7A1A", fontStyle: "bold" },
      { token: "string", foreground: "4ADE80" },
      { token: "number", foreground: "FBBF24" },
      { token: "regexp", foreground: "22C55E" },
      { token: "type", foreground: "60A5FA" },
      { token: "function", foreground: "38BDF8" },
      { token: "operator", foreground: "C084FC" },
      { token: "variable", foreground: "E5E7EB" },
    ],

    colors: {
      "editor.background": "#0B0B0D",
      "editor.foreground": "#E5E7EB",
      "editorCursor.foreground": "#FF7A1A",
      "editor.selectionBackground": "#FF7A1A33",
      "editor.lineHighlightBackground": "#141416",
      "editorLineNumber.foreground": "#4B5563",
      "editorLineNumber.activeForeground": "#FF7A1A",
      "editorGutter.background": "#0B0B0D",
    },
  });
}

const LANGUAGE_MAP = {
  cpp: "cpp",
  c: "c",
  python: "python",
  java: "java",
  javascript: "javascript",
  typescript: "typescript",
  rust: "rust",
  go: "go",
};

export default function CodeEditorPanel({ code, setCode, languageId }) {
  return (
    <div className="flex-1 overflow-hidden bg-[#0b0b0d]">
      <Editor
        beforeMount={defineInsertionTheme}
        theme="insertion-dark"
        height="100%"
        language={LANGUAGE_MAP[languageId] ?? "plaintext"}
        value={code}
        onChange={(value) => setCode(value ?? "")}
        options={{
          fontSize: 14,
          fontFamily: "JetBrains Mono, Consolas, monospace",

          minimap: {
            enabled: false,
          },

          lineNumbers: "on",

          wordWrap: "on",

          automaticLayout: true,

          scrollBeyondLastLine: false,

          smoothScrolling: true,

          mouseWheelZoom: true,

          tabSize: 4,

          insertSpaces: true,

          formatOnPaste: true,

          formatOnType: true,

          autoIndent: "advanced",

          bracketPairColorization: {
            enabled: true,
          },

          guides: {
            bracketPairs: true,
            indentation: true,
          },

          quickSuggestions: true,

          suggestOnTriggerCharacters: true,

          acceptSuggestionOnCommitCharacter: true,

          acceptSuggestionOnEnter: "on",

          parameterHints: {
            enabled: true,
          },

          inlineSuggest: {
            enabled: true,
          },

          autoClosingBrackets: "always",

          autoClosingQuotes: "always",

          autoSurround: "languageDefined",

          matchBrackets: "always",

          folding: true,

          foldingStrategy: "indentation",

          renderWhitespace: "selection",

          cursorBlinking: "smooth",

          cursorSmoothCaretAnimation: "on",

          padding: {
            top: 16,
            bottom: 16,
          },
        }}
      />
    </div>
  );
}
