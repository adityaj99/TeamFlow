/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useAuth } from "../api/queries/auth.query";
import { useUploadFile } from "../api/mutations/upload.mutation";
import {
  useChangePassword,
  useUpdateProfile,
} from "../api/mutations/user.mutation";
import { getAvatar } from "../utils/getAvatar";
import { Camera, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { data: userData } = useAuth();
  const user = userData?.user;

  const { mutateAsync: uploadFile, isPending: uploading } = useUploadFile();
  const { mutate: updateProfile, isPending: updating } = useUpdateProfile();

  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  //  Avatar Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.warning("Max 5MB allowed");
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadFile(formData);
      updateProfile({ avatar: res.url });
      toast.success("Profile image uploaded");
    } catch (err) {
      setPreview(null);
      toast.error("Failed to upload");
    }
  };

  //  Remove Avatar
  const handleRemoveAvatar = () => {
    setPreview(null);
    updateProfile(
      { avatar: "" },
      { onSuccess: () => toast.success("Avatar removed") },
    );
  };

  // Name Change
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSave = () => {
    if (!name.trim()) return toast.error("Name cannot be empty");
    updateProfile(
      { name },
      { onSuccess: () => toast.success("Profile updated successfully!") },
    );
  };

  const isChanged = name !== user?.name;

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { mutate: changePassword, isPending: changingPassword } =
    useChangePassword();

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (!passwords.currentPassword || !passwords.newPassword) {
      return toast.error("Please fill in all password fields.");
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    if (passwords.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    changePassword(
      {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password updated successfully!");
          setPasswords({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        },
        onError: (err) => {
          toast.error(
            err.response?.data?.message || "Failed to update password",
          );
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold">User Profile </h1>
          <SquarePen size={20} />
        </div>

        <p className="text-gray-500 text-sm">
          Manage your profile information and avatar here
        </p>
      </div>

      <div className="flex gap-10 w-full">
        <div className="w-[35%] p-8 rounded-md border shadow border-gray-200">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <img
                src={preview || getAvatar(user)}
                alt="avatar"
                className={`w-30 h-30 rounded-full object-cover border-2 border-gray-700 transition ${uploading ? "opacity-50 blur-sm" : ""}`}
              />

              {/* Hover Overlay */}
              {!uploading && (
                <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                  <Camera className="text-white" size={20} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>

            {/* Remove Button */}
            {user?.avatar && !uploading && (
              <button
                onClick={handleRemoveAvatar}
                className="flex items-center gap-2 text-red-500 text-sm cursor-pointer"
              >
                <Trash2 size={16} />
                Remove Avatar
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Name</p>
              <input
                value={name}
                onChange={handleNameChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <p className="font-semibold">Email</p>
              <input
                value={user?.email}
                disabled
                className="border p-2 rounded w-full text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Save Button */}

            <button
              onClick={handleSave}
              disabled={updating || !isChanged}
              className={`w-full bg-black text-white px-4 py-2 rounded ${updating || !isChanged ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 cursor-pointer"}`}
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="w-[65%]">
          {/* change password */}
          <form
            onSubmit={handlePasswordChange}
            className="space-y-4 rounded-md border border-gray-200 p-8 shadow"
          >
            <h2 className="text-lg font-semibold">Change Password</h2>

            <div className="grid grid-cols-2 gap-4 w-full">
              <input
                type="password"
                placeholder="Current Password"
                className=" border p-2 rounded"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
              />
              <input
                type="password"
                placeholder="New Password"
                className="border p-2 rounded"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="border p-2 rounded"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
              />

              <button
                type="submit"
                disabled={changingPassword}
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 transition cursor-pointer hover:opacity-90"
              >
                {changingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
