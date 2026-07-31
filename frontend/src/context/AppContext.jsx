import { createContext, useContext, useState } from "react";

import { generatePlanner, completeTask, saveReflection } from "../apis/planner";

import {
  extractCollegeDrives,
  removeCollegeDrive,
  updateCollegeDriveStatus,
} from "../apis/college";

import {
  extractJobs,
  refreshJobs as refreshJobsData,
  updateJobStatus as updateJobStatusApi,
  removeJob,
} from "../apis/job";



const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ---------------- Planner ----------------

  const [plannerTasks, setPlannerTasks] = useState([]);
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [plannerLoaded, setPlannerLoaded] = useState(false);

  // ---------------- College ----------------

  const [collegeDrives, setCollegeDrives] = useState([]);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeLoaded, setCollegeLoaded] = useState(false);

  // ----------------- Jobs -----------------

  const [jobs, setJobs] = useState([]);
  const [jobLoading, setJobLoading] = useState(false);
  const [jobLoaded, setJobLoaded] = useState(false);

  // ---------------- Global ----------------

  const [lastRefresh, setLastRefresh] = useState(null);

  // ===========================================================
  // Planner
  // ===========================================================

  async function refreshPlanner() {
    setPlannerLoading(true);

    try {
      const planner = await generatePlanner();

      setPlannerTasks(planner);
      setPlannerLoaded(true);
    } finally {
      setPlannerLoading(false);
    }
  }

  async function updatePlannerTask(taskId, completed) {
    // optimistic update
    setPlannerTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed,
            }
          : task,
      ),
    );

    try {
      await completeTask(taskId, completed);
    } catch (err) {
      // rollback
      setPlannerTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: !completed,
              }
            : task,
        ),
      );

      throw err;
    }
  }

  async function savePlannerReflection(reflection) {
    await saveReflection(reflection);
  }

  // ===========================================================
  // College
  // ===========================================================

  async function refreshCollege() {
    setCollegeLoading(true);

    try {
      const drives = await extractCollegeDrives();

      setCollegeDrives(drives);
      setCollegeLoaded(true);
    } finally {
      setCollegeLoading(false);
    }
  }

  async function updateDriveStatus(driveId, status) {
    const previous = [...collegeDrives];

    setCollegeDrives((prev) =>
      prev.map((drive) =>
        drive.id === driveId
          ? {
              ...drive,
              status,
            }
          : drive,
      ),
    );

    try {
      await updateCollegeDriveStatus(driveId, status);
    } catch (err) {
      setCollegeDrives(previous);
      throw err;
    }
  }

  async function deleteDrive(driveId) {
    const previous = [...collegeDrives];

    setCollegeDrives((prev) => prev.filter((drive) => drive.id !== driveId));

    try {
      await removeCollegeDrive(driveId);
    } catch (err) {
      setCollegeDrives(previous);
      throw err;
    }
  }

  // ===========================================================
  // Jobs
  // ===========================================================

  async function refreshJobs() {
    setJobLoading(true);

    try {
      const jobs = await refreshJobsData();

      setJobs(jobs);
      setJobLoaded(true);
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

    setJobs((prev) => prev.filter((job) => job.id !== jobId));

    try {
      await removeJob(jobId);
    } catch (err) {
      setJobs(previous);
      throw err;
    }
  }

  async function loadJobs() {
    setJobLoading(true);

    try {
      const jobs = await extractJobs();

      setJobs(jobs);
      setJobLoaded(true);
    } finally {
      setJobLoading(false);
    }
  }

  // ===========================================================
  // Global
  // ===========================================================

  async function refreshAll() {
    await Promise.all([refreshPlanner(), refreshCollege(), refreshJobsData()]);

    setLastRefresh(new Date());
  }

  return (
    <AppContext.Provider
      value={{
        // Planner
        plannerTasks,
        plannerLoading,
        plannerLoaded,

        refreshPlanner,
        updatePlannerTask,
        savePlannerReflection,

        // College
        collegeDrives,
        collegeLoading,
        collegeLoaded,

        refreshCollege,
        updateDriveStatus,
        deleteDrive,

        // Jobs
        jobs,
        jobLoading,
        jobLoaded,

        refreshJobsData,
        updateJobStatus,
        deleteJob,
        loadJobs,

        // Global
        refreshAll,
        lastRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
