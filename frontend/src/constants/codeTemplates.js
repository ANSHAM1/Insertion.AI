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

/*
 * Approach:
 * Time Complexity:  O(?)
 * Space Complexity: O(?)
 */
class Solution {
public:
    void solve() {
        // Write your solution here

    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    Solution sol;
    sol.solve();

    return 0;
}
`,
  java: `import java.util.*;
import java.io.*;

public class Main {
    /*
     * Approach:
     * Time Complexity:  O(?)
     * Space Complexity: O(?)
     */
    static void solve() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

        // Write your solution here

    }

    public static void main(String[] args) throws IOException {
        solve();
    }
}
`,
  python: `import sys


def solve():
    """
    Approach:
    Time Complexity:  O(?)
    Space Complexity: O(?)
    """
    data = sys.stdin.read().split()

    # Write your solution here
    pass


if __name__ == "__main__":
    solve()
`,
  javascript: `'use strict';

/**
 * Approach:
 * Time Complexity:  O(?)
 * Space Complexity: O(?)
 */
function solve(input) {
  // Write your solution here
}

const data = require('fs').readFileSync('/dev/stdin', 'utf8').trim();
solve(data);
`,
  typescript: `/**
 * Approach:
 * Time Complexity:  O(?)
 * Space Complexity: O(?)
 */
function solve(input: string): void {
  // Write your solution here
}

const data: string = require('fs').readFileSync('/dev/stdin', 'utf8').trim();
solve(data);
`,
  c: `#include <stdio.h>
#include <stdlib.h>

/*
 * Approach:
 * Time Complexity:  O(?)
 * Space Complexity: O(?)
 */
void solve(void) {
    // Write your solution here

}

int main(void) {
    solve();
    return 0;
}
`,
  csharp: `using System;
using System.IO;

class Program {
    /*
     * Approach:
     * Time Complexity:  O(?)
     * Space Complexity: O(?)
     */
    static void Solve() {
        // Write your solution here

    }

    static void Main() {
        Solve();
    }
}
`,
  go: `package main

import (
	"bufio"
	"fmt"
	"os"
)

// Approach:
// Time Complexity:  O(?)
// Space Complexity: O(?)
func solve(reader *bufio.Reader) {
	// Write your solution here
	_ = fmt.Sprint
}

func main() {
	reader := bufio.NewReader(os.Stdin)
	solve(reader)
}
`,
  rust: `use std::io::{self, Read};

/// Approach:
/// Time Complexity:  O(?)
/// Space Complexity: O(?)
fn solve(input: &str) {
    // Write your solution here
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    solve(&input);
}
`,
  ruby: `# Approach:
# Time Complexity:  O(?)
# Space Complexity: O(?)
def solve
  input = STDIN.read

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