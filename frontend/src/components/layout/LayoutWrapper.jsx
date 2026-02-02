import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";

const LayoutWrapper = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default LayoutWrapper;