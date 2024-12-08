import { Camera, Mail, Pen, Save, User } from "lucide-react";
import { useState } from "react";
import useStore from "../../store/store";
import toast from "react-hot-toast";

export default function Profile() {
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isFullnameEditing, setIsFullnameEditing] = useState(false);
  const [fullnameNewValue, setFullnameNewValue] = useState("");
  const { authUser, isCheckingAuth, checkAuth } = useStore();

  // hanlde Profile image upload
  const handleProfileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    // const url = URL.createObjectURL(file);
    const formData = new FormData();
    formData.append("profilePic", file);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    try {
      setIsUpdatingProfile(true);
      const response = await fetch(
        "http://localhost:3000/api/auth/update-profile-image",
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );
      const jsonResponse = await response.json();
      if (!jsonResponse.success) {
        toast.error(jsonResponse.erros[0]);
        return;
      }
      checkAuth();
      toast.success("Profile image Updated successfully!");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error during upload:", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const updateFullname = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/update-fullname",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newFullname: fullnameNewValue }),
        }
      );
      const jsonResponse = await response.json();
      if (!jsonResponse.success) {
        // toast.error(jsonResponse.);
        return;
      }
      checkAuth();
      toast.success("Fullname Updated successfully!");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error during upload:", error);
    }
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {isUpdatingProfile ? (
                <div className="skeleton border-4 h-32 grid items-center text-center text-sm rounded-full w-32">
                  Profile Updating..
                </div>
              ) : isCheckingAuth ? (
                <div className="skeleton border-4 h-32 grid items-center text-center text-sm rounded-full w-32">
                  Loading Image
                </div>
              ) : (
                <img
                  src={authUser?.profilePic}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 "
                />
              )}
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${false ? "animate-pulse pointer-events-none" : ""}
                `}>
                <Camera className="w-5 h-5  text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfileUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <div className="px-4 py-2.5 bg-base-200 flex justify-between rounded-lg border">
                {!isFullnameEditing ? (
                  <p>{authUser?.fullname || "Loading..."}</p>
                ) : (
                  <input
                    type="text"
                    value={fullnameNewValue}
                    onChange={(e) =>
                      setFullnameNewValue(e.target.value)
                    }
                  />
                )}
                {isFullnameEditing ? (
                  <Save
                    className="hover:text-primary cursor-pointer"
                    onClick={() => {
                      setIsFullnameEditing(false);
                      updateFullname();
                    }}
                  />
                ) : (
                  <Pen
                    className="hover:text-primary cursor-pointer"
                    onClick={() => {
                      setIsFullnameEditing(true);
                      setFullnameNewValue(
                        authUser?.fullname as string
                      );
                    }}
                  />
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                User Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.username || "Loading..."}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">
              Account Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                {/* <span>{authUser.createdAt?.split("T")[0]}</span> */}
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
