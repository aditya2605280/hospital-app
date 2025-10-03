import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPrescriptions,
  fetchMedicines,
  fetchLabsTests,
  fetchAppointments,
  insertPrescriptions,
  updatePrescriptions,
  deletePresriptions,
  fetchlabBooking
} from "../../redux/Slices/PrescriptionsSlice";

import {
  Search,
  Trash2,
  Edit,
  PlusCircle,
  MoreVertical,
  Shield,
  ChevronUp,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Prescription() {
  const dispatch = useDispatch();
  const { prescriptions, medicines, LabsTests, appointments, loading } =
    useSelector((state) => state.prescriptions);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    appointment_id: "",
    symptoms: "",
    blood_pressure: "",
    pulse: "",
    oxygen: "",
    weight: "",
    height: "",
    medicine_id: "",
    dosage: "",
    frequency: "",
    duration: "",
    total_quantity: "",
    labtest_id:""
  });

  useEffect(() => {
    dispatch(fetchPrescriptions());
    dispatch(fetchMedicines());
    dispatch(fetchLabsTests());
    dispatch(fetchAppointments());
    dispatch(fetchlabBooking());
  }, [dispatch]);

  const filteredPrescriptions = prescriptions.filter((p) =>
    (p.symptoms || "").toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      appointment_id: "",
      symptoms: "",
      blood_pressure: "",
      pulse: "",
      oxygen: "",
      weight: "",
      height: "",
      medicine_id: "",
      dosage: "",
      frequency: "",
      duration: "",
      total_quantity: "",
      labtest_id: "",
    });
    setEditData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      appointment_id: formData.appointment_id,
      symptoms: formData.symptoms,
      blood_pressure: formData.blood_pressure,
      pulse: formData.pulse,
      oxygen: formData.oxygen,
      weight: formData.weight,
      height: formData.height,
      medicines: [
        {
          medicine_id: formData.medicine_id,
          dosage: formData.dosage,
          frequency: formData.frequency,
          duration: formData.duration,
          total_quantity: formData.total_quantity,
        },
      ],
      lab_tests: [{ lab_test_id: formData.labtest_id }],
    };

    try {
      if (!editData) {
        await dispatch(insertPrescriptions(payload)).unwrap();
        toast.success("Prescription added successfully! 🎉");
      } else {
        await dispatch(
          updatePrescriptions({ id: editData.id, payload })
        ).unwrap();
        toast.success("Prescription updated successfully! 🎉");
      }
      resetForm();
      dispatch(fetchPrescriptions());
      setShowForm(false);
    } catch {
      toast.error(editData ? "Update failed! 🚫" : "Add failed! 🚫");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deletePresriptions(id)).unwrap();
      toast.success("Prescription deleted successfully! 🎉");
      dispatch(fetchPrescriptions());
    } catch {
      toast.error("Delete failed! 🚫");
    }
    setDeleteId(null);
  };

  // Auto-fill when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        appointment_id: editData.appointment_id || "",
        symptoms: editData.symptoms || "",
        blood_pressure: editData.blood_pressure || "",
        pulse: editData.pulse || "",
        oxygen: editData.oxygen || "",
        weight: editData.weight || "",
        height: editData.height || "",
        medicine_id: editData.medicines?.[0]?.medicine_id || "",
        dosage: editData.medicines?.[0]?.dosage || "",
        frequency: editData.medicines?.[0]?.frequency || "",
        duration: editData.medicines?.[0]?.duration || "",
        total_quantity: editData.medicines?.[0]?.total_quantity || "",
        labtest_id: editData.lab_tests?.[0]?.lab_test_id || "",
      });
    }
  }, [editData]);

  return (
    <div className="p-4 md:px-2 bg-gray-100 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <p className="text-white text-xl bg-gray-700 px-6 py-4 rounded">
            Loading...
          </p>
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
              <h2 className="text-xl md:text-2xl font-bold">
                Prescription Management
              </h2>
              <p className="text-sm opacity-80">
                Manage patient prescriptions and treatments
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            <PlusCircle size={18} /> New Prescription
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search prescriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Total count */}
      <div className="mb-2 font-semibold text-gray-700">
        Total Prescriptions: {prescriptions.length}
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white text-left rounded text-sm md:text-base">
              <th className="p-3">Appointment</th>
              <th className="p-3">Symptoms</th>
              <th className="p-3">Vitals</th>
              <th className="p-3">Medicines</th>
              <th className="p-3">Lab Tests</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions.length > 0 ? (
              filteredPrescriptions.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 text-sm md:text-base"
                >
                  <td className="p-3">#{p.appointment_id}</td>
                  <td className="p-3">{p.symptoms}</td>
                  <td className="p-3">
                    BP: {p.blood_pressure}, Pulse: {p.pulse}, O₂: {p.oxygen}
                  </td>
                  <td className="p-3">
                   {medicines [p.medicine_id]?.brand_name||"N/A"}
                  </td>
                  <td className="p-3">
                      {LabsTests[p.labtest_id]?.name||"N/A"}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => setEditData(p)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
                    >
                      <Edit size={14} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
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
                  No prescriptions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredPrescriptions.length > 0 ? (
          filteredPrescriptions.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg shadow p-4 bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Appointment #{p.appointment_id}</p>
                  <p className="text-gray-600 text-sm">{p.symptoms}</p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                  className={`transform transition-transform duration-300 ${
                  expandedId === p.id ? "rotate-180" : "rotate-0"
                  }`}
                  >
                  <ChevronUp size={20} />
                </button>
              </div>

              {expandedId === p.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Vitals: </span>
                    BP {p.blood_pressure}, Pulse {p.pulse}, O₂ {p.oxygen}
                  </p>
                  <p>
                    <span className="font-semibold">Medicines: </span>
                   {medicines [p.medicine_id]?.brand_name||"N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Lab Tests: </span>
                    {LabsTests[p.labtest_id]?.name||"N/A"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setEditData(p)}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
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
          <p className="text-gray-500">No prescriptions found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editData ? "Edit Prescription" : "Add Prescription"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                value={formData.appointment_id}
                onChange={(e) =>
                  setFormData({ ...formData, appointment_id: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Appointment</option>
                {appointments.map((a) => (
                  <option key={a.id} value={a.id}>
                    Appointment #{a.id}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={formData.symptoms}
                onChange={(e) =>
                  setFormData({ ...formData, symptoms: e.target.value })
                }
                placeholder="Symptoms"
                className="w-full border p-2 rounded"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.blood_pressure}
                  onChange={(e) =>
                    setFormData({ ...formData, blood_pressure: e.target.value })
                  }
                  placeholder="Blood Pressure"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  value={formData.pulse}
                  onChange={(e) =>
                    setFormData({ ...formData, pulse: e.target.value })
                  }
                  placeholder="Pulse"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  value={formData.oxygen}
                  onChange={(e) =>
                    setFormData({ ...formData, oxygen: e.target.value })
                  }
                  placeholder="Oxygen"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  placeholder="Weight"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                  placeholder="Height"
                  className="w-full border p-2 rounded"
                />
              </div>

              <select
                value={formData.medicine_id}
                onChange={(e) =>
                  setFormData({ ...formData, medicine_id: e.target.value })
                }
                className="w-full border p-2 rounded"
              >
                <option value="">Select Medicine</option>
                {medicines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.brand_name}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) =>
                    setFormData({ ...formData, dosage: e.target.value })
                  }
                  placeholder="Dosage"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                  placeholder="Frequency"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="Duration"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  value={formData.total_quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_quantity: e.target.value,
                    })
                  }
                  placeholder="Total Quantity"
                  className="w-full border p-2 rounded"
                />
              </div>

                 <select
                value={formData.labtest_id}
                onChange={(e) =>
                  setFormData({ ...formData, labtest_id: e.target.value })
                }
                className="w-full border p-2 rounded"
              >
                <option value="">Select LabsTest</option>
                {LabsTests.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>

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

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete this prescription?
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


