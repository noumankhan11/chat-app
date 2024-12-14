import { redirect } from "react-router-dom";

export default async function handleLogout() {
  const response = await fetch("http://localhost/api/auth/logout");
  const data = await response.json();

  console.log(data);
  redirect("/");
}
