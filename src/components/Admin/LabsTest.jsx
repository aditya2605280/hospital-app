import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLabsTests,
  insertLabsTests,
  updateLabsTests,
  deleteLabsTests,
} from "../../redux/Slices/LabTestSlice";
import {
  Search,
  Shield,
  Trash2,
  Edit,
  PlusCircle,
  MoreVertical,
  ChevronUp,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LabsTests() {
  const dispatch = useDispatch();
  const { labsTestsData = [],  } = useSelector(
    (state) => state.labsTests || {}
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    test_code: "",
    description: "",
    category_id: "",
    sample_type_id: "",
    unit_id: "",
    price: "",
    clinic_id: "",
    sub_category_id: "",
    normal_range_male: "",
    normal_range_female: "",
    method: "",
  });

  // 🔄 Fetch initial data
  useEffect(() => {
    dispatch(fetchLabsTests());
  }, [dispatch]);

  // Extract unique nested arrays for dropdowns
  const categories = [...new Map(labsTestsData.map(item => [item.category?.id, item.category])).values()].filter(Boolean);
  const sampleTypes = [...new Map(labsTestsData.map(item => [item.sample_type?.id, item.sample_type])).values()].filter(Boolean);
  const units = [...new Map(labsTestsData.map(item => [item.unit?.id, item.unit])).values()].filter(Boolean);
  const clinics = [...new Map(labsTestsData.map(item => [item.clinic?.id, item.clinic])).values()].filter(Boolean);

  // 🔍 Filter search
  const filteredLabsTests = labsTestsData.filter((item) =>
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // 🗑 Delete
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteLabsTests(id)).unwrap();
      toast.success("Lab Test deleted successfully! 🎉");
      dispatch(fetchLabsTests());
    } catch {
      toast.error("Delete failed! 🚫");
    }
    setDeleteId(null);
  };

  // 💾 Submit Add/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      category_id: Number(formData.category_id),
      sample_type_id: Number(formData.sample_type_id),
      unit_id: Number(formData.unit_id),
      clinic_id: Number(formData.clinic_id),
      sub_category_id: formData.sub_category_id ? Number(formData.sub_category_id) : null,
    };

    try {
      if (!editData) {
        await dispatch(insertLabsTests(payload)).unwrap();
        toast.success("Lab Test added successfully! 🎉");
      } else {
        await dispatch(updateLabsTests({ id: editData.id, payload })).unwrap();
        toast.success("Lab Test updated successfully! 🎉");
      }
      resetForm();
      dispatch(fetchLabsTests());
      setShowForm(false);
    } catch {
      toast.error(editData ? "Update failed! 🚫" : "Add failed! 🚫");
    }
  };

  // ♻️ Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      test_code: "",
      description: "",
      category_id: "",
      sample_type_id: "",
      unit_id: "",
      price: "",
      clinic_id: "",
      sub_category_id: "",
      normal_range_male: "",
      normal_range_female: "",
      method: "",
    });
    setEditData(null);
  };

  // 📝 Auto-fill when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        test_code: editData.test_code || "",
        description: editData.description || "",
        category_id: editData.category?.id || "",
        sample_type_id: editData.sample_type?.id || "",
        unit_id: editData.unit?.id || "",
        price: editData.price || "",
        clinic_id: editData.clinic?.id || "",
        sub_category_id: editData.sub_category_id || "",
        normal_range_male: editData.normal_range_male || "",
        normal_range_female: editData.normal_range_female || "",
        method: editData.method || "",
      });
    }
  }, [editData]);

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
              <h2 className="text-xl md:text-2xl font-bold">
                Lab Test Management
              </h2>
              <p className="text-sm opacity-80">Manage system lab tests</p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            <PlusCircle size={18} /> New Lab Test
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Total count */}
      <div className="mb-2 font-semibold text-gray-700">
        Total Lab Tests: {labsTestsData.length}
      </div>

      {/* Table View */}
      <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white text-left rounded text-sm md:text-base">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Test Code</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Sample Type</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Clinic</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLabsTests.length > 0 ? (
              filteredLabsTests.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 text-sm md:text-base">
                  <td className="p-3">{emp.id}</td>
                  <td className="p-3">{emp.name}</td>
                  <td className="p-3">{emp.description}</td>
                  <td className="p-3">{emp.test_code}</td>
                  <td className="p-3">{emp.category?.name}</td>
                  <td className="p-3">{emp.price}</td>
                  <td className="p-3">{emp.sample_type?.name}</td>
                  <td className="p-3">{emp.unit?.name}</td>
                  <td className="p-3">{emp.clinic?.name}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditData(emp);
                        setShowForm(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
                    >
                      <Edit size={14} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(emp.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center p-4">
                  No lab tests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredLabsTests.length > 0 ? (
          filteredLabsTests.map((emp) => (
            <div key={emp.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{emp.name}</p>
                  <p className="text-gray-600 text-sm">{emp.description}</p>
                </div>
                 <button
                  onClick={() => setExpandedId(expandedId === emp.id ? null : emp.id)}
                  className={`transform transition-transform duration-300 ${
                  expandedId === emp.id ? "rotate-180" : "rotate-0"
                  }`}
                  >
                  <ChevronUp size={20} />
                </button>
              </div>
              {expandedId === emp.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">ID:</span> {emp.id}
                  </p>
                  <p>
                    <span className="font-semibold">Test Code:</span> {emp.test_code}
                  </p>
                  <p>
                    <span className="font-semibold">Category:</span> {emp.category?.name}
                  </p>
                  <p>
                    <span className="font-semibold">Price:</span> {emp.price}
                  </p>
                  <p>
                    <span className="font-semibold">Sample Type:</span> {emp.sample_type?.name}
                  </p>
                  <p>
                    <span className="font-semibold">Unit:</span> {emp.unit?.name}
                  </p>
                  <p>
                    <span className="font-semibold">Clinic:</span> {emp.clinic?.name}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditData(emp);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(emp.id)}
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
          <p className="text-gray-500">No lab tests found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editData ? "Edit Lab Test" : "Add Lab Test"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                value={formData.test_code}
                onChange={(e) => setFormData({ ...formData, test_code: e.target.value })}
                placeholder="Test Code"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
                className="w-full border p-2 rounded"
                required
              />

              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={formData.sample_type_id}
                onChange={(e) => setFormData({ ...formData, sample_type_id: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Sample Type</option>
                {sampleTypes.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <select
                value={formData.unit_id}
                onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Unit</option>
                {units.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>

              <select
                value={formData.clinic_id}
                onChange={(e) => setFormData({ ...formData, clinic_id: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Clinic</option>
                {clinics.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Price"
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                value={formData.sub_category_id}
                onChange={(e) => setFormData({ ...formData, sub_category_id: e.target.value })}
                placeholder="Sub Category ID (optional)"
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                value={formData.normal_range_male}
                onChange={(e) => setFormData({ ...formData, normal_range_male: e.target.value })}
                placeholder="Normal Range Male"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                value={formData.normal_range_female}
                onChange={(e) => setFormData({ ...formData, normal_range_female: e.target.value })}
                placeholder="Normal Range Female"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                placeholder="Method"
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

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this lab test?</p>
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
