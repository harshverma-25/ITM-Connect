import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <>
      <Navbar />
      {/* ✅ Adds space so content doesn't hide behind fixed navbar */}
      <div className="pt-20 px-4">
        <Outlet />
      </div>
    </>
  );
};

export default AppLayout;
