import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import AppLayout from "../layouts/AppLayout";
import LoginPage from "../pages/LoginPage";
import CreateTaskPage from "../pages/CreateTaskPage";
import DashboardPage from "../pages/DashboardPage";
import EditTaskPage from "../pages/EditTaskPage";
import TaskDetailPage from "../pages/TaskDetailPage";
import TasksPage from "../pages/TasksPage";

function ProtectedLayout() {
    return (
        <ProtectedRoute>
            <AppLayout
                header={<TopBar />}
                sidebar={<Sidebar />}
                footer={<Footer />}
            >
                <Outlet />
            </AppLayout>
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
                        element={<CreateTaskPage />}
                    />
                    <Route
                        path="/app/tasks/:taskId"
                        element={<TaskDetailPage />}
                    />
                    <Route
                        path="/app/tasks/:taskId/edit"
                        element={<EditTaskPage />}
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