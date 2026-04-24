/* eslint-disable react-hooks/set-state-in-effect */
// import { useState, useEffect } from "react";
// import { useUpdateOrg } from "../api/mutations/org.mutation";
// import { useCurrentOrg } from "../api/queries/org.query";

// const Settings = () => {
//   const { data: currentOrg = [] } = useCurrentOrg();
//   const { mutate: updateOrg, isPending } = useUpdateOrg();

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     updateOrg({ name, description });
//   };

//   useEffect(() => {
//     if (currentOrg) {
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       setName(currentOrg.name || "");
//       setDescription(currentOrg.description || "");
//     }
//   }, [currentOrg]);

//   return (
//     <div>
//       <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-2 px-4 md:px-40">
//         <span className="flex items-center justify-center h-14 w-14 rounded-md bg-black text-white text-3xl font-bold">
//           {currentOrg?.name?.charAt(0)}
//         </span>
//         <span className="flex flex-col">
//           <span className="text-xl font-semibold">{currentOrg?.name}</span>
//           <span className="text-gray-400">Workspace</span>
//         </span>
//       </div>

//       <div className="space-y-4 px-40 mt-6">
//         <h1 className="text-xl font-semibold">Workspace Settings</h1>

//         <div className="space-y-4">
//           <div className="border-b border-gray-200 py-2">
//             <p className="text-lg font-semibold">Edit Workspace</p>
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="flex flex-col items-end space-y-4"
//           >
//             {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

//             <div className="w-full space-y-1">
//               <p className="font-semibold">Workspace name</p>
//               <input
//                 type="text"
//                 placeholder="Workspace name"
//                 className="w-full border p-2 rounded"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>

//             <div className="w-full space-y-1">
//               <p className="font-semibold">
//                 Workspace description{" "}
//                 <span className="text-gray-400 ml-1 font-normal">Optional</span>
//               </p>
//               <textarea
//                 type="text"
//                 placeholder="e.g. Our team organize projects and tasks here"
//                 className="w-full border p-2 rounded"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 rows={5}
//               />
//             </div>

//             <button
//               disabled={isPending}
//               className=" bg-black text-white p-2 rounded"
//             >
//               {isPending ? "Updating Workspace..." : "Update Workspace"}
//             </button>
//           </form>
//         </div>

//         <div className="space-y-4">
//           <div className="border-b border-gray-200 py-2">
//             <p className="text-lg font-semibold">Delete Workspace</p>
//           </div>

//           <div className="flex flex-col items-end">
//             <p className="text-gray-400">
//               Deleting a workspace is permanent action and cannot be undone.
//               Once you delete a workspace, all its associated data, including
//               projects, tasks and member roles, will be permanently removed.
//               Please proceed wirh caution and ensure this action is intentional.
//             </p>
//             <button className="bg-red-500 text-white p-2 rounded">
//               Delete Workspace
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUpdateOrg } from "../api/mutations/org.mutation";
import { useCurrentOrg } from "../api/queries/org.query";
import { useModal } from "../context/ModalContext";
import DeleteWorkspaceModal from "../components/DeleteWorkspaceModal";

const Settings = () => {
  const { data: currentOrg } = useCurrentOrg();
  const { mutate: updateOrg, isPending } = useUpdateOrg();
  const { openModal } = useModal();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const isDirty =
    name !== (currentOrg?.name || "") ||
    description !== (currentOrg?.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    updateOrg(
      { name, description },
      {
        onSuccess: () => {
          toast.success("Workspace updated successfully");
        },
        onError: () => {
          toast.error("Failed to update workspace");
        },
      },
    );
  };

  useEffect(() => {
    if (currentOrg) {
      setName(currentOrg.name || "");
      setDescription(currentOrg.description || "");
    }
  }, [currentOrg]);

  return (
    <div>
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-2 px-40">
        <span className="flex items-center justify-center h-14 w-14 rounded-md bg-black text-white text-3xl font-bold">
          {currentOrg?.name?.charAt(0)}
        </span>
        <span className="flex flex-col">
          <span className="text-xl font-semibold">{currentOrg?.name}</span>
          <span className="text-gray-400">Workspace</span>
        </span>
      </div>

      <div className="space-y-4 px-40 mt-6">
        <h1 className="text-xl font-semibold">Workspace Settings</h1>

        <div className="space-y-4">
          <div className="border-b border-gray-200 py-2">
            <p className="text-lg font-semibold">Edit Workspace</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-end space-y-4"
          >
            <div className="w-full space-y-1">
              <p className="font-semibold">Workspace name</p>
              <input
                type="text"
                placeholder="Workspace name"
                className="w-full border p-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="w-full space-y-1">
              <p className="font-semibold">
                Workspace description{" "}
                <span className="text-gray-400 ml-1 font-normal">Optional</span>
              </p>
              <textarea
                placeholder="e.g. Our team organize projects and tasks here"
                className="w-full border p-2 rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <button
              // 3. Disable if pending OR if no changes were made
              disabled={isPending || !isDirty}
              className="bg-black text-white p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Updating Workspace..." : "Update Workspace"}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="border-b border-gray-200 py-2">
            <p className="text-lg font-semibold">Delete Workspace</p>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-gray-400">
              Deleting a workspace is permanent action and cannot be undone.
              Once you delete a workspace, all its associated data, including
              projects, tasks and member roles, will be permanently removed.
              Please proceed wirh caution and ensure this action is intentional.
            </p>
            <button
              onClick={() =>
                openModal(<DeleteWorkspaceModal orgName={currentOrg?.name} />)
              }
              className="bg-red-500 text-white p-2 rounded"
            >
              Delete Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
