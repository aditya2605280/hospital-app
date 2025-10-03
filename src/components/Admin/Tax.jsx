import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTaxes,
  insertTax,
  updateTax,
  deleteTax,
} from "../../redux/Slices/TaxSlice";
import { fetchTaxGroups } from "../../redux/Slices/TaxGroupSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Shield, Edit, Trash2, Search } from "lucide-react";

const Tax = () => {
  const dispatch = useDispatch();
  const { data: taxes } = useSelector((state) => state.taxes);
  const { data: groups } = useSelector((state) => state.taxGroups);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTax, setEditTax] = useState(null);
  const [formData, setFormData] = useState({ name: "", group_id: "", percentage: "" });
  const [search, setSearch] = useState("");
  const [deleteTaxData, setDeleteTaxData] = useState(null);

  useEffect(() => {
    dispatch(fetchTaxes()).unwrap().catch(() => toast.error("Failed to fetch taxes!"));
    dispatch(fetchTaxGroups()).unwrap().catch(() => toast.error("Failed to fetch tax groups!"));
  }, [dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (taxes.find((t) => t.name.toLowerCase() === formData.name.toLowerCase())) {
      toast.error("Tax name already exists.");
      return;
    }
    dispatch(insertTax(formData))
      .unwrap()
      .then(() => {
        toast.success("Tax added successfully!");
        setFormData({ name: "", group_id: "", percentage: "" });
        setShowAddModal(false);
      })
      .catch(() => toast.error("Failed to add tax!"));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (taxes.find((t) => t.name.toLowerCase() === editTax.name.toLowerCase() && t.id !== editTax.id)) {
      toast.error("Tax name already exists.");
      return;
    }
    dispatch(updateTax({ id: editTax.id, data: editTax }))
      .unwrap()
      .then(() => {
        toast.success("Tax updated successfully!");
        setShowEditModal(false);
        setEditTax(null);
      })
      .catch(() => toast.error("Failed to update tax!"));
  };

  const confirmDelete = () => {
    if (!deleteTaxData) return;

    dispatch(deleteTax(deleteTaxData.id))
      .unwrap()
      .then(() => toast.success("Tax deleted successfully!"))
      .catch((err) => {
        console.error("Delete failed:", err.response ? err.response.data : err);
        toast.error("Failed to delete tax! Check console for details.");
      })
      .finally(() => setDeleteTaxData(null));
  };

  const filteredData = taxes.filter((tax) =>
    tax.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Header */}
      <div className="bg-blue-500 rounded px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col w-full md:max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-2">
              <Shield size={28} color="white" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Taxes</h2>
          </div>
          <p className="text-white text-sm mb-3">Manage all tax entries</p>
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white text-black"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white text-blue-500 font-semibold px-6  rounded hover:bg-gray-100 flex items-center gap-2"
        >
          <Edit size={18} /> Add Tax
        </button>
      </div>

      {/* Total count */}
      <div className="text-gray-700 font-semibold mt-2">Total Records: {filteredData.length}</div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">S.No</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Group</th>
              <th className="px-4 py-2 text-left">Percentage (%)</th>
              <th className="px-20 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((tax, index) => (
              <tr key={tax.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{tax.name}</td>
                <td className="px-4 py-2">{groups.find((g) => g.id === Number(tax.group_id))?.name || "—"}</td>
                <td className="px-4 py-2">{tax.percentage}</td>
                <td className="px-4 py-2 flex justify-end gap-2">
                  <button
                    onClick={() => { setEditTax(tax); setShowEditModal(true); }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteTaxData(tax)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredData.map((tax, index) => (
          <div key={tax.id} className="border rounded-lg p-4 shadow bg-white flex flex-col justify-between">
            <h3 className="text-lg font-semibold text-blue-600">
              {index + 1}. {tax.name} ({groups.find((g) => g.id === Number(tax.group_id))?.name || "—"})
            </h3>
            <p className="mt-2 text-sm">Percentage: {tax.percentage}%</p>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => { setEditTax(tax); setShowEditModal(true); }}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
              >
                <Edit size={16} /> Edit
              </button>
              <button
                onClick={() => setDeleteTaxData(tax)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit/Delete Modals remain unchanged */}
    </div>
  );
};

export default Tax;
