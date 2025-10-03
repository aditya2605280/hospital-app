// src/components/MedicalDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllItems, addItem, updateItem, deleteItem } from "../../redux/Slices/MedicalSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pen, Trash2, Plus, Search, Shield, ChevronDown, ChevronUp } from "lucide-react";

const Medical = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.medical);

  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    email: "",
    phone: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllItems());
  }, [dispatch]);

  useEffect(() => {
    if (showAddModal && inputRef.current) inputRef.current.focus();
  }, [showAddModal]);

  const handleAddOrUpdate = async () => {
    try {
      if (!editId) {
        const emailExists = (items || []).some(
          (item) => item.email.toLowerCase() === formData.email.toLowerCase()
        );
        const phoneExists = (items || []).some(
          (item) => item.phone === formData.phone
        );

        if (emailExists) {
          toast.error("Email already exists! Please use another email.");
          return;
        }

        if (phoneExists) {
          toast.error("Phone number already exists! Please use another number.");
          return;
        }
      }

      if (editId) {
        await dispatch(updateItem({ id: editId, ...formData })).unwrap();
        toast.success("Medical Updated Successfully");
      } else {
        await dispatch(addItem({ ...formData })).unwrap();
        toast.success("Medical Added Successfully");
      }

      setEditId(null);
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        email: "",
        phone: "",
      });
      setShowAddModal(false);
    } catch {
      toast.error(editId ? "Failed to Update Medical" : "Failed to Add Medical");
    }
  };

  const handleEditClick = (item) => {
    setEditId(item.id);
    setFormData({
      name: item.name,
      address: item.address,
      city: item.city,
      state: item.state,
      email: item.email,
      phone: item.phone,
    });
    setShowAddModal(true);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-blue-500 rounded-xl px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col w-full md:max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-2">
              <Shield size={28} color="white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Medicals Dashboard
            </h2>
          </div>
          <p className="text-white text-sm mb-3">Manage medical roles and permissions</p>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-md border border-gray-300 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white text-black"
            />
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white text-blue-500 font-semibold px-4 sm:px-6 py-2 rounded hover:bg-gray-100 w-full sm:w-auto flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" /> Add Form
        </button>
      </div>

      {/* Total Count */}
      <div className="text-left text-gray-700 font-medium">
        Total Medicals: {filteredItems.length}
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto bg-white rounded shadow hidden md:block">
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              {["S.No","Name","Address","City","State","Email","Phone","Actions"].map((col) => (
                <th
                  key={col}
                  className={`px-2 sm:px-4 py-2 ${col === "Actions" ? "text-right" : "text-left"} font-medium text-black uppercase`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-2 text-center text-blue-500">
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={8} className="px-4 py-2 text-center text-red-500">{error}</td>
              </tr>
            )}
            {!loading && filteredItems.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-2 text-center text-gray-500">No medicals found.</td>
              </tr>
            )}
            {filteredItems.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-2 sm:px-4 py-2">{index + 1}</td>
                <td className="px-2 sm:px-4 py-2">{item.name}</td>
                <td className="px-2 sm:px-4 py-2">{item.address}</td>
                <td className="px-2 sm:px-4 py-2">{item.city}</td>
                <td className="px-2 sm:px-4 py-2">{item.state}</td>
                <td className="px-2 sm:px-4 py-2">{item.email}</td>
                <td className="px-2 sm:px-4 py-2">{item.phone}</td>
                <td className="px-2 sm:px-4 py-2 flex justify-end gap-2">
                  <button onClick={() => handleEditClick(item)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1">
                    <Pen className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => setConfirmDelete(item)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {filteredItems.map((item, index) => (
          <div key={item.id} className="border rounded-lg p-4 shadow bg-white">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-semibold text-blue-600">{item.name}</h3>
                <p><strong>City:</strong> {item.city}</p>
                <p><strong>Phone:</strong> {item.phone}</p>
              </div>
              <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="p-1">
                {expandedId === item.id ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            {expandedId === item.id && (
              <div className="mt-2 space-y-1 text-sm">
                <p><strong>S.No:</strong> {index + 1}</p>
                <p><strong>Address:</strong> {item.address}</p>
                <p><strong>State:</strong> {item.state}</p>
                <p><strong>Email:</strong> {item.email}</p>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => handleEditClick(item)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1">
                <Pen className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => setConfirmDelete(item)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {editId ? <Pen className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editId ? "Edit Medical" : "Add New Medical"}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {["name","address","city","state","email","phone"].map((field) => (
                <input
                  key={field}
                  ref={field==="name"?inputRef:null}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={(e)=>setFormData({...formData,[field]:e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditId(null);
                  setFormData({ name:"", address:"", city:"", state:"", email:"", phone:"" });
                }}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdate}
                className={`px-3 py-1 text-white rounded flex items-center gap-1 ${editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"}`}
              >
                {editId ? <Pen className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete this medical:{" "}
              <span className="font-bold">{confirmDelete.name}</span>?
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await dispatch(deleteItem(confirmDelete.id)).unwrap();
                    toast.success(`Medical "${confirmDelete.name}" Deleted Successfully`);
                  } catch {
                    toast.error("Failed to Delete Medical");
                  }
                  setConfirmDelete(null);
                }}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medical;
