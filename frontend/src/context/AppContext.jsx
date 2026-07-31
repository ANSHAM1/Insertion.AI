import { createContext, useContext, useState } from "react";

import { generatePlanner } from "../apis/planner";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Planner
  const [plannerTasks, setPlannerTasks] = useState([]);
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [plannerLoaded, setPlannerLoaded] = useState(false);

  // Global
  const [lastRefresh, setLastRefresh] = useState(null);

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

  async function refreshAll() {
    await refreshPlanner();

    setLastRefresh(new Date());
  }

  return (
    <AppContext.Provider
      value={{
        plannerTasks,
        setPlannerTasks,

        plannerLoading,
        plannerLoaded,

        refreshPlanner,
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
