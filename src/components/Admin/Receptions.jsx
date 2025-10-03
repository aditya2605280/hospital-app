import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchReceptions,
  fetchQualifications,
  fetchUsers,
  insertReception,
  updateReception,
  deleteReception,
} from "../../redux/Slices/ReceptionSlice";
import { Search, Shield, Trash2, Edit, PlusCircle, MoreVertical, ChevronUp } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Receptions() {
  const dispatch = useDispatch();
  const { receptions, users, qualifications, loading } = useSelector(
    (state) => state.receptions
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    user_id: "",
    qualification_id: "",
    husband_or_father_name: "",
    emergency_contact: "",
    address: "",
    joining_date: "",
    shift: "",
  });

  // Load data
  useEffect(() => {
    dispatch(fetchReceptions());
    dispatch(fetchUsers());
    dispatch(fetchQualifications());
  }, [dispatch]);

  const filteredReceptions = receptions.filter((r) =>
    (users[r.user_id]?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteReception(id)).unwrap();
      toast.success("Reception deleted successfully! 🎉");
      dispatch(fetchReceptions());
    } catch {
      toast.error("Delete failed! 🚫");
    }
    setDeleteId(null);
  };

  const resetForm = () => {
    setFormData({
      user_id: "",
      qualification_id: "",
      husband_or_father_name: "",
      emergency_contact: "",
      address: "",
      joining_date: "",
      shift: "",
    });
    setEditData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = editData
      ? {
          address: formData.address,
          joining_date: formData.joining_date,
          shift: formData.shift,
          husband_or_father_name: formData.husband_or_father_name,
          qualification_id: Number(formData.qualification_id),
          emergency_contact: formData.emergency_contact,
        }
      : {
          ...formData,
          user_id: Number(formData.user_id),
          qualification_id: Number(formData.qualification_id),
          clinic_id: 1,
        };

    try {
      if (!editData) {
        await dispatch(insertReception(payload)).unwrap();
        toast.success("Reception added successfully! 🎉");
      } else {
       await dispatch(updateReception({ user_id: editData.user_id, payload })).unwrap();
        toast.success("Reception updated successfully! 🎉");
      }
      resetForm();
      dispatch(fetchReceptions());
      setShowForm(false);
    } catch {
      toast.error(editData ? "Update failed! 🚫" : "Add failed! 🚫");
    }
  };

  // Auto-fill when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        qualification_id: editData.qualification_id || "",
        husband_or_father_name: editData.husband_or_father_name || "",
        emergency_contact: editData.emergency_contact || "",
        address: editData.address || "",
        joining_date: editData.joining_date || "",
        shift: editData.shift || "",
      });
    }
  }, [editData]);

  return (
    <div className="p-4 md:px-2 bg-gray-100 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <p className="text-white text-xl bg-gray-700 px-6 py-4 rounded">Loading...</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 text-white p-4 rounded-xl shadow flex justify-between flex-col gap-4 mb-6">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-3">
              <Shield size={32} color="white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-bold">Reception Management</h2>
              <p className="text-sm opacity-80">Manage system receptions</p>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            <PlusCircle size={18} /> New Reception
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search receptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="mb-2 font-semibold text-gray-700">
        Total Receptions: {receptions.length}
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white text-left rounded text-sm md:text-base">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Qualification</th>
              <th className="p-3">Email</th>
              <th className="p-3">Father/Husband</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReceptions.length > 0 ? (
              filteredReceptions.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 text-sm md:text-base">
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{users[r.user_id]?.name}</td>
                  <td className="p-3">{qualifications[r.qualification_id]?.degree}</td>
                  <td className="p-3">{users[r.user_id]?.email}</td>
                  <td className="p-3">{r.husband_or_father_name}</td>
                  <td className="p-3">{r.emergency_contact}</td>
                  <td className="p-3">{r.address}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => { setEditData(r); setShowForm(true); }}
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
                <td colSpan="8" className="text-center p-4">No receptions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      {/* <div className="md:hidden flex flex-col gap-4">
        {filteredReceptions.length > 0 ? (
          filteredReceptions.map((r) => (
            <div key={r.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{users[r.user_id]?.name}</p>
                  <p className="text-gray-600 text-sm">{qualifications[r.qualification_id]?.degree}</p>
                </div>
                <button onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                  <MoreVertical size={20} />
                </button>
              </div>

              {expandedId === r && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p><span className="font-semibold">Email: </span>{users[r.user_id]?.email}</p>
                  <p><span className="font-semibold">Father/Husband: </span>{r.husband_or_father_name}</p>
                  <p><span className="font-semibold">Phone: </span>{r.emergency_contact}</p>
                  <p><span className="font-semibold">Address: </span>{r.address}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => { setEditData(r); setShowForm(true); }}
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
          <p className="text-gray-500">No receptions found.</p>
        )}
      </div> */}


      {/* Mobile View */}
<div className="md:hidden flex flex-col gap-4">
  {filteredReceptions.length > 0 ? (
    filteredReceptions.map((r) => (
      <div key={r.id} className="border rounded-lg shadow bg-white">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <div>
            <p className="font-semibold">{users[r.user_id]?.name}</p>
            <p className="text-gray-600 text-sm">{qualifications[r.qualification_id]?.degree}</p>
          </div>
          <button
            onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
            className={`transform transition-transform duration-300 ${
              expandedId === r.id ? "rotate-180" : "rotate-0"
            }`}
          >
            <ChevronUp size={20} />
          </button>
        </div>

        {/* Collapsible Content */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandedId === r.id ? "max-h-96 p-4" : "max-h-0"
          }`}
        >
          <p><span className="font-semibold">Email: </span>{users[r.user_id]?.email}</p>
          <p><span className="font-semibold">Father/Husband: </span>{r.husband_or_father_name}</p>
          <p><span className="font-semibold">Phone: </span>{r.emergency_contact}</p>
          <p><span className="font-semibold">Address: </span>{r.address}</p>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => { setEditData(r); setShowForm(true); }}
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
      </div>
    ))
  ) : (
    <p className="text-gray-500 p-4">No receptions found.</p>
  )}
</div>


      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">{editData ? "Edit Reception" : "Add Reception"}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">

              {/* User dropdown only in Add */}
              {!editData && (
                <select
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                >
                  <option value="">Select User</option>
                  {Object.values(users).map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              )}

              {/* Qualification */}
              <select
                value={formData.qualification_id}
                onChange={(e) => setFormData({ ...formData, qualification_id: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Qualification</option>
                {Object.values(qualifications).map((q) => (
                  <option key={q.id} value={q.id}>{q.degree}</option>
                ))}
              </select>

              <input
                type="text"
                value={formData.husband_or_father_name}
                onChange={(e) => setFormData({ ...formData, husband_or_father_name: e.target.value })}
                placeholder="Husband/Father Name"
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                placeholder="Phone"
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Address"
                className="w-full border p-2 rounded"
                required
              />

              {/* Joining Date */}
              <input
                type="date"
                value={formData.joining_date}
                onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />

              {/* Shift */}
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Shift</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </select>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">
                  {editData ? "Update" : "Save"}
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
            <p className="mb-4">Are you sure you want to delete this reception?</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border rounded-xl" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}






