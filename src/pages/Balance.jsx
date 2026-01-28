import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";

const GroupBalancePage = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const backend_uri = import.meta.env.VITE_BACKEND_URI;
  const { id } = useParams();

  useEffect(() => {
    fetchBalance();
  }, [id]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backend_uri}/groups/${id}/balance`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }

      const data = await response.json();
      setBalance(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearExpenses = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`${backend_uri}/group/${id}/expenses`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete expenses");
      }

      const data = await response.json();

      alert(data.message || "Expenses cleared successfully!");

      setShowConfirmModal(false);

      fetchBalance();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const netBalance = balance?.netBalance || 0;
  const isPositive = netBalance > 0;
  const isZero = netBalance === 0;

  return (
    <div className="p-6 max-w-2xl">
      <button
        onClick={() => navigate(`/group/${id}`)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Group Balance
      </h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <span className="text-gray-600">You Paid</span>
          <span className="text-lg font-medium text-gray-900">
            ₹{balance?.totalPaid?.toFixed(2) || "0.00"}
          </span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <span className="text-gray-600">Your Share</span>
          <span className="text-lg font-medium text-gray-900">
            ₹{balance?.totalShare?.toFixed(2) || "0.00"}
          </span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-gray-700 font-medium">Net Balance</span>
          <span
            className={`text-xl font-semibold ${
              isZero
                ? "text-gray-900"
                : isPositive
                  ? "text-green-600"
                  : "text-red-600"
            }`}
          >
            {isPositive && "+"}₹{Math.abs(netBalance).toFixed(2)}
          </span>
        </div>

        <div className="pt-4">
          {isZero ? (
            <p className="text-sm text-gray-500 text-center">
              You're all settled up! 🎉
            </p>
          ) : isPositive ? (
            <p className="text-sm text-green-700 bg-green-50 px-4 py-2 rounded">
              You are owed ₹{Math.abs(netBalance).toFixed(2)}
            </p>
          ) : (
            <p className="text-sm text-red-700 bg-red-50 px-4 py-2 rounded">
              You owe ₹{Math.abs(netBalance).toFixed(2)}
            </p>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 flex gap-3">
        <button
          onClick={() => setShowConfirmModal(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          <span className="font-medium">Clear Expenses</span>
        </button>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Clear All Expenses?
            </h3>
            <p className="text-gray-600 mb-6">
              This will permanently delete all expenses in this group. This
              action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={deleting}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearExpenses}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Yes, Clear All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupBalancePage;
