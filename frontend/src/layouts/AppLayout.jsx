import { cloneElement, isValidElement, useState } from "react";
import { Outlet } from "react-router-dom";

export default function AppLayout({
    header = null,
    sidebar = null,
    footer = null,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const openSidebar = () => setSidebarOpen(true);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="app-layout">
            <aside className="app-sidebar">
                {isValidElement(sidebar)
                    ? cloneElement(sidebar, {
                          isOpen: sidebarOpen,
                          onClose: closeSidebar,
                      })
                    : sidebar}
            </aside>
            <div className="app-content">
                <header className="app-header">
                    {isValidElement(header)
                        ? cloneElement(header, {
                              onMenuClick: openSidebar,
                          })
                        : header}
                </header>
                <main className="app-main">
                    <Outlet />
                </main>
                <footer className="app-footer">
                    {footer}
                </footer>
            </div>
        </div>
    );
}