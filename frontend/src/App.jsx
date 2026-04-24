import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import TopLoader from "./components/TopLoader";
import Members from "./pages/Members";
import Settings from "./pages/Settings";
import AcceptInvite from "./pages/AcceptInvite";
import Profile from "./pages/Profile";
import Project from "./pages/Project";

function App() {
  return (
    <div>
      <Toaster />
      <TopLoader />
      <Routes>
        {/* 🔐 Auth Routes */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* 🔒 Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Tasks />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Members />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/:projectId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Project />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/accept-invite"
          element={
            <ProtectedRoute>
              <AcceptInvite />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
