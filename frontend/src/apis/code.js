import { invoke } from "@tauri-apps/api/core";

export async function fetchCodingQuestions() {
  const result = await invoke("run_python", {
    command: "refresh_questions",
    payload: {
      user_prompt: "",
    },
  });

  return result.items;
}

export async function extractCodingQuestions(user_prompt) {
  const result = await invoke("run_python", {
    command: "generator",
    payload: {
      user_prompt,
    },
  });

  return result.items;
}

export async function saveCodingSolution(
  question,
  generated_date,
  solution,
  frontend_meta,
) {
  const result = await invoke("run_python", {
    command: "evaluator",
    payload: {
      question,
      generated_date,
      solution,
      frontend_meta,
    },
  });

  return result;
}

export async function testCaseResultCodeRun(
  question_summary,
  solution,
  testcases,
) {
  const result = await invoke("run_python", {
    command: "code_runner",
    payload: {
      question_summary,
      solution,
      testcases
    },
  });

  return result;
}
