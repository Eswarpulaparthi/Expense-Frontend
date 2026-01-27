import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [group_name, setGroup_name] = useState("");
  const [groupContext, setGroupContext] = useState([]);
  const [loading, setLoading] = useState(true);

  const getGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://expensespliter.onrender.com/groups",
        {
          credentials: "include",
        },
      );
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
