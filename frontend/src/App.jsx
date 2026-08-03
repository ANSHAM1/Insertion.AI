import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Coding from "./pages/Coding";
import CodeEditor from "./pages/CodeEditor";
import Planner from "./pages/Planner";
import Jobs from "./pages/Jobs";
import CollegeDrives from "./pages/CollegeDrives";

import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <Routes>
          <Route path="/coding/:id" element={<CodeEditor />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/coding" element={<Coding />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/college-drives" element={<CollegeDrives />} />
          </Route>
        </Routes>
      </AppProvider>
    </HashRouter>
  );
}
