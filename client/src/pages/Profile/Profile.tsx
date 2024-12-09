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
    <div className="h-screen w-full bg-base-100 pt-16">
      <div className="w-full max-w-[800px]  mx-auto px-4 py-8 grid grid-rows-2 sm:grid-rows-none sm:grid-cols-2 gap-4 p-4">
        {/* Profile Card */}
        <div className="bg-base-200 shadow-xl rounded-xl p-6 text-center space-y-6 row-span-1 sm:col-span-2 h-/2 ">
          <h1 className="text-3xl font-bold text-primary">
            My Profile
          </h1>
          <p className="text-sm text-gray-500">
            Manage your profile information
          </p>

          {/* Avatar Upload */}
          <div className="relative mx-auto w-32 h-32">
            {isUpdatingProfile ? (
              <div className="animate-pulse border-4 border-gray-300 rounded-full w-full h-full grid place-content-center">
                Uploading...
              </div>
            ) : isCheckingAuth ? (
              <div className="animate-pulse border-4 border-gray-300 rounded-full w-full h-full grid place-content-center">
                Loading...
              </div>
            ) : (
              <img
                src={authUser?.profilePic}
                alt="Profile"
                className="rounded-full w-full h-full object-cover border-4 border-primary"
              />
            )}
            {/* Camera Upload */}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-2 right-2 bg-primary hover:bg-primary-focus text-white p-2 rounded-full shadow-md cursor-pointer transition duration-300">
              <Camera className="w-5 h-5" />
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
          <p className="text-sm text-gray-400">
            {isUpdatingProfile
              ? "Uploading..."
              : "Click the camera icon to update your photo"}
          </p>
        </div>

        {/* User Information Card */}
        <div className="bg-base-200 shadow-md rounded-xl mt-8 p-6 space-y-6 ">
          <h2 className="text-lg font-semibold text-gray-700">
            Profile Details
          </h2>

          {/* Full Name */}
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-base-300 px-4 py-2 rounded-lg border">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4" />
              </span>
              {isFullnameEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fullnameNewValue}
                    onChange={(e) =>
                      setFullnameNewValue(e.target.value)
                    }
                    className="input input-sm input-bordered w-40"
                  />
                  <Save
                    className="cursor-pointer text-green-500 hover:text-green-600"
                    onClick={() => {
                      setIsFullnameEditing(false);
                      updateFullname();
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{authUser?.fullname || "Loading..."}</span>
                  <Pen
                    className="cursor-pointer text-primary hover:text-primary-focus"
                    onClick={() => {
                      setIsFullnameEditing(true);
                      setFullnameNewValue(
                        authUser?.fullname as string
                      );
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-base-300 px-4 py-2 rounded-lg border">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Username
              </span>
              <span className="text-sm ">
                {authUser?.username || "Loading..."}
              </span>
            </div>
          </div>
        </div>

        {/* Account Information Card */}
        <div className="bg-base-200 shadow-md rounded-xl mt-8 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Account Information
          </h2>
          <div className="text-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span>Member Since</span>
              <span className="text-gray-700">Jan 1, 2023</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Account Status</span>
              <span className="text-green-500 font-medium">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
