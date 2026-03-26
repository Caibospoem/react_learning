import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AssetPage from "./pages/AssetPage";
import LoginPage from "./pages/LoginPage";
import ProjectPage from "./pages/ProjectPage";
import TaskPage from "./pages/TaskPage";
import ConvasPage from "./pages/convas";
import GridHighlight from "./pages/gridhightlight";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="projects" element={<ProjectPage />} />
          <Route path="assets" element={<AssetPage />} />
          <Route path="tasks" element={<TaskPage />} />
          <Route path="convas" element={<ConvasPage />} />
          <Route path="gridhightlight" element={<GridHighlight />} />

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
