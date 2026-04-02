import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

import DashboardPage from "../(pages)/DashboardPage.jsx";
import ProjectsPage from "../(pages)/ProjectsPage.jsx";
import ProjectDetailsPage from "../(pages)/ProjectDetailsPage.jsx";
import IssueDetailsPage from "../(pages)/IssueDetailsPage.jsx";
import CreateIssuePage from "../(pages)/CreateIssuePage.jsx";
import LoginPage from "../(pages)/LoginPage.jsx";
import RegisterPage from "../(pages)/RegisterPage.jsx";
import NotFoundPage from "../(pages)/NotFoundPage.jsx";

function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/issues/:id" element={<IssueDetailsPage />} />
        <Route path="/create-issue" element={<CreateIssuePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;