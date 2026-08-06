function stripStringsAndComments(
  code,
  { lineComment = "//", blockComment = ["/*", "*/"], hash = false } = {},
) {
  let out = "";
  let i = 0;
  let inStr = null;

  while (i < code.length) {
    const ch = code[i];
    const two = code.slice(i, i + 2);

    if (inStr) {
      out += " ";
      if (ch === "\\") {
        i += 2;
        continue;
      }
      if (ch === inStr) inStr = null;
      i++;
      continue;
    }

    if (hash && ch === "#") {
      while (i < code.length && code[i] !== "\n") i++;
      continue;
    }
    if (lineComment && two === lineComment) {
      while (i < code.length && code[i] !== "\n") i++;
      continue;
    }
    if (blockComment && two === blockComment[0]) {
      const end = code.indexOf(blockComment[1], i + 2);
      i = end === -1 ? code.length : end + 2;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inStr = ch;
      out += " ";
      i++;
      continue;
    }

    out += ch;
    i++;
  }
  return out;
}

function checkBrackets(code) {
  const pairs = { "(": ")", "[": "]", "{": "}" };
  const closers = new Set(Object.values(pairs));
  const stack = [];

  for (let idx = 0; idx < code.length; idx++) {
    const ch = code[idx];
    if (pairs[ch]) {
      stack.push({ ch, idx });
    } else if (closers.has(ch)) {
      const top = stack.pop();
      if (!top || pairs[top.ch] !== ch) {
        return { ok: false, message: `Unmatched "${ch}" near position ${idx}` };
      }
    }
  }
  if (stack.length) {
    const top = stack[stack.length - 1];
    return {
      ok: false,
      message: `Unclosed "${top.ch}" opened near position ${top.idx}`,
    };
  }
  return { ok: true };
}

function checkPythonColons(rawCode) {
  const lines = rawCode.split("\n");
  const opener =
    /^(if|elif|else|for|while|def|class|try|except|finally|with)\b.*[^:]$/;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].replace(/#.*/, "").trim();
    if (!trimmed) continue;
    if (
      opener.test(trimmed) &&
      !trimmed.endsWith(":") &&
      !trimmed.endsWith("\\")
    ) {
      return {
        ok: false,
        message: `Line ${i + 1} looks like it's missing a trailing ":"`,
      };
    }
  }
  return { ok: true };
}

const COMMENT_STYLES = {
  python: { lineComment: null, blockComment: null, hash: true },
  ruby: { lineComment: "#", blockComment: null, hash: false },
};

export function checkSyntax(code, languageId) {
  if (!code || !code.trim()) {
    return { ok: false, message: "Nothing to check — the editor is empty." };
  }

  if (languageId === "javascript") {
    try {
      new Function(code);
      return { ok: true, message: "No syntax errors found." };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  }

  const opts = COMMENT_STYLES[languageId] || {
    lineComment: "//",
    blockComment: ["/*", "*/"],
    hash: false,
  };
  const stripped = stripStringsAndComments(code, opts);

  const bracketResult = checkBrackets(stripped);
  if (!bracketResult.ok) return bracketResult;

  if (languageId === "python") {
    const colonResult = checkPythonColons(code);
    if (!colonResult.ok) return colonResult;
  }

  return { ok: true, message: "No obvious syntax issues found." };
}
