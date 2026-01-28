import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DollarSign, FileText, Tag, User, ArrowLeft } from "lucide-react";

const categories = [
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Healthcare",
  "Travel",
  "Other",
];

function AddExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    paidBy: "",
    amount: "",
    description: "",
    category: "",
  });
  const token = localStorage.getItem("token");
  const backend_uri = import.meta.env.VITE_BACKEND_URI;
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${backend_uri}/groups/${id}/members`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setMembers(data.members || []))
      .catch((err) => console.error("Failed to fetch members:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.paidBy ||
      !formData.amount ||
      !formData.description ||
      !formData.category
    ) {
      return alert("Please fill in all fields");
    }

    try {
      const response = await fetch(
        `${backend_uri}/groups/${id}/create-expense`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            amount: parseFloat(formData.amount),
          }),
        },
      );
      response.ok
        ? navigate(`/group/${id}`)
        : alert("Failed to create expense");
    } catch (error) {
      console.error("Failed to create expense:", error);
      alert("An error occurred");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(`/group/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Group</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Expense</h1>
        <p className="text-gray-500 mt-2 mb-8">Fill in the details below</p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6"
        >
          {[
            {
              name: "paidBy",
              label: "Paid By",
              icon: User,
              type: "select",
              options: members.map((m) => ({ value: m.id, label: m.name })),
            },
            {
              name: "amount",
              label: "Amount",
              icon: DollarSign,
              type: "number",
              placeholder: "0.00",
            },
            {
              name: "description",
              label: "Description",
              icon: FileText,
              type: "textarea",
              placeholder: "What was this expense for?",
            },
            {
              name: "category",
              label: "Category",
              icon: Tag,
              type: "select",
              options: categories.map((c) => ({ value: c, label: c })),
            },
          ].map(({ name, label, icon: Icon, type, placeholder, options }) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Icon className="w-4 h-4 inline mr-2" />
                {label}
              </label>
              {type === "select" ? (
                <select
                  name={name}
                  value={formData[name]}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [name]: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select {label.toLowerCase()}</option>
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : type === "textarea" ? (
                <textarea
                  name={name}
                  value={formData[name]}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [name]: e.target.value }))
                  }
                  placeholder={placeholder}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [name]: e.target.value }))
                  }
                  placeholder={placeholder}
                  step={type === "number" ? "0.01" : undefined}
                  min={type === "number" ? "0" : undefined}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              )}
            </div>
          ))}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/group/${id}`)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl"
            >
              Create Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
