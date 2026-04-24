import { useState } from "react";

import Cards from "../components/Cards";
import ProjectList from "../components/Lists/ProjectList";
import TaskList from "../components/Lists/TaskList";
import MemberList from "../components/Lists/MemberList";
import { useModal } from "../context/ModalContext";

// 🔥 queries
import { useProjects } from "../api/queries/project.query";
import { useTasks } from "../api/queries/task.query";
import { useMembers } from "../api/queries/member.query";
import { useStats } from "../api/queries/stats.query";
import CreateProjectForm from "../components/CreateProjectForm";
import CreateTaskForm from "../components/CreateTaskForm";

const Dashboard = () => {
  const [tab, setTab] = useState("projects");

  const { openModal } = useModal();

  const { data: projects = [], isLoading: projectsLoading } = useProjects(
    { limit: 10 },
    { enabled: tab === "projects" },
  );

  const { data: tasksData = {}, isLoading: tasksLoading } = useTasks(
    { limit: 10 },
    { enabled: tab === "tasks" },
  );

  const tasks = tasksData?.data || [];

  const { data, isLoading: membersLoading } = useMembers(
    {
      limit: 10,
    },
    { enabled: tab === "members" },
  );
  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
  } = useStats({ scope: "org" });

  const members = data?.data || [];

  const noOrg =
    statsError?.response?.status === 400 ||
    statsError?.response?.status === 401;

  if (noOrg) {
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-2xl font-bold">Workspace Overview</h1>
          <p className="text-gray-500 text-sm">
            Here's an overview of this workspace
          </p>
        </div>

        <button
          onClick={() => openModal(<CreateProjectForm />)}
          className="bg-black text-white h-fit px-4 py-1 rounded hover:bg-gray-900 cursor-pointer transition"
        >
          <span className="text-lg">+</span> New Project
        </button>
      </div>

      {/* 🔥 Cards */}
      <Cards stats={stats} isLoading={statsLoading} />

      {/* Tabs */}
      <div className="border border-gray-200 rounded-xl p-2">
        <div>
          <div className="bg-gray-100 flex items-center gap-4 px-1 py-2 rounded-lg text-sm">
            <div
              onClick={() => setTab("projects")}
              className={`px-4 py-2 rounded cursor-pointer transition-all ${
                tab === "projects"
                  ? "bg-white shadow text-black"
                  : "text-gray-400"
              }`}
            >
              Recent Projects
            </div>

            <div
              onClick={() => setTab("tasks")}
              className={`px-4 py-2 rounded cursor-pointer transition-all ${
                tab === "tasks" ? "bg-white shadow text-black" : "text-gray-400"
              }`}
            >
              Recent Tasks
            </div>

            <div
              onClick={() => setTab("members")}
              className={`px-4 py-2 rounded cursor-pointer transition-all ${
                tab === "members"
                  ? "bg-white shadow text-black"
                  : "text-gray-400"
              }`}
            >
              Recent Members
            </div>
          </div>

          {/* Lists */}
          <div>
            {tab === "projects" && (
              <ProjectList projects={projects} isLoading={projectsLoading} />
            )}
            {tab === "tasks" && (
              <TaskList tasks={tasks} isLoading={tasksLoading} />
            )}
            {tab === "members" && (
              <MemberList members={members} isLoading={membersLoading} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
