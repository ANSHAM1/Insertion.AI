 import { invoke } from "@tauri-apps/api/core";


export async function extractArticle() {
  const result = await invoke("run_python", {
    command: "article",
  });

  return result;
}


export async function updateArticleStatusApi(articleId, status) {
  return invoke("run_python", {
    command: "article_read_status",
    payload: {
      id: articleId,
      status : status,
    },
  });
}