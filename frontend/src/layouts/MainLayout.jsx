import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col ml-68 z-100">
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <main className="px-20 py-6 flex-1 -z-1">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
