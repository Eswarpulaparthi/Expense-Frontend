import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Users, MessageSquare, X, Menu } from "lucide-react";
import { useUser } from "@/context/DataContext";

export default function Sidebar() {
  const { setGroup_name, groupContext, loading: groupsLoading } = useUser();
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [membersLoading, setMembersLoading] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backend_uri = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    if (id && groupContext.length > 0) {
      const currentGroup = groupContext.find(
        (group) => group.id.toString() === id,
      );
      if (currentGroup) {
        setGroup_name(currentGroup.name);
      }
    }
  }, [id, groupContext, setGroup_name]);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (!id) {
        setMembers([]);
        setGroupName("");
        return;
      }

      try {
        setMembersLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${backend_uri}/groups/${id}/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const membersData = await response.json();
          setMembers(membersData.members || []);
          setGroupName(membersData.groupName || "Group Details");
        }
      } catch (error) {
        console.error("Failed to fetch members:", error);
      } finally {
        setMembersLoading(false);
      }
    };

    fetchGroupMembers();
  }, [id, backend_uri]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  const handleGroupClick = (groupId, groupname) => {
    setGroup_name(groupname);
    navigate(`/group/${groupId}`);
  };

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-900" />
        ) : (
          <Menu className="w-6 h-6 text-gray-900" />
        )}
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:relative
          top-0 left-0
          h-screen w-80 
          bg-white text-gray-900 
          flex flex-col 
          border-r border-gray-200
          z-40
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Workspace</h1>
          <p className="text-gray-500 text-sm mt-1">Team Dashboard</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {groupsLoading ? (
            <p className="text-gray-500 text-sm text-center py-4">
              Loading groups...
            </p>
          ) : groupContext.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              No groups available
            </p>
          ) : (
            groupContext.map((group) => (
              <div
                key={group.id}
                onClick={() => handleGroupClick(group.id, group.name)}
                className={`bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer border shadow-sm ${
                  id === group.id.toString()
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {group.name}
                    </h3>
                  </div>
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-1" />
                </div>
                <div className="mt-3 text-xs text-gray-400">
                  Created by {group.creator?.name || "Unknown"}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {groupName || "Group Members"}
            </h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {members.length}
            </span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {membersLoading ? (
              <p className="text-gray-400 text-xs text-center py-2">
                Loading members...
              </p>
            ) : members.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-2">
                {id ? "No members yet" : "Select a group to view members"}
              </p>
            ) : (
              members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate font-medium">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {member.email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
