import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Users, LogOut } from "lucide-react";
import { useUser } from "@/context/DataContext";

function Dashboard() {
  const { user, logout } = useAuth();
  const { setGroup_name, groupContext, loading } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm animate-pulse"
              >
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {user.user.name} (ID:{user.user.id})
            </h1>
            <p className="text-slate-600">
              Manage your groups and collaborate with your team
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groupContext.length > 0 ? (
            groupContext.map((g) => (
              <Link to={`/group/${g.id}`} key={g.id}>
                <Card
                  onClick={() => {
                    setGroup_name(g.name);
                  }}
                  key={g.id}
                  className="group hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-slate-300 cursor-pointer bg-white"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {g.name || "Group Name"}
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-500">
                      Created by {g.creator.name}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="border-dashed border-2 border-slate-300 bg-slate-50">
                <CardHeader className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <CardTitle className="text-xl text-slate-700">
                    No Groups Yet
                  </CardTitle>
                  <CardDescription className="text-slate-500 mt-2">
                    Create your first group to start collaborating
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Link to="/create-group">
        <button className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
          <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </Link>
    </div>
  );
}

export default Dashboard;
