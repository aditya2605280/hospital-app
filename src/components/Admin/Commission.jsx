import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCommission,
  insertCommission,
  updateCommission,
  deleteCommission,
  updateCommissionStatus,
  fetchDoctors,
} from "../../redux/Slices/CommissionSlice";
import { Search, Shield, Trash2, PlusCircle, MoreVertical, Edit, ChevronUp } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Commission() {
  const dispatch = useDispatch();
  const { commission = [], doctors = {},  } = useSelector(
    (state) => state.commission
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [editData, setEditData] = useState(null);

  const [formData, setFormData] = useState({
    doctor_id: "",
    source_type: "",
    source_id: "",
    amount: "",
    date: "",
    status: "pending",
  });

  useEffect(() => {
    dispatch(fetchCommission());
    dispatch(fetchDoctors());
  }, [dispatch]);

  const filteredCommission = (commission || []).filter((c) => {
    const doctorName = doctors[c.doctor_id]?.name || "";
    return doctorName.toLowerCase().includes(search.toLowerCase());
  });

  const resetForm = () => {
    setFormData({
      doctor_id: "",
      source_type: "",
      source_id: "",
      amount: "",
      date: "",
      status: "pending",
    });
    setShowForm(false);
    setEditData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await dispatch(
          updateCommission({ id: editData.id, payload: formData })
        ).unwrap();
        toast.success("Commission updated 🎉");
      } else {
        await dispatch(insertCommission(formData)).unwrap();
        toast.success("Commission added 🎉");
      }
      resetForm();
      dispatch(fetchCommission());
    } catch (err) {
      console.error(err);
      toast.error("Save failed 🚫");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCommission(id)).unwrap();
      toast.success("Commission deleted 🎉");
      dispatch(fetchCommission());
    } catch (err) {
      console.error(err);
      toast.error("Delete failed 🚫");
    }
    setDeleteId(null);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await dispatch(updateCommissionStatus({ id, status })).unwrap();
      toast.success("Status updated ✅");
      dispatch(fetchCommission());
    } catch (err) {
      console.error(err);
      toast.error("Status update failed 🚫");
    }
  };

  const STATUS_OPTIONS = [
    { value: "1", label: "Pending" },
    { value: "2", label: "Paid" },
  ];

  return (
    <div className="p-4 md:px-2 bg-gray-100 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

    

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 text-white p-4 rounded-xl shadow flex justify-between flex-col gap-4 mb-6">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-3">
              <Shield size={32} color="white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-bold">Commission</h2>
              <p className="text-sm opacity-80">Manage doctor commissions</p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            <PlusCircle size={18} /> New Commission
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm md:text-base">
              <th className="p-3">Doctor</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Source Type</th>
              <th className="p-3">Source ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Update Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommission.length > 0 ? (
              filteredCommission.map((c) => (
                <tr
                  key={c.id}
                  className="border-b hover:bg-gray-50 text-sm md:text-base"
                >
                  <td className="p-3">{doctors[c.doctor_id]?.name}</td>
                  <td className="p-3">{c.amount}</td>
                  <td className="p-3">{c.source_type}</td>
                  <td className="p-3">{c.source_id}</td>
                  <td className="p-3">{c.date}</td>
                  <td className="p-3">{c.status} </td>
                   <td className="p-3"> <select
                      value={String(c.status ?? "pending")}
                      onChange={(e) =>
                        handleStatusUpdate(c.id, e.target.value)
                      }
                      className="border p-1 rounded"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 flex justify-center gap-2 items-center">
                    <button
                      onClick={() => {
                        setEditData(c);
                        setFormData(c);
                        setShowForm(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
                    > <Edit size={14} />
                      Update
                    </button>
                    <button
                      onClick={() => setDeleteId(c.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No commissions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredCommission.length > 0 ? (
          filteredCommission.map((c) => (
            <div key={c.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{doctors[c.doctor_id]?.name}</p>
                  <p className="text-gray-600 text-sm">{c.amount} ₹</p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                  className={`transform transition-transform duration-300 ${
                  expandedId === c.id ? "rotate-180" : "rotate-0"
                  }`}
                  >
                  <ChevronUp size={20} />
                </button>
              </div>

              {expandedId === c.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Source:</span>{" "}
                    {c.source_type} ({c.source_id})
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span> {c.date}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> {c.status}
                  </p>

                  <div className="flex gap-2 mt-2 items-center">
                    <select
                      value={String(c.status ?? "pending")}
                      onChange={(e) => handleStatusUpdate(c.id, e.target.value)}
                      className="border p-1 rounded"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                       <button
                      onClick={() => {
                        setEditData(c);
                        setFormData(c);
                        setShowForm(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
                    > <Edit size={14} />
                      Update
                    </button>
                    <button
                      onClick={() => setDeleteId(c.id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No commissions found.</p>
        )}
      </div>

      {/* Add/Edit Commission Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editData ? "Edit Commission" : "Add Commission"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                value={formData.doctor_id}
                onChange={(e) =>
                  setFormData({ ...formData, doctor_id: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Doctor</option>
                {Object.values(doctors).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="Amount"
                className="border p-2 rounded w-full"
                required
              />

              <input
                type="text"
                value={formData.source_type}
                onChange={(e) =>
                  setFormData({ ...formData, source_type: e.target.value })
                }
                placeholder="Source Type"
                className="border p-2 rounded w-full"
                required
              />

              <input
                type="number"
                value={formData.source_id}
                onChange={(e) =>
                  setFormData({ ...formData, source_id: e.target.value })
                }
                placeholder="Source ID"
                className="border p-2 rounded w-full"
                required
              />

              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              />
        {!editData &&(
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="border p-2 rounded w-full"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
)}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete this commission?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded-xl"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                onClick={() => handleDelete(deleteId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

