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
import { useAuth } from "../api/queries/auth.query";
import CreateWorkspaceForm from "../components/CreateWorkspaceForm";
import { Building2, Inbox, MousePointerClick } from "lucide-react";
import { useOrgs } from "../api/queries/org.query";

const Dashboard = () => {
  const [tab, setTab] = useState("projects");

  const { openModal } = useModal();
  const { data: userData } = useAuth();
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

  const { data: orgList = [] } = useOrgs();
  const hasOrgs = orgList?.length > 0;

  const noOrg =
    statsError?.response?.status === 400 ||
    statsError?.response?.status === 401;

  const canCreate = ["owner", "admin", "manager"].includes(
    userData?.membership?.role,
  );

  const role = userData?.membership?.role;
  const isOwner = role === "owner";

  if (noOrg) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4 min-h-[60vh]">
        <div className="max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
          {hasOrgs ? (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-5">
                <MousePointerClick className="text-gray-800" size={28} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Select a Workspace
              </h1>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                You belong to {orgList.length} workspace
                {orgList.length > 1 ? "s" : ""}. Please select one from the menu
                to view your dashboard and tasks.
              </p>
            </div>
          ) : isOwner ? (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-5">
                <Building2 className="text-gray-800" size={28} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Team Flow 👋
              </h1>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Let's build something great. Create your first workspace to
                start managing projects, tracking tasks, and collaborating with
                your team.
              </p>
              <button
                onClick={() => {
                  openModal(<CreateWorkspaceForm />);
                }}
                className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 hover:shadow-md transition-all cursor-pointer"
              >
                + Create Workspace
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-5">
                <Inbox className="text-gray-800" size={28} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome aboard 👋
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                It looks like you haven't been assigned to a workspace yet.
                Please ask your workspace owner to send you an invitation, or
                check your email for a pending invite link.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm font-medium text-gray-500 hover:text-black transition-colors underline underline-offset-4 cursor-pointer"
              >
                Refresh page
              </button>
            </div>
          )}
        </div>
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

        {canCreate && (
          <button
            onClick={() => openModal(<CreateProjectForm />)}
            className="bg-black text-white h-fit px-4 py-1 rounded hover:bg-gray-900 cursor-pointer transition"
          >
            <span className="text-lg">+</span> New Project
          </button>
        )}
      </div>

      {/* 🔥 Cards */}
      <Cards stats={stats} isLoading={statsLoading} />

      {/* Tabs */}
      <div className="border border-gray-200 rounded-xl p-2">
        <div>
          <div className="bg-gray-100 flex items-center gap-4 px-1 py-1 rounded-xl text-sm">
            <div
              onClick={() => setTab("projects")}
              className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                tab === "projects"
                  ? "bg-white shadow text-black"
                  : "text-gray-400"
              }`}
            >
              Recent Projects
            </div>

            <div
              onClick={() => setTab("tasks")}
              className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                tab === "tasks" ? "bg-white shadow text-black" : "text-gray-400"
              }`}
            >
              Recent Tasks
            </div>

            <div
              onClick={() => setTab("members")}
              className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
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
              <ProjectList
                projects={projects}
                isLoading={projectsLoading}
                canCreate={canCreate}
              />
            )}
            {tab === "tasks" && (
              <TaskList
                tasks={tasks}
                isLoading={tasksLoading}
                canCreate={canCreate}
              />
            )}
            {tab === "members" && (
              <MemberList
                members={members}
                isLoading={membersLoading}
                canCreate={canCreate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
