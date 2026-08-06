export const LANGUAGES = [
  { id: "cpp", label: "C++", ext: "cpp" },
  { id: "java", label: "Java", ext: "java" },
  { id: "python", label: "Python", ext: "py" },
  { id: "javascript", label: "JavaScript", ext: "js" },
  { id: "typescript", label: "TypeScript", ext: "ts" },
  { id: "c", label: "C", ext: "c" },
  { id: "csharp", label: "C#", ext: "cs" },
  { id: "go", label: "Go", ext: "go" },
  { id: "rust", label: "Rust", ext: "rs" },
  { id: "ruby", label: "Ruby", ext: "rb" },
];

export const LANGUAGE_MAP = {
  cpp: "CPP",
  java: "JAVA",
  python: "PYTHON",
  javascript: "JAVASCRIPT",
  typescript: "TYPESCRIPT",
  c: "C",
  csharp: "CSHARP",
  go: "GO",
  rust: "RUST",
  ruby: "RUBY",
};

const TEMPLATES = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your solution here

    return 0;
}
`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Write your solution here
    }
}
`,
  python: `def solve():
    # Write your solution here
    pass


if __name__ == "__main__":
    solve()
`,
  javascript: `function solve() {
  // Write your solution here
}

solve();
`,
  typescript: `function solve(): void {
  // Write your solution here
}

solve();
`,
  c: `#include <stdio.h>

int main(void) {
    // Write your solution here

    return 0;
}
`,
  csharp: `using System;

class Program {
    static void Main() {
        // Write your solution here
    }
}
`,
  go: `package main

import "fmt"

func main() {
    // Write your solution here
    _ = fmt.Sprint
}
`,
  rust: `fn main() {
    // Write your solution here
}
`,
  ruby: `def solve
  # Write your solution here
end

solve
`,
};

export function getStarterTemplate(languageId, problemTitle) {
  const body = TEMPLATES[languageId] || "// Write your solution here\n";
  if (!problemTitle) return body;

  const commentStyle = languageId === "python" || languageId === "ruby" ? "#" : "//";
  return `${commentStyle} ${problemTitle}\n${body}`;
}