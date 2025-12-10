// layouts/MainLayout.jsx - FIXED
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <Navbar />
      
      <div className="flex pt-16">
        {/* Left Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-64 fixed left-0 top-16 h-[calc(100vh-4rem)]">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 lg:mr-72 min-h-[calc(100vh-4rem)] px-4 md:px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>

        {/* Right Sidebar - Hidden on mobile */}
        <div className="hidden xl:block w-72 fixed right-0 top-16 h-[calc(100vh-4rem)]">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;