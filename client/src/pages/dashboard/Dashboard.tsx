import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";

export default function Dashboard() {
  // const [cookies] = useCookies(["token"]);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // Usage
  const token = getCookie("token");
  console.log(document.cookie); // This should log your token if it exists

  // const token = localStorage.getItem("token");
  console.log(token);
  let userId = "";
  if (token) {
    // Decode the token
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.userId;
      console.log(userId);
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  const apiCall = async () => {
    console.log("api hit");

    const response = await fetch(
      `http://localhost:3000/api/messages/${12}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    console.log("res in dashboard:", await response.json());
  };
  useEffect(() => {
    apiCall;
  }, []);

  return (
    <div>
      <button
        className="text-4xl border bg-white text-black"
        onClick={apiCall}>
        Dashboard
      </button>
    </div>
  );
}
