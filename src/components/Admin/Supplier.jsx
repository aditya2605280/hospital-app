import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchdata,
  insertData,
  updateData,
  deleteData,
} from "../../redux/Slices/SupplierSlice";
import { Search, Shield, Trash2, Edit, PlusCircle, MoreVertical, ChevronUp } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SupplierUI() {
  const dispatch = useDispatch();
  const { data: suppliers,  } = useSelector((state) => state.Supplier);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    dispatch(fetchdata());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await dispatch(updateData({ id: editData.id, formData })).unwrap();
        toast.success("Supplier updated successfully!");
      } else {
        await dispatch(insertData(formData)).unwrap();
        toast.success("Supplier added successfully!");
      }
      resetForm();
      dispatch(fetchdata());
      setShowForm(false);
    } catch {
      toast.error(editData ? "Update failed!" : "Add failed!");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", address: "", city: "" });
    setEditData(null);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteData(id)).unwrap();
      toast.success("Supplier deleted successfully!");
      dispatch(fetchdata());
    } catch {
      toast.error("Delete failed!");
    }
    setDeleteId(null);
  };

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:px-6 bg-gray-100 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

     

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 text-white p-4 rounded-xl shadow flex justify-between flex-col gap-4 mb-6">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-3">
              <Shield size={32} color="white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-bold">
                Supplier Management
              </h2>
              <p className="text-sm opacity-80">Manage system suppliers</p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            <PlusCircle size={18} /> New Supplier
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Total count */}
      <div className="mb-2 font-semibold text-gray-700">
        Total Suppliers: {filteredSuppliers.length}
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white text-left rounded text-sm md:text-base">
              <th className="p-3">S No.</th>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Address</th>
              <th className="p-3">City</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50 text-sm md:text-base">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.description}</td>
                  <td className="p-3">{s.address}</td>
                  <td className="p-3">{s.city}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditData(s);
                        setFormData({
                          name: s.name,
                          description: s.description,
                          address: s.address,
                          city: s.city,
                        });
                        setShowForm(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
                    >
                      <Edit size={14} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(s.id)}
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
                  No suppliers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredSuppliers.length > 0 ? (
          filteredSuppliers.map((s, i) => (
            <div key={s.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-gray-600 text-sm">{s.city}</p>
                </div>
              <button
            onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
            className={`transform transition-transform duration-300 ${
              expandedId === s.id ? "rotate-180" : "rotate-0"
            }`}
          >
            <ChevronUp size={20} />
          </button>
              </div>
              {expandedId === s.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Description: </span>
                    {s.description}
                  </p>
                  <p>
                    <span className="font-semibold">Address: </span>
                    {s.address}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditData(s);
                        setFormData({
                          name: s.name,
                          description: s.description,
                          address: s.address,
                          city: s.city,
                        });
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(s.id)}
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
          <p className="text-gray-500">No suppliers found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editData ? "Edit Supplier" : "Add Supplier"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
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
                  className="px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
                >
                  {editData ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this supplier?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
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


