import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

import DashboardPage from "../(pages)/DashboardPage.jsx";
import ProjectsPage from "../(pages)/ProjectsPage.jsx";
import ProjectDetailsPage from "../(pages)/ProjectDetailsPage.jsx";
import IssueDetailsPage from "../(pages)/IssueDetailsPage.jsx";
import CreateIssuePage from "../(pages)/CreateIssuePage.jsx";
import EditIssuePage from "../(pages)/EditIssuePage.jsx";
import LoginPage from "../(pages)/LoginPage.jsx";
import RegisterPage from "../(pages)/RegisterPage.jsx";
import NotFoundPage from "../(pages)/NotFoundPage.jsx";
import CreateProjectPage from "../(pages)/CreateProjectPage.jsx";
import EditProjectPage from "../(pages)/EditProjectPage.jsx";
import AssignProjectPeoplePage from "../(pages)/AssignProjectPeoplePage.jsx";
import AssignIssuePeoplePage from "../(pages)/AssignIssuePeoplePage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailsPage /></ProtectedRoute>} />
        <Route path="/projects/:id/edit" element={<ProtectedRoute><EditProjectPage /></ProtectedRoute>} />
        <Route path="/projects/:id/assign" element={<ProtectedRoute><AssignProjectPeoplePage /></ProtectedRoute>} />
        <Route path="/issues/:id" element={<ProtectedRoute><IssueDetailsPage /></ProtectedRoute>} />
        <Route path="/issues/:id/edit" element={<ProtectedRoute><EditIssuePage /></ProtectedRoute>} />
        <Route path="/issues/:id/assign" element={<ProtectedRoute><AssignIssuePeoplePage /></ProtectedRoute>} />
        <Route path="/create-issue" element={<ProtectedRoute><CreateIssuePage /></ProtectedRoute>} />
        <Route path="/create-project" element={<ProtectedRoute><CreateProjectPage/></ProtectedRoute>}/>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
