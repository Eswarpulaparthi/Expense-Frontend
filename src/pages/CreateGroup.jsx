import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ArrowLeft } from "lucide-react";
import { useUser } from "@/context/DataContext";

function CreateGroup() {
  const { getGroups } = useUser();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleGroup(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    console.log("clicked to create group", name);

    try {
      const response = await fetch("http://localhost:3000/create-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const data = await response.json();
        await getGroups();
        navigate("/dashboard");
        setName("");
      } else {
        const error = await response.json();
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        <Card className="border-slate-200 shadow-lg bg-white">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Create A Group
            </CardTitle>
            <CardDescription className="text-slate-500 mt-2">
              Start collaborating with your team
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleGroup}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Group Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter group name"
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-3 pt-2">
            <Button
              onClick={handleGroup}
              disabled={loading || !name.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Group"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
              className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default CreateGroup;
