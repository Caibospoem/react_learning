import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AssetPage from "./pages/AssetPage";
import LoginPage from "./pages/LoginPage";
import MapEditor from "./pages/mapeditor";
import ProjectPage from "./pages/ProjectPage";
import StudioPage from "./pages/StudioPage";
import TaskPage from "./pages/TaskPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="studio" element={<StudioPage />} />
          <Route path="projects" element={<ProjectPage />} />
          <Route path="assets" element={<AssetPage />} />
          <Route path="tasks" element={<TaskPage />} />
          <Route path="mapeditor" element={<MapEditor />} />
          <Route index element={<Navigate to="/studio" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/studio" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
