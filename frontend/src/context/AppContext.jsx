import { createContext, useContext, useState, useEffect } from "react";

import { generatePlanner, completeTask, saveReflection } from "../apis/planner";

// import {
//   extractCollegeDrives,
//   removeCollegeDrive,
//   updateCollegeDriveStatus,
// } from "../apis/college";

// import {
//   extractJobs,
//   refreshJobsData,
//   updateJobStatus as updateJobStatusApi,
//   removeJob,
// } from "../apis/job";

// import { extractDashboard } from "../apis/dashboard";

// import { extractArticle, updateArticleReadStatus } from "../apis/article";

// import { extractCodingQuestions, saveCodingSolution } from "../apis/code";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lastSync, setLastSync] = useState(new Date());
  const [syncing, setSyncing] = useState(false);

  const [planner, setPlanner] = useState([]);
  const [loadingPlanner, setLoadingPlanner] = useState(false);
  const [reflection, setReflection] = useState(false);

  const refreshPlanner = async () => {
    if (syncing) return;

    try {
      const data = await generatePlanner();

      setPlanner(data);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleTask = async (id, completed) => {
    // optimistic update first, so the UI responds instantly
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

      // rollback on failure
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

      setReflection(true);
    } catch (err) {
      console.error(err);
    }
  };

  // // ---------------- Article ----------------

  // const [article, setArticle] = useState(null);
  // const [articleLoading, setArticleLoading] = useState(false);
  // const [articleLoaded, setArticleLoaded] = useState(false);

  // // ---------------- College ----------------

  // const [collegeDrives, setCollegeDrives] = useState([]);
  // const [collegeLoading, setCollegeLoading] = useState(false);
  // const [collegeLoaded, setCollegeLoaded] = useState(false);

  // // ----------------- Jobs -----------------

  // const [jobs, setJobs] = useState([]);
  // const [jobLoading, setJobLoading] = useState(false);
  // const [jobLoaded, setJobLoaded] = useState(false);

  // // ---------------- Dashboard -------------

  // const [dashboardData, setDashboardData] = useState(null);
  // const [dashboardLoading, setDashboardLoading] = useState(false);
  // const [dashboardLoaded, setDashboardLoaded] = useState(false);

  // // ------------ Code-generator -------------

  // const [codingQuestions, setCodingQuestions] = useState([]);
  // const [codingLoading, setCodingLoading] = useState(false);
  // const [codingLoaded, setCodingLoaded] = useState(false);

  // // ------------ Code-evaluator -------------

  // const [metadata, setMetadata] = useState(null);
  // const [metadataLoading, setMetadataLoading] = useState(false);
  // const [metadataLoaded, setMetadataLoaded] = useState(false);

  // async function refreshPlanner() {
  //   setPlannerLoading(true);

  //   try {
  //     const planner = await generatePlanner();

  //     setPlannerTasks(planner);
  //     setPlannerLoaded(true);
  //   } finally {
  //     setPlannerLoading(false);
  //   }
  // }

  // async function updatePlannerTask(taskId, completed) {
  //   // optimistic update
  //   setPlannerTasks((prev) =>
  //     prev.map((task) =>
  //       task.id === taskId
  //         ? {
  //             ...task,
  //             completed,
  //           }
  //         : task,
  //     ),
  //   );

  //   try {
  //     await completeTask(taskId, completed);
  //   } catch (err) {
  //     // rollback
  //     setPlannerTasks((prev) =>
  //       prev.map((task) =>
  //         task.id === taskId
  //           ? {
  //               ...task,
  //               completed: !completed,
  //             }
  //           : task,
  //       ),
  //     );

  //     throw err;
  //   }
  // }

  // async function savePlannerReflection(reflection) {
  //   await saveReflection(reflection);
  // }

  // // ===========================================================
  // // Article
  // // ===========================================================

  // async function refreshArticles() {
  //   setArticleLoading(true);

  //   try {
  //     const article = await extractArticle();

  //     setArticle(article);
  //     setArticleLoaded(true);
  //   } finally {
  //     setArticleLoading(false);
  //   }
  // }

  // async function updateArticleStatus(status) {
  //   const previous = article;

  //   setArticle((prev) =>
  //     prev
  //       ? {
  //           ...prev,
  //           status,
  //         }
  //       : prev,
  //   );

  //   try {
  //     await updateArticleStatusApi(status);
  //   } catch (err) {
  //     setArticle(previous);
  //     throw err;
  //   }
  // }

  // // ===========================================================
  // // College
  // // ===========================================================

  // async function refreshCollege() {
  //   setCollegeLoading(true);

  //   try {
  //     const drives = await extractCollegeDrives();

  //     setCollegeDrives(drives);
  //     setCollegeLoaded(true);
  //   } finally {
  //     setCollegeLoading(false);
  //   }
  // }

  // async function updateDriveStatus(driveId, status) {
  //   const previous = [...collegeDrives];

  //   setCollegeDrives((prev) =>
  //     prev.map((drive) =>
  //       drive.id === driveId
  //         ? {
  //             ...drive,
  //             status,
  //           }
  //         : drive,
  //     ),
  //   );

  //   try {
  //     await updateCollegeDriveStatus(driveId, status);
  //   } catch (err) {
  //     setCollegeDrives(previous);
  //     throw err;
  //   }
  // }

  // async function deleteDrive(driveId) {
  //   const previous = [...collegeDrives];

  //   setCollegeDrives((prev) => prev.filter((drive) => drive.id !== driveId));

  //   try {
  //     await removeCollegeDrive(driveId);
  //   } catch (err) {
  //     setCollegeDrives(previous);
  //     throw err;
  //   }
  // }

  // // ===========================================================
  // // Jobs
  // // ===========================================================

  // async function refreshJobs() {
  //   setJobLoading(true);

  //   try {
  //     const jobs = await refreshJobsData();

  //     setJobs(jobs);
  //     setJobLoaded(true);
  //   } finally {
  //     setJobLoading(false);
  //   }
  // }

  // async function updateJobStatus(jobId, status) {
  //   const previous = [...jobs];

  //   setJobs((prev) =>
  //     prev.map((job) =>
  //       job.id === jobId
  //         ? {
  //             ...job,
  //             status,
  //           }
  //         : job,
  //     ),
  //   );

  //   try {
  //     await updateJobStatusApi(jobId, status);
  //   } catch (err) {
  //     setJobs(previous);
  //     throw err;
  //   }
  // }

  // async function deleteJob(jobId) {
  //   const previous = [...jobs];

  //   setJobs((prev) => prev.filter((job) => job.id !== jobId));

  //   try {
  //     await removeJob(jobId);
  //   } catch (err) {
  //     setJobs(previous);
  //     throw err;
  //   }
  // }

  // async function loadJobs() {
  //   setJobLoading(true);

  //   try {
  //     const jobs = await extractJobs();

  //     setJobs(jobs);
  //     setJobLoaded(true);
  //   } finally {
  //     setJobLoading(false);
  //   }
  // }

  // // ===========================================================
  // // Dashboard
  // // ===========================================================

  // async function refreshDashboard() {
  //   setDashboardLoading(true);

  //   try {
  //     const dashboard = await extractDashboard();

  //     setDashboardData(dashboard);
  //     setDashboardLoaded(true);
  //   } finally {
  //     setDashboardLoading(false);
  //   }
  // }

  // // ===========================================================
  // // Coding
  // // ===========================================================

  // async function refreshCodingQuestions() {
  //   setCodingLoading(true);

  //   try {
  //     const data = await extractCodingQuestions();

  //     setCodingQuestions(data);
  //     setCodingLoaded(true);
  //   } finally {
  //     setCodingLoading(false);
  //   }
  // }

  // async function refreshCodingMetadata(
  //   question,
  //   generated_date,
  //   solution,
  //   frontend_meta,
  // ) {
  //   setMetadata(null);
  //   setMetadataLoaded(false);
  //   setMetadataLoading(true);

  //   try {
  //     const data = await saveCodingSolution(
  //       question,
  //       generated_date,
  //       solution,
  //       frontend_meta,
  //     );

  //     setMetadata(data);
  //     setMetadataLoaded(true);

  //     return data;
  //   } finally {
  //     setMetadataLoading(false);
  //   }
  // }

  // ===========================================================
  // Global
  // ===========================================================

  async function refreshAll() {
    if (syncing) return;

    setSyncing(true);

    await Promise.all([
      refreshPlanner(),
      // refreshCollege(),
      // refreshJobs(),
      // refreshDashboard(),
      // refreshArticles(),
      // refreshCodingQuestions()
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
        refreshAll,
        syncing,

        planner,
        reflection,
        toggleTask,
        updateReflection,
        setReflection,

        // // Planner
        // plannerTasks,
        // plannerLoading,
        // plannerLoaded,

        // refreshPlanner,
        // updatePlannerTask,
        // savePlannerReflection,

        // // Article
        // article,
        // articleLoading,
        // articleLoaded,

        // refreshArticles,
        // updateArticleStatus,

        // // College
        // collegeDrives,
        // collegeLoading,
        // collegeLoaded,

        // refreshCollege,
        // updateDriveStatus,
        // deleteDrive,

        // // Jobs
        // jobs,
        // jobLoading,
        // jobLoaded,

        // refreshJobs,
        // updateJobStatus,
        // deleteJob,
        // loadJobs,

        // // Dashboard
        // dashboardData,
        // dashboardLoading,
        // dashboardLoaded,

        // refreshDashboard,

        // // Code Generator
        // codingQuestions,
        // setCodingQuestions,
        // codingLoading,
        // codingLoaded,
        // refreshCodingQuestions,

        // // Code Evaluator
        // metadata,
        // setMetadata,
        // metadataLoading,
        // metadataLoaded,
        // refreshCodingMetadata,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
