import { HashRouter, Routes, Route } from "react-router-dom";

import { AppProvider } from "./context/AppContext";

import MainLayout from "./layouts/MainLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Planner from "./pages/Planner.jsx";
import Coding from "./pages/Coding.jsx";
import Jobs from "./pages/Jobs.jsx";
import CollegeDrives from "./pages/CollegeDrives.jsx";
import Resume from "./pages/Resume.jsx";


// HashRouter is used because Tauri serves the app from the local
// filesystem, where a plain BrowserRouter path can break on refresh.
export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/coding" element={<Coding />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/college-drives" element={<CollegeDrives />} />
            <Route path="/resume" element={<Resume />} />
          </Route>
        </Routes>
      </AppProvider>
    </HashRouter>
  );
}
