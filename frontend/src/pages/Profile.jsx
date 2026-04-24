/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useAuth } from "../api/queries/auth.query";
import { useUploadFile } from "../api/mutations/upload.mutation";
import { useUpdateProfile } from "../api/mutations/user.mutation";
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
    } catch (err) {
      toast.error("Failed to upload");
    }
  };

  //  Remove Avatar
  const handleRemoveAvatar = () => {
    setPreview(null);
    updateProfile({ avatar: "" });
  };

  // Name Change
  const handleNameChange = (e) => {
    setName(e.target.value);
    // setIsChanged(e.target.value !== user.name);
  };

  const handleSave = () => {
    updateProfile({ name });
    // setIsChanged(false);
  };

  const isChanged = name !== user?.name;

  return (
    <div className="p-6 space-y-6 px-40">
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold">User Profile </h1>
          <SquarePen size={20} />
        </div>

        <p className="text-gray-500 text-sm">
          Manage your profile information and avatar here
        </p>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <img
            src={preview || getAvatar(user)}
            alt="avatar"
            className="w-30 h-30 rounded-full object-cover border-2 border-gray-700"
          />

          {/* Hover Overlay */}
          <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
            <Camera className="text-white" size={20} />
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        {/* Remove Button */}
        {user?.avatar && (
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
      <div className="space-y-4 px-40">
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
  );
};

export default Profile;
