
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointments,
  fetchDoctors,
  fetchPatients,
  insertAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
} from "../../redux/Slices/AppointmentSlice";
 // <-- adjust path if needed
import { Search, Shield, Trash2, PlusCircle, MoreVertical, ChevronUp } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Appointments() {
  const dispatch = useDispatch();
  const { appointments, doctors, patients, loading } = useSelector(
    (state) => state.appointment
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    doctor_id: "",
    patient_id: "",
    date: "",
    time: [],
    appointment_type: "",
    duration: "",
    notes: "",
    price: "",
  });

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchDoctors());
    dispatch(fetchPatients());
  }, [dispatch]);

  const filteredAppointments = (appointments || []).filter((app) => {
    const patientName = patients[app.patient_id]?.name || "";
    const doctorName = doctors[app.doctor_id]?.name||"";
    const typeName =app.appointment_type||"";
    const priceName =app. price||"";
    const dateName =app.date||"";

    const combined =`${patientName} ${doctorName} ${typeName} ${priceName} ${dateName}`
    return combined .toLowerCase().includes(search.toLowerCase());
  });

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAppointment(id)).unwrap();
      toast.success("Appointment deleted successfully! 🎉");
      dispatch(fetchAppointments());
    } catch (err) {
      console.error(err);
      toast.error("Delete failed! 🚫");
    }
    setDeleteId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ensure time is an array of non-empty strings
    const timeSlots = (formData.time || [])
      .map((t) => String(t).trim())
      .filter((t) => t.length > 0);

    if (!formData.patient_id || timeSlots.length === 0 || !formData.date) {
      toast.error("Please fill required fields and at least one time slot! 🚫");
      return;
    }

    const payload = {
      ...formData,
      doctor_id: formData.doctor_id ? Number(formData.doctor_id) : null,
      patient_id: Number(formData.patient_id),
      time: timeSlots,
    };

    try {
      await dispatch(insertAppointment(payload)).unwrap();
      toast.success("Appointment added successfully! 🎉");
      resetForm();
      dispatch(fetchAppointments());
    } catch (err) {
      console.error(err);
      toast.error("Add failed! 🚫");
    }
  };

  const resetForm = () => {
    setFormData({
      doctor_id: "",
      patient_id: "",
      date: "",
      time: [],
      appointment_type: "",
      duration: "",
      notes: "",
      price: "",
    });
    setShowForm(false);
  };

  // Helper to safely show time array as string
  const timeToString = (time) => {
    if (Array.isArray(time)) return time.join(", ");
    if (!time) return "";
    return String(time);
  };

  // Status options — replace with live fetch if your API provides status list
  const STATUS_OPTIONS = [
    { value: "", label: "--Status--" },
    { value: "1", label: "Booked" },
    { value: "2", label: "Test Prescribed" },
    { value: "3", label: "Completed" },
    { value: "4", label: "Busy" },
    { value: "5", label: "Confirmed" },
    { value: "6", label: "Cancelled" },
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
              <h2 className="text-xl md:text-2xl font-bold">Appointments</h2>
              <p className="text-sm opacity-80">Manage clinic appointments</p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            <PlusCircle size={18} /> New Appointment
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        </div>
      </div>
       <div className="mb-2 font-semibold text-gray-700">
        {/* Total Appointment: {app.length} */}
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm md:text-base">
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Type</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Price</th>
              <th className="p-3">Notes</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((app) => (
                <tr
                  key={app.id}
                  className="border-b hover:bg-gray-50 text-sm md:text-base"
                >
                  <td className="p-3">{app.date}</td>
                  <td className="p-3">{timeToString(app.time)}</td>
                  <td className="p-3">{patients[app.patient_id]?.name}</td>
                  <td className="p-3">{doctors[app.doctor_id]?.name || "Not assigned"}</td>
                  <td className="p-3">{app.appointment_type}</td>
                  <td className="p-3">{app.duration}</td>
                  <td className="p-3">{app.price}</td>
                  <td className="p-3">{app.notes}</td>
                  <td className="p-3 flex justify-center gap-2 items-center">
                    <select
                      value={String(app.status ?? "")}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          await dispatch(updateAppointmentStatus({ id: app.id, status: newStatus })).unwrap();
                          toast.success("Status updated! 🎉");
                          dispatch(fetchAppointments());
                        } catch (err) {
                          console.error(err);
                          toast.error("Failed to update status! 🚫");
                        }
                      }}
                      className="border p-1 rounded"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setDeleteId(app.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center p-4">No appointments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((app) => (
            <div key={app.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{patients[app.patient_id]?.name}</p>
                  <p className="text-gray-600 text-sm">{doctors[app.doctor_id]?.name || "Not assigned"}</p>
                </div>
                  <button
                  onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                  className={`transform transition-transform duration-300 ${
                  expandedId === app.id ? "rotate-180" : "rotate-0"
                  }`}
                  >
                  <ChevronUp size={20} />
                </button>
              </div>

              {expandedId === app.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p><span className="font-semibold">Date:</span> {app.date}</p>
                  <p><span className="font-semibold">Time:</span> {timeToString(app.time)}</p>
                  <p><span className="font-semibold">Type:</span> {app.appointment_type}</p>
                  <p><span className="font-semibold">Duration:</span> {app.duration}</p>
                  <p><span className="font-semibold">Price:</span> {app.price}</p>
                  <p><span className="font-semibold">Notes:</span> {app.notes}</p>

                  <div className="flex gap-2 mt-2 items-center">
                    <select
                      value={String(app.status ?? "")}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          await dispatch(updateAppointmentStatus({ id: app.id, status: newStatus })).unwrap();
                          toast.success("Status updated! 🎉");
                          dispatch(fetchAppointments());
                        } catch (err) {
                          console.error(err);
                          toast.error("Failed to update status! 🚫");
                        }
                      }}
                      className="border p-1 rounded"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <button onClick={() => setDeleteId(app.id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No appointments found.</p>
        )}
      </div>

      {/* Add Appointment Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Add Appointment</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                value={formData.patient_id}
                onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Patient</option>
                {Object.values(patients).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <select
                value={formData.doctor_id}
                onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Doctor</option>
                {Object.values(doctors).map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="border p-2 rounded w-full" required />

              <input type="text" value={formData.time.join(", ")} onChange={(e) => setFormData({ ...formData, time: e.target.value.split(",") })} placeholder="Time slots (comma separated)" className="border p-2 rounded w-full" required />

              <input type="text" value={formData.appointment_type} onChange={(e) => setFormData({ ...formData, appointment_type: e.target.value })} placeholder="Appointment Type" className="border p-2 rounded w-full" />
              <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="Duration" className="border p-2 rounded w-full" />
              <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Price" className="border p-2 rounded w-full" />
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Notes" className="border p-2 rounded w-full" />

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700">Save</button>
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
            <p className="mb-4">Are you sure you want to delete this appointment?</p>
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
