import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchData,
  createUser,
  updateUser,
  deleteUser,
  fetchlabBooking,
} from "../../redux/Slices/LabResultSlice";
import {
  Search,
  Shield,
  Trash2,
  Edit,
  PlusCircle,
  ChevronUp,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LabResults() {
  const dispatch = useDispatch();
  const { data, bookings, loading } = useSelector(
    (state) => state.labResult ?? { data: [], bookings: {}, loading: false }
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    booking_test_id: "",
    result: "",
    symbol_id: "",
    remarks: "",
    value: "",
  });

  useEffect(() => {
    dispatch(fetchData());
    dispatch(fetchlabBooking());
  }, [dispatch]);

  // Filter results
  const filteredResults = Array.isArray(data)
    ? data.filter((r) => {
        const searchLower = search.toLowerCase();
        return (
          r.booking_test_id?.toString().includes(searchLower) ||
          r.result?.toLowerCase().includes(searchLower) ||
          r.symbol_id?.toLowerCase().includes(searchLower)
        );
      })
    : [];

  // Handle Save
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.booking_test_id) {
      toast.error("Booking test is required");
      return;
    }

    try {
      if (!editData) {
        await dispatch(createUser(formData)).unwrap();
        toast.success("Lab Result added 🎉");
      } else {
        await dispatch(
          updateUser({ id: editData.id, updatedUser: formData })
        ).unwrap();
        toast.success("Lab Result updated 🎉");
      }
      resetForm();
      setShowForm(false);
      dispatch(fetchData());
    } catch {
      toast.error(editData ? "Update failed 🚫" : "Add failed 🚫");
    }
  };

  const resetForm = () => {
    setFormData({
      booking_test_id: "",
      result: "",
      symbol_id: "",
      remarks: "",
      value: "",
    });
    setEditData(null);
  };

  // Auto-fill when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        booking_test_id: editData.booking_test_id || "",
        result: editData.result || "",
        symbol_id: editData.symbol_id || "",
        remarks: editData.remarks || "",
        value: editData.value || "",
      });
    }
  }, [editData]);

  // Delete
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("Lab Result deleted 🎉");
      dispatch(fetchData());
    } catch {
      toast.error("Delete failed 🚫");
    }
    setDeleteId(null);
  };

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
              <h2 className="text-xl md:text-2xl font-bold">Lab Results</h2>
              <p className="text-sm opacity-80">Manage test results</p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            <PlusCircle size={18} /> New Result
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search results..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Total count */}
      <div className="mb-2 font-semibold text-gray-700">
        Total Results: {filteredResults.length}
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white text-left rounded text-sm md:text-base">
              <th className="p-3">Booking Test</th>
              <th className="p-3">Result</th>
              <th className="p-3">Symbol</th>
              <th className="p-3">Remarks</th>
              <th className="p-3">Value</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length > 0 ? (
              filteredResults.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-gray-50 text-sm md:text-base"
                >
                  <td className="p-3">
                    {bookings[r.booking_test_id]?.id || r.booking_test_id}
                  </td>
                  <td className="p-3">{r.result}</td>
                  <td className="p-3">{r.symbol_id}</td>
                  <td className="p-3">{r.remarks}</td>
                  <td className="p-3">{r.value}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditData(r);
                        setShowForm(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
                    >
                      <Edit size={14} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(r.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredResults.length > 0 ? (
          filteredResults.map((r) => (
            <div key={r.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{r.result}</p>
                  <p className="text-gray-600 text-sm">
                    Booking: {r.booking_test_id}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === r.id ? null : r.id)
                  }
                  className={`transform transition-transform duration-300 ${
                    expandedId === r.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronUp size={20} />
                </button>
              </div>

              {expandedId === r.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Symbol: </span>
                    {r.symbol_id}
                  </p>
                  <p>
                    <span className="font-semibold">Remarks: </span>
                    {r.remarks}
                  </p>
                  <p>
                    <span className="font-semibold">Value: </span>
                    {r.value}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditData(r);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(r.id)}
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
          <p className="text-gray-500">No results found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editData ? "Edit Result" : "Add Result"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                value={formData.booking_test_id}
                onChange={(e) =>
                  setFormData({ ...formData, booking_test_id: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Booking Test</option>
                {Object.values(bookings).map((b) =>
                  b.booking_tests.map((test) => (
                    <option key={test.id} value={test.id}>
                      {test.lab_test.name} (ID: {test.id})
                    </option>
                  ))
                )}
              </select>

              <input
                type="text"
                placeholder="Result"
                value={formData.result}
                onChange={(e) =>
                  setFormData({ ...formData, result: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                placeholder="Symbol ID"
                value={formData.symbol_id}
                onChange={(e) =>
                  setFormData({ ...formData, symbol_id: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Remarks"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Value"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
                >
                  {editData ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete this Lab Result?
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

