import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useUser } from "@/context/DataContext";

function GroupDetails() {
  const { id } = useParams();
  const { group_name } = useUser();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, [id]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://expensespliter.onrender.com/group/${id}/expenses`,
        { credentials: "include" },
      );
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">{group_name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
          </p>
        </div>

        <h2 className="text-lg font-semibold mb-4">Expenses</h2>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : expenses.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-500">No expenses yet</p>
          </div>
        ) : (
          <div className="space-y-3 mb-24">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {expense.description}
                    </h3>
                    <div className="text-sm text-gray-500 mt-1">
                      {expense.payer?.name || "Unknown"} •{" "}
                      {formatDate(expense.createdAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {formatAmount(expense.amount)}
                    </div>
                    {expense.splitType && (
                      <div className="text-xs text-gray-500">
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

      <div className="fixed bottom-6 right-6 flex gap-3">
        <Link to={`/group/add-member/${id}`}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </button>
        </Link>

        <Link to={`/group/${id}/expense`}>
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2">
            <span className="font-medium">New Expense</span>
          </button>
        </Link>

        <Link to={`/group/${id}/balance`}>
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2">
            <span className="font-medium">Balance</span>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default GroupDetails;
