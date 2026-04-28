import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { AudioWaveform } from "lucide-react";
import { toast } from "sonner";
import { useSelectOrg } from "../api/mutations/org.mutation";

const AcceptInvite = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: selectOrg, isPending: isSelecting } = useSelectOrg();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["invite", token],
    queryFn: async () => {
      const res = await api.get(`/api/invite/${token}`);
      return res.data;
    },
    enabled: !!token,
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: () => api.post("/api/invite/accept", { token }),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orgs"] });

      const newOrgId = res.data?.data?.orgId;

      if (newOrgId) {
        selectOrg(newOrgId, {
          onSuccess: () => {
            toast.success("Successfully joined and switched workspace!");
            navigate("/");
          },
        });
      } else {
        toast.success("Successfully joined the workspace!");
        navigate("/");
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to join workspace");
    },
  });

  if (!token) {
    return <p className="text-center mt-10">Invalid invite link</p>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading invite...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Invite is invalid or expired</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center px-4 bg-[#FAFBFB]">
      <div className="flex gap-2 items-center h-9">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-white">
          <AudioWaveform className="size-4" />
        </div>
        <p className="text-[16px] font-semibold">Team Flow.</p>
      </div>
      <div>
        <div className="bg-white p-6 rounded shadow w-md space-y-2">
          <h1 className="text-xl font-semibold text-center">
            Hey there! You're invited to join a TeamFlow Workspace!
          </h1>

          <p className="text-center text-gray-400 text-sm">
            You are invited in{" "}
            <span className="capitalize">{data?.data?.orgName}</span>
          </p>

          <button
            onClick={() => mutate()}
            disabled={isPending || isSelecting || isSuccess}
            className="w-full bg-black text-white py-2 rounded cursor-pointer hover:opacity-90 transition"
          >
            {isPending ? "Joining..." : isSuccess ? "Joined" : "Accept Invite"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
