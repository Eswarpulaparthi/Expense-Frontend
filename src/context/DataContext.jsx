import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [group_name, setGroup_name] = useState("");
  const [groupContext, setGroupContext] = useState([]);
  const [loading, setLoading] = useState(true);
  const backend_uri = import.meta.env.VITE_BACKEND_URI;
  const getGroups = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await fetch(`${backend_uri}/groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const groupData = await response.json();
        setGroupContext(groupData.groups);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <UserContext.Provider
      value={{
        loading,
        group_name,
        setGroup_name,
        groupContext,

        getGroups,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
