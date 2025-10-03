import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMedicines,
  insertMedicine,
  updateMedicine,
  deleteMedicine,
} from "../../redux/Slices/MedicineSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Shield, ChevronDown, ChevronUp, Plus, Pen, Trash2, X } from "lucide-react";

const Medicine = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.medicines);

  const [search, setSearch] = useState("");
  const [editMedicine, setEditMedicine] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });
  const [expandedId, setExpandedId] = useState(null);
  const [modalType, setModalType] = useState(null); // "add" or "edit"

  const initialFormData = {
    brand_name: "",
    generic_name: "",
    form: "",
    strength: "",
    hsn_code: "",
    total_quantity: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    dispatch(fetchMedicines())
      .unwrap()
      .catch(() => toast.error("Failed to fetch medicines"));
  }, [dispatch]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (editMedicine) {
      setEditMedicine({ ...editMedicine, [e.target.name]: value });
    } else {
      setFormData({ ...formData, [e.target.name]: value });
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).some((val) => !val.trim())) {
      return toast.error("Please fill all required fields");
    }
    dispatch(insertMedicine(formData))
      .unwrap()
      .then(() => {
        toast.success("Medicine added successfully!");
        setFormData(initialFormData);
        setModalType(null);
        dispatch(fetchMedicines());
      })
      .catch(() => toast.error("Failed to add medicine!"));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (Object.values(editMedicine).some((val) => !val.trim())) {
      return toast.error("Please fill all required fields");
    }
    dispatch(updateMedicine({ id: editMedicine.id, data: editMedicine }))
      .unwrap()
      .then(() => {
        toast.success("Medicine updated successfully!");
        setEditMedicine(null);
        setModalType(null);
        dispatch(fetchMedicines());
      })
      .catch(() => toast.error("Failed to update medicine!"));
  };

  const handleDeleteClick = (id, name) => {
    setDeleteModal({ open: true, id, name });
  };
  const confirmDelete = () => {
    dispatch(deleteMedicine(deleteModal.id))
      .unwrap()
      .then(() => toast.success("Medicine deleted successfully!"))
      .catch(() => toast.error("Failed to delete medicine!"));
    setDeleteModal({ open: false, id: null, name: "" });
  };
  const cancelDelete = () => setDeleteModal({ open: false, id: null, name: "" });

  const filteredMedicines = data.filter((med) =>
    med.brand_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Header */}
      <div className="bg-blue-500 rounded-xl px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-2">
              <Shield size={28} color="white" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Medicines</h2>
          </div>
          <p className="text-white text-sm mb-2">Manage all medicines data</p>
          <input
            type="text"
            placeholder="Search by Brand Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-lg border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white text-black"
          />
        </div>
        <button
          onClick={() => { setModalType("add"); setEditMedicine(null); }}
          className="bg-white text-blue-500 font-semibold px-4 py-2 rounded hover:bg-gray-100 flex items-center gap-2 -mt-2"
        >
          <Plus className="w-4 h-4" /> Add Medicine
        </button>
      </div>

      {/* Total Medicines */}
      <div className="text-gray-700 font-semibold">Total Medicines: {filteredMedicines.length}</div>

      {/* Desktop Table */}
      {!loading && filteredMedicines.length > 0 && (
        <div className="hidden md:block overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                {["S.No","Total Qty","Brand Name","Generic Name","Form","Strength","HSN Code","Actions"].map((col) => (
                  <th key={col} className={`px-4 py-2 ${col==="Actions" ? "text-right" : "text-left"} font-medium text-black`}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((med, idx) => (
                <tr key={med.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{idx + 1}</td>
                  <td className="px-4 py-2">{med.total_quantity}</td>
                  <td className="px-4 py-2">{med.brand_name}</td>
                  <td className="px-4 py-2">{med.generic_name}</td>
                  <td className="px-4 py-2">{med.form}</td>
                  <td className="px-4 py-2">{med.strength}</td>
                  <td className="px-4 py-2">{med.hsn_code}</td>
                  <td className="px-4 py-2 flex justify-end gap-2">
                    <button
                      onClick={() => { setEditMedicine(med); setModalType("edit"); }}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                    >
                      <Pen className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(med.id, med.brand_name)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredMedicines.map((med, idx) => (
          <div key={med.id} className="border rounded-lg p-4 shadow bg-white flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-blue-600">{idx + 1}. {med.brand_name} - {med.form} ({med.strength})</h3>
              <button
                onClick={() => setExpandedId(expandedId === med.id ? null : med.id)}
                className="p-1"
              >
                {expandedId === med.id ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            <p className="text-gray-700 font-medium">Total Qty: {med.total_quantity}</p>

            {expandedId === med.id && (
              <div className="mt-2 text-sm space-y-1">
                <p>Generic Name: {med.generic_name}</p>
                <p>HSN Code: {med.hsn_code}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => { setEditMedicine(med); setModalType("edit"); }}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
              >
                <Pen className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => handleDeleteClick(med.id, med.brand_name)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(modalType === "add" || modalType === "edit") && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              onClick={() => { setModalType(null); setEditMedicine(null); }}
              className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200"
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4">{modalType === "add" ? "Add Medicine" : "Edit Medicine"}</h2>
            <form onSubmit={modalType === "add" ? handleAddSubmit : handleUpdate} className="flex flex-col gap-3">
              {["brand_name", "generic_name", "form", "strength", "hsn_code", "total_quantity"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.replace("_", " ").toUpperCase()}
                  value={(modalType === "add" ? formData : editMedicine)[field] ?? ""}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              ))}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {modalType === "add" ? "Add" : "Update"}
                </button>
                <button
                  type="button"
                  onClick={() => { setModalType(null); setEditMedicine(null); }}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <p className="mb-4 text-lg">Are you sure you want to delete <strong>{deleteModal.name}</strong>?</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button onClick={cancelDelete} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicine;
