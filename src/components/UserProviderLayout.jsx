import { UserProvider } from "@/context/DataContext";
import { Outlet } from "react-router-dom";

export function UserProviderWrapper() {
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
}
