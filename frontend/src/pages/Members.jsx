import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  Copy,
  UserMinus,
} from "lucide-react";
import { fetchMembersFn, useMembers } from "../api/queries/member.query";
import { useSendInvite } from "../api/mutations/invite.mutation";
import { useUpdateRole } from "../api/mutations/membership.mutation";
import { useAuth } from "../api/queries/auth.query";
import { useCurrentOrg } from "../api/queries/org.query";
import { getAvatar } from "../utils/getAvatar";
import { toast } from "sonner";
import { useModal } from "../context/ModalContext";
import RemoveMemberModal from "../components/RemoveMemberModal";

const Members = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [jumpValue, setJumpValue] = useState(1);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [inviteError, setInviteError] = useState("");

  const { openModal } = useModal();

  const { data, isLoading } = useMembers({
    page,
    limit: 10,
  });

  const { mutate: sendInvite, isPending } = useSendInvite();
  const { mutate: updateRole, isPending: updateRolePending } = useUpdateRole();
  const { data: userData } = useAuth();
  const { data: currentOrg = [] } = useCurrentOrg();

  const members = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const currentRole = userData?.membership?.role;
  const isOwner = currentRole === "owner";

  useEffect(() => {
    if (page < totalPages) {
      const nextPage = page + 1;
      queryClient.prefetchQuery({
        queryKey: ["members", { page: nextPage, limit: 10 }],
        queryFn: () => fetchMembersFn({ page: nextPage, limit: 10 }),
      });
    }
  }, [page, totalPages, queryClient]);

  useEffect(() => {
    setJumpValue(page);
  }, [page]);

  const handleInvite = () => {
    if (!email.trim()) {
      return setInviteError("Please enter an email address.");
    }

    setInviteError("");

    sendInvite(
      { email, role },
      {
        onSuccess: () => {
          toast.success("Invite sent successfully!");
          setEmail("");
          setRole("member");
        },
        onError: (err) => {
          setInviteError(
            err.response?.data?.message || "Failed to send invite.",
          );
        },
      },
    );
  };

  const handleJump = (e) => {
    e.preventDefault();
    const val = parseInt(jumpValue, 10);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      setPage(val);
    } else {
      setJumpValue(page);
    }
  };

  const rolePriority = {
    owner: 1,
    admin: 2,
    manager: 3,
    member: 4,
  };

  const sortedMembers = [...members].sort(
    (a, b) => (rolePriority[a.role] || 99) - (rolePriority[b.role] || 99),
  );

  return (
    <div className="w-full">
      {/* Workspace Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-2 px-4 md:px-40">
        <span className="flex items-center justify-center h-14 w-14 rounded-md bg-black text-white text-3xl font-bold">
          {currentOrg?.name?.charAt(0)}
        </span>
        <span className="flex flex-col">
          <span className="text-xl font-semibold">{currentOrg?.name}</span>
          <span className="text-gray-400">
            {currentOrg?.isActive ? "Active" : "Inactive"}
          </span>
        </span>
      </div>

      <div className="px-4 md:px-40">
        {/* Section Header */}
        <div className="py-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold">Workspace members</h1>
          <p className="text-gray-400 text-sm">
            Workspace members can view and join all workspace projects, tasks
            and create new tasks in the Workspace.
          </p>
        </div>

        {/* Invite Section */}
        <div className="space-y-4 py-4 border-b border-gray-200">
          <div>
            <h1 className="text-lg font-semibold">
              Invite members to join you
            </h1>
            <p className="text-gray-400 text-sm">
              You can invite anyone by an email in the Workspace.
            </p>
          </div>

          {isOwner ? (
            <div>
              {inviteError && (
                <p className="text-red-500 text-sm mb-2 font-medium">
                  {inviteError} this is error
                </p>
              )}
              <div className="flex items-center gap-2 pb-4">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (inviteError) setInviteError("");
                  }}
                  className={`w-full border ${inviteError ? "border-red-500" : "border-gray-200"} p-2 rounded outline-none focus:ring-1 focus:ring-black transition-all`}
                />

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="border border-gray-200 p-2 rounded bg-white outline-none"
                >
                  <option value="member">Member</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>

                <button
                  onClick={handleInvite}
                  disabled={isPending}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                >
                  {isPending ? "Sending..." : "Invite"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">
              Only the owner can invite new members.
            </p>
          )}
        </div>

        {/* Members List */}
        <div className="">
          {!isLoading ? (
            <div className="space-y-4 py-4">
              {sortedMembers.length > 0 ? (
                sortedMembers.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        className="w-9 h-9 rounded-full object-cover"
                        src={getAvatar(member)}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=User&background=random`;
                        }}
                        alt="avatar"
                      />
                      <div className="flex flex-col justify-center">
                        <p className="font-semibold text-sm">{member.name}</p>
                        <p className="text-gray-400 text-xs">{member.email}</p>
                      </div>
                    </div>

                    {member.role !== "owner" && isOwner ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            openModal(<RemoveMemberModal member={member} />)
                          }
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Remove Member"
                        >
                          <UserMinus size={18} />
                        </button>
                        <select
                          disabled={updateRolePending}
                          value={member.role}
                          onChange={(e) =>
                            updateRole(
                              {
                                userId: member._id,
                                role: e.target.value,
                              },
                              {
                                onSuccess: () =>
                                  toast.success(
                                    `${member.name}'s role updated`,
                                  ),
                                onError: () =>
                                  toast.error("Failed to update role"),
                              },
                            )
                          }
                          className="border border-gray-200 py-1.5 px-2 rounded text-sm bg-white outline-none focus:ring-1 focus:ring-black"
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="member">Member</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center border border-gray-200 min-w-24 h-8 rounded bg-gray-50">
                        <p className="capitalize text-xs font-semibold text-gray-600">
                          {member.role}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-10">
                  No members found.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4 py-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                      <div className="h-2 w-32 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination  */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 py-6 gap-4">
          <div className="flex items-center gap-6">
            <p className="text-sm text-gray-700">
              Showing page <span className="font-semibold">{page}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </p>

            {/* Jump to Page */}
            <form onSubmit={handleJump} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 uppercase tracking-tight">
                Go to
              </span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={jumpValue}
                onChange={(e) => setJumpValue(e.target.value)}
                className="w-12 border border-gray-200 rounded p-1 text-center text-sm outline-none focus:border-black"
              />
              <button type="submit" className="hidden">
                Go
              </button>
            </form>
          </div>

          <nav className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span>
                <ChevronLeft size={16} />
              </span>{" "}
              Previous
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
              <span>
                <ChevronRight size={16} />
              </span>{" "}
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Members;
