import { useEffect, useState } from "react";
import api from "../api/axios";

import Cards from "../components/Cards";
import ProjectList from "../components/Lists/ProjectList";
import TaskList from "../components/Lists/TaskList";
import MemberList from "../components/Lists/MemberList";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noOrg, setNoOrg] = useState(false);
  const [tab, setTab] = useState("projects");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/api/project");
        setProjects(res.data.data || []);
      } catch (err) {
        // 🔥 detect no org case
        if (err.response?.status === 400 || err.response?.status === 401) {
          setNoOrg(true);
        } else {
          setError("Failed to load projects");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p>Loading...</p>;

  // 🔥 NO ORG UI
  if (!noOrg) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome 👋</h1>
        <p className="mb-4 text-gray-600">
          Create your first workspace to get started
        </p>

        <button className="px-4 py-2 bg-black text-white rounded">
          Create Workspace
        </button>
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-2xl font-bold">Workspace Overview</h1>
          <p className="text-gray-500 text-sm">
            Here's an overview of this workspace
          </p>
        </div>

        <button className="bg-black text-white h-fit px-4 py-1 rounded">
          {" "}
          <span className="text-lg">+</span> New Project
        </button>
      </div>

      {/* cards */}
      <Cards />

      <div className="border border-gray-200 rounded-xl p-2">
        <div>
          {/* tabs */}
          <div className="bg-gray-100 flex items-center gap-4 px-1 py-2 rounded-lg text-sm">
            <div
              onClick={() => setTab("projects")}
              className={`px-4 py-2 rounded cursor-pointer ${tab === "projects" ? "bg-white shadow text-black" : " text-gray-400"}`}
            >
              Recent Projects
            </div>
            <div
              onClick={() => setTab("tasks")}
              className={`px-4 py-2 rounded cursor-pointer ${tab === "tasks" ? "bg-white shadow text-black" : " text-gray-400"}`}
            >
              Recent Tasks
            </div>
            <div
              onClick={() => setTab("members")}
              className={`px-4 py-2 rounded cursor-pointer ${tab === "members" ? "bg-white shadow text-black" : "text-gray-400 "}`}
            >
              Recent Members
            </div>
          </div>
          {/* list */}
          <div>
            {tab === "projects" && <ProjectList />}{" "}
            {tab === "tasks" && <TaskList />}
            {tab === "members" && <MemberList />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
