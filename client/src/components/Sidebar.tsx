import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { chatStore } from "../store/chatStore";
import { Users } from "lucide-react";
import { IUser } from "../types/types";

export default function Sidebar() {
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const { selectedUser, setSelectedUser } = chatStore();

  // __get_users
  const baseURI = "http://localhost:3000/api";

  const getUsers = async () => {
    setIsUsersLoading(true);
    try {
      const response = await fetch(baseURI + "/users/all-users", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!data.success) {
        toast.error("Something went wrong | failed to get useres");
        return;
      }
      setUsers(data.data.allUsers);
    } catch (error) {
      toast.error("Something went wrong | failed to get useres");
      console.log("Error while fetching useres: ", error);
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <aside className="h-full w-24 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">
            Contacts
          </span>
        </div>
        {/* TODO: Online filter toggle */}
        {/* <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div> */}
      </div>

      <div className="overflow-y-auto w-full py-3">
        {users.map((user: IUser) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}>
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic}
                alt={user.fullname}
                className="size-12 object-cover rounded-full"
              />
              {/* {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )} */}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">
                {user.fullname}
              </div>
              <div className="text-sm text-zinc-400">
                Online{" "}
                {/* {onlineUsers.includes(user._id)
                  ? "Online"
                  : "Offline"} */}
              </div>
            </div>
          </button>
        ))}

        {/* {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No online users
          </div>
        )} */}
      </div>
    </aside>
  );
}
