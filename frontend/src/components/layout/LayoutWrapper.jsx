import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";

/**
 * LayoutWrapper Component
 * * * Acts as a "Layout Route" wrapper for React Router v6.
 * * It allows multiple child routes to share the same persistent UI (the MainLayout)
 * while the content inside changes based on the URL.
 * * * How it works:
 * - The `<MainLayout>` renders the persistent Sidebar, Header, etc.
 * - The `<Outlet />` is a placeholder that renders the matching child route's element.
 * * @example
 * <Route element={<LayoutWrapper />}>
 * <Route path="/" element={<Feed />} />
 * <Route path="/profile" element={<Profile />} />
 * </Route>
 * * @returns {JSX.Element} The MainLayout wrapping the current route's content.
 */

const LayoutWrapper = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default LayoutWrapper;