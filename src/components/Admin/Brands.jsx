import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, createUser, updateUser, deleteUser } from "../../redux/Slices/brandsSlice";
import { Shield, Trash2, Search, Settings } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Brands = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.brand ?? { data: [], loading: false });

  const [newUser, setNewUser] = useState({ name: "" });
  const [editingUserId, setEditingUserId] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  // Add brand
  const handleAdd = async (e) => {
    e.preventDefault();
    const isDuplicate = data.some((user) => user.name.toLowerCase() === newUser.name.toLowerCase());
    if (isDuplicate) return toast.error("Brand already exists");

    try {
      await dispatch(createUser(newUser)).unwrap();
      dispatch(fetchData());
      setNewUser({ name: "" });
      setShowAddForm(false);
      toast.success("Brand added successfully");
    } catch {
      toast.error("Failed to add brand");
    }
  };

  // Edit brand
  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setForm({ name: user.name });
  };

  // Update brand
  const handleUpdate = async () => {
    setUpdateError("");
    const isDuplicate = data.some(
      (user) => user.name.toLowerCase() === form.name.toLowerCase() && user.id !== editingUserId
    );
    if (isDuplicate) {
      setUpdateError("Brand already exists");
      return;
    }

    try {
      await dispatch(updateUser({ id: editingUserId, updatedUser: form })).unwrap();
      await dispatch(fetchData()).unwrap();
      toast.success("Brand updated successfully");
      setEditingUserId(null);
    } catch {
      toast.error("Failed to update brand");
    }
  };

  // Delete
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setShowDeleteConfirm(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await dispatch(deleteUser(deleteId)).unwrap();
        await dispatch(fetchData()).unwrap();
        toast.success("Brand deleted successfully");
      } catch {
        toast.error("Failed to delete brand");
      }
    }
    cancelDelete();
  };

  const filteredData =
    data && Array.isArray(data)
      ? data.filter(
          (user) =>
            user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(user?.id).includes(searchTerm)
        ).reverse()
      : [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#5492F5]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold cursor-pointer" onClick={() => dispatch(fetchData())}>
              All Brands
            </h1>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
          >
            + New Brand
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg px-3 w-full py-2 flex items-center shadow-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-2 w-full text-gray-700 focus:outline-none"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-sm text-gray-500 ml-2">
              Clear
            </button>
          )}
        </div>
      </div>

      <h1 className="text-xl font-semibold text-gray-600 m-2">
        Total Brands : ({data?.length || 0})
      </h1>

      {/* Brand list */}
      <div className="space-y-4 mb-6">
        {filteredData.length === 0 && !loading ? (
          <p className="text-gray-500">No brands found.</p>
        ) : (
          filteredData.map((user) => (
            <div key={user.id} className="bg-white p-4 shadow rounded-lg flex justify-between items-center">
              <p className="font-semibold text-lg">{user.name}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-[#2D6EEE] text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-blue-700"
                >
                  <Settings className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => confirmDelete(user.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded flex items-center gap-2 hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>

              {/* Edit modal */}
              {editingUserId === user.id && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-lg font-bold mb-4">Update Brand</h2>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="border w-full p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {updateError && <p className="text-red-400 mb-2 font-semibold">{updateError}</p>}
                    <div className="flex justify-end gap-2">
                      <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Save
                      </button>
                      <button
                        onClick={() => { setEditingUserId(null); setUpdateError(""); }}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <form onSubmit={handleAdd} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow mb-6">
            <input
              type="text"
              placeholder="Enter brand name..."
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this brand?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;
