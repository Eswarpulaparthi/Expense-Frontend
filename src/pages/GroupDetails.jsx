import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, UserPlus, Plus, DollarSign } from "lucide-react";
import { useUser } from "@/context/DataContext";

function GroupDetails() {
  const { id } = useParams();
  const { group_name } = useUser();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const backend_uri = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    fetchExpenses();
  }, [id]);

  const fetchExpenses = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${backend_uri}/group/${id}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) setExpenses(data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatAmount = (amount) => `₹${amount.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:p-6 p-4 pt-20 lg:pt-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="bg-white rounded-lg p-4 lg:p-6 mb-6 shadow-sm border border-gray-200">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              {group_name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
            </p>
          </div>

          <h2 className="text-lg font-semibold mb-4 text-gray-900">Expenses</h2>

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-pulse">Loading expenses...</div>
            </div>
          ) : expenses.length === 0 ? (
            <div className="bg-white rounded-lg p-8 lg:p-12 text-center border border-gray-200">
              <p className="text-gray-500 mb-2">No expenses yet</p>
              <p className="text-sm text-gray-400">
                Add your first expense to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3 pb-32 lg:pb-24">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {expense.description}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                        <span className="font-medium">
                          {expense.payer?.name || "Unknown"}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>{formatDate(expense.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <div className="text-xl lg:text-2xl font-bold text-gray-900">
                        {formatAmount(expense.amount)}
                      </div>
                      {expense.splitType && (
                        <div className="text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
                          {expense.splitType}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:bottom-6 lg:right-6 lg:left-auto bg-white lg:bg-transparent border-t lg:border-0 border-gray-200 p-4 lg:p-0 flex lg:flex-col gap-3 justify-around lg:justify-end shadow-lg lg:shadow-none">
        <Link to={`/group/add-member/${id}`} className="lg:hidden flex-1">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors">
            <UserPlus className="w-5 h-5" />
          </button>
        </Link>

        <Link to={`/group/${id}/expense`} className="lg:hidden flex-1">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors">
            <span className="font-medium text-sm">Expense</span>
          </button>
        </Link>

        <Link to={`/group/${id}/balance`} className="lg:hidden flex-1">
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors">
            <span className="font-medium text-sm">Balance</span>
          </button>
        </Link>

        <Link to={`/group/add-member/${id}`} className="hidden lg:block">
          <button className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors">
            <UserPlus className="w-5 h-5" />
          </button>
        </Link>

        <Link to={`/group/${id}/expense`} className="hidden lg:block">
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 transition-colors">
            <span className="font-medium">New Expense</span>
          </button>
        </Link>

        <Link to={`/group/${id}/balance`} className="hidden lg:block">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 transition-colors">
            <span className="font-medium">Balance</span>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default GroupDetails;
