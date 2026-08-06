import { createContext, useContext, useState, useEffect } from "react";

import { generatePlanner, completeTask, saveReflection } from "../apis/planner";

import {
  fetchJobs,
  generateNewJobs,
  updateJobStatusApi,
  removeJob,
} from "../apis/job";

import { extractDashboard } from "../apis/dashboard";

import { extractArticle, updateArticleStatusApi } from "../apis/article";

import {
  fetchCodingQuestions,
  extractCodingQuestions,
  saveCodingSolution,
  testCaseResultCodeRun,
} from "../apis/code";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lastSync, setLastSync] = useState(new Date());
  const [syncing, setSyncing] = useState(false);

  // ---------------------------------------------------------------------

  const [planner, setPlanner] = useState([]);
  const [loadingPlanner, setLoadingPlanner] = useState(false);
  const [reflection, setReflection] = useState("");

  const refreshPlanner = async () => {
    try {
      const data = await generatePlanner();

      setPlanner(data);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleTask = async (id, completed) => {
    setPlanner((prev) =>
      prev.map((day) => ({
        ...day,
        items: day.items.map((item) =>
          String(item.id) === String(id) ? { ...item, completed } : item,
        ),
      })),
    );

    try {
      await completeTask(id, completed);
    } catch (err) {
      console.error(err);

      setPlanner((prev) =>
        prev.map((day) => ({
          ...day,
          items: day.items.map((item) =>
            String(item.id) === String(id)
              ? { ...item, completed: !completed }
              : item,
          ),
        })),
      );
    }
  };

  const updateReflection = async (reflection) => {
    try {
      await saveReflection(reflection);

      setReflection("");
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------------------------------------------------

  const [jobs, setJobs] = useState([]);
  const [jobLoading, setJobLoading] = useState(false);

  async function refreshJobs() {
    setJobLoading(true);

    try {
      const jobs = await fetchJobs();

      setJobs(jobs);
    } finally {
      setJobLoading(false);
    }
  }

  async function updateJobStatus(jobId, status) {
    const previous = [...jobs];

    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status,
            }
          : job,
      ),
    );

    try {
      await updateJobStatusApi(jobId, status);
    } catch (err) {
      setJobs(previous);
      throw err;
    }
  }

  async function deleteJob(jobId) {
    const previous = [...jobs];

    setJobs((prev) => prev.filter((j) => String(j.id) !== String(jobId)));

    try {
      await removeJob(jobId);
    } catch (err) {
      setJobs(previous);
      throw err;
    }
  }

  async function generateJobs() {
    if (syncing) return;

    setJobLoading(true);

    try {
      const jobs = await generateNewJobs();

      setJobs(jobs);
    } finally {
      setJobLoading(false);
    }
  }

  // ---------------------------------------------------------------------

  const [article, setArticle] = useState(null);
  const [articleLoading, setArticleLoading] = useState(false);

  async function refreshArticles() {
    setArticleLoading(true);

    try {
      const article = await extractArticle();

      setArticle(article);
    } finally {
      setArticleLoading(false);
    }
  }

  async function updateArticleStatus(id, status) {
    const previous = article;

    setArticle((prev) =>
      prev
        ? {
            ...prev,
            status,
          }
        : prev,
    );

    try {
      await updateArticleStatusApi(id, status);
    } catch (err) {
      setArticle(previous);
      throw err;
    }
  }

  // ---------------------------------------------------------------------

  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  async function refreshDashboard() {
    setDashboardLoading(true);

    try {
      const dashboard = await extractDashboard();

      setDashboardData(dashboard);
    } finally {
      setDashboardLoading(false);
    }
  }

  // ---------------------------------------------------------------------

  const [codingQuestions, setCodingQuestions] = useState([]);
  const [codingLoading, setCodingLoading] = useState(false);

  const [metadata, setMetadata] = useState(null);
  const [metadataLoading, setMetadataLoading] = useState(false);

  const [testCaseResults, setTestCaseResults] = useState(null);
  const [runningCode, setRunningCode] = useState(false);

  async function refreshCodingQuestions() {
    setCodingLoading(true);

    try {
      const data = await fetchCodingQuestions();

      setCodingQuestions(data);
    } finally {
      setCodingLoading(false);
    }
  }

  async function generateCodingQuestions(user_prompt) {
    setCodingLoading(true);

    try {
      const data = await extractCodingQuestions(user_prompt);

      setCodingQuestions(data);
    } finally {
      setCodingLoading(false);
    }
  }

  async function getCodingMetadata(
    question,
    generated_date,
    solution,
    frontend_meta,
  ) {
    setMetadata(null);
    setMetadataLoading(true);

    try {
      const data = await saveCodingSolution(
        question,
        generated_date,
        solution,
        frontend_meta,
      );

      setMetadata(data);
    } finally {
      setMetadataLoading(false);
    }
  }

  async function runCode(questionSummary, solution, testcases) {
    setRunningCode(true);
    setTestCaseResults(null);

    try {
      const data = await testCaseResultCodeRun(
        questionSummary,
        solution,
        testcases,
      );

      setTestCaseResults(data);
    } catch (err) {
      console.error(err);

      setTestCaseResults({
        compiletime_error: "Failed to execute code.",
        results: [],
      });
    } finally {
      setRunningCode(false);
    }
  }

  // ---------------------------------------------------------------------

  async function refreshAll() {
    if (syncing) return;

    setSyncing(true);

    await Promise.all([
      refreshPlanner(),
      refreshJobs(),
      refreshDashboard(),
      refreshArticles(),
      refreshCodingQuestions(),
    ]);

    setLastSync(new Date());
    setSyncing(false);
  }

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <AppContext.Provider
      value={{
        lastSync,
        syncing,
        refreshAll,

        planner,
        reflection,
        toggleTask,
        updateReflection,
        setReflection,

        jobs,
        jobLoading,
        updateJobStatus,
        deleteJob,
        generateJobs,

        article,
        articleLoading,
        updateArticleStatus,

        dashboardData,
        dashboardLoading,

        codingQuestions,
        codingLoading,
        generateCodingQuestions,

        testCaseResults,
        runningCode,
        runCode,

        metadata,
        metadataLoading,
        getCodingMetadata,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
