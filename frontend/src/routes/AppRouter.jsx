import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import AppLayout from "../layouts/AppLayout";
import LoginPage from "../pages/LoginPage";
import TasksPage from "../pages/TasksPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<LoginPage />}
                />
                <Route
                    path="/app"
                    element={
                        <ProtectedRoute>
                            <AppLayout
                                header={<TopBar />}
                                sidebar={<Sidebar />}
                                footer={<Footer />}
                            >
                                <TasksPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="*"
                    element={<Navigate replace to="/" />}
                />
            </Routes>
        </BrowserRouter>
    );
}