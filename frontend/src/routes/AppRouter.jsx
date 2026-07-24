import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import AppLayout from "../layouts/AppLayout";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import UnderConstructionPage from "../pages/UnderConstructionPage";
import TaskCreatePage from "../modules/task/pages/TaskCreatePage";
import TaskDetailPage from "../modules/task/pages/TaskDetailPage";
import TasksPage from "../modules/task/pages/TasksPage";

function ProtectedLayout() {
    return (
        <ProtectedRoute>
            <AppLayout
                header={<TopBar />}
                sidebar={<Sidebar />}
                footer={<Footer />}
            />
        </ProtectedRoute>
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<LoginPage />}
                />
                <Route element={<ProtectedLayout />}>
                    <Route
                        path="/app"
                        element={<DashboardPage />}
                    />
                    <Route
                        path="/app/tasks"
                        element={<TasksPage />}
                    />
                    <Route
                        path="/app/tasks/new"
                        element={<TaskCreatePage />}
                    />
                    <Route
                        path="/app/tasks/:taskId"
                        element={<TaskDetailPage />}
                    />
                    <Route
                        path="/app/users"
                        element={<UnderConstructionPage />}
                    />
                    <Route
                        path="/app/*"
                        element={<Navigate replace to="/app" />}
                    />
                </Route>
                <Route
                    path="*"
                    element={<Navigate replace to="/" />}
                />
            </Routes>
        </BrowserRouter>
    );
}