import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDrAvailablities,
  insertDrAvailablities,
  updateDrAvailablities,
  deleteDrAvailablities,
} from "../../redux/Slices/DrAvailablitiesSlice";
import { fetchDoctors } from "../../redux/Slices/AppointmentSlice";
import {
  Trash2,
  Edit,
  PlusCircle,
  Search,
  Shield,
  MoreVertical,
  ChevronUp,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DrAvailablities = () => {
  const dispatch = useDispatch();
  const { DrAvailablities, loading } = useSelector((state) => state.DrAvailablities);
  const { doctors } = useSelector((state) => state.appointment);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    doctor_id: "",
    time: [{ start: "", end: "" }],
    slot_brack_time: "",
  });

  useEffect(() => {
    dispatch(fetchDrAvailablities());
    dispatch(fetchDoctors());
  }, [dispatch]);

const filteredAvailabilities = DrAvailablities.filter((item) => {
  const doctorName = doctors[item.doctor_id]?.name || "";
  const times = item.time?.map((t) => `${t.start} ${t.end}`).join(" ") || "";
  const slotBreak = item.slot_brack_time || "";

  // combine all searchable fields
  const combined = `${doctorName} ${times} ${slotBreak} `.toLowerCase();

  return combined.includes(search.toLowerCase());
});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (e, index, field) => {
  const newTimes = [...formData.time];
  newTimes[index] = { ...newTimes[index], [field]: e.target.value };
  setFormData((prev) => ({ ...prev, time: newTimes }));
};


  const addTimeField = () => {
    setFormData((prev) => ({ ...prev, time: [...prev.time, { start: "", end: "" }] }));
  };

  const removeTimeField = (index) => {
    const newTimes = formData.time.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, time: newTimes }));
  };

  const resetForm = () => {
    setFormData({ doctor_id: "", time: [{ start: "", end: "" }], slot_brack_time: "" });
    setEditData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await dispatch(updateDrAvailablities({ id: editData.id, payload: formData })).unwrap();
        toast.success("Availability updated successfully!");
      } else {
        await dispatch(insertDrAvailablities(formData)).unwrap();
        toast.success("Availability added successfully!");
      }
      resetForm();
      setShowForm(false);
      dispatch(fetchDrAvailablities());
    } catch {
      toast.error(editData ? "Update failed!" : "Add failed!");
    }
  };

  const handleEdit = (data) => {
    setEditData(data);
    setFormData({
      doctor_id: data.doctor_id,
      time: data.time.length ? data.time : [{ start: "", end: "" }],
      slot_brack_time: data.slot_brack_time,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteDrAvailablities(id)).unwrap();
      toast.success("Availability deleted successfully!");
      dispatch(fetchDrAvailablities());
    } catch {
      toast.error("Delete failed!");
    }
    setDeleteId(null);
  };

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
              <h2 className="text-xl md:text-2xl font-bold">Doctor Availabilities</h2>
              <p className="text-sm opacity-80">Manage doctor availability slots</p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            <PlusCircle size={18} /> New Availability
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Total count */}
      <div className="mb-2 font-semibold text-gray-700">
        Total Availabilities: {DrAvailablities.length}
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white text-left rounded text-sm md:text-base">
              <th className="p-3">ID</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Times</th>
              <th className="p-3">Slot Break</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
        

          <tbody>
  {filteredAvailabilities?.length > 0 ? (
    filteredAvailabilities.map((item, index) => (
      <tr key={item.id} className="hover:bg-gray-50 text-sm md:text-base">
        <td className="p-3">{index + 1}</td>
        <td className="p-3">{doctors[item.doctor_id]?.name || "Unknown Doctor"}</td>
        <td className="p-3">
          {item.time?.map((t) => `${t.start} - ${t.end}`).join(", ") || "No time slots"}
        </td>
        <td className="p-3">{item.slot_brack_time || "-"}</td>
        <td className="p-3 flex justify-center gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
          >
            <Edit size={14} /> Update
          </button>
          <button
            onClick={() => setDeleteId(item.id)}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
          >
            <Trash2 size={14} /> Delete
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="text-center p-4">
        No availabilities found
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>


      <div className="md:hidden flex flex-col gap-4">
  {filteredAvailabilities?.length > 0 ? (
    filteredAvailabilities.map((item, index) => (
      <div key={item.id} className="border rounded-lg shadow p-4 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold flex gap-2 p-2">
              <span>{index + 1}.</span>
              <span>{doctors[item.doctor_id]?.name || "Unknown Doctor"}</span>
            </p>
            <p className="text-gray-600 text-sm">
              Times: {item.time?.map((t) => `${t.start} - ${t.end}`).join(", ") || "No time slots"}
            </p>
          </div>
           <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className={`transform transition-transform duration-300 ${
                  expandedId === item.id ? "rotate-180" : "rotate-0"
                  }`}
                  >
                  <ChevronUp size={20} />
                </button>
        </div>

        {expandedId === item.id && (
          <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
          
            <p>
              <span className="font-semibold">Slot Break: </span>
              {item.slot_brack_time || "-"}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(item)}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                <Edit size={16} /> Update
              </button>
              <button
                onClick={() => setDeleteId(item.id)}
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
    <p className="text-gray-500">No availabilities found.</p>
  )}
</div>


      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editData ? "Edit Availability" : "Add Availability"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Doctor</option>
                {Object.values(doctors).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              {formData.time.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={t.start}
                    onChange={(e) => handleTimeChange(e, i, "start")}
                    className="border p-2 rounded flex-1"
                    placeholder="Starting Time e.g. 10:00 AM"
                    required
                  />

                  <input
                    type="text"
                    value={t.end}
                    onChange={(e) => handleTimeChange(e, i, "end")}
                    className="border p-2 rounded flex-1"
                    placeholder="Ending Time e.g. 11:00 AM"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => removeTimeField(i)}
                    className="text-red-500"
                  >
                    X
                  </button>
                </div>
              ))}
              <button type="button" onClick={addTimeField} className="text-blue-500">
                + Add Time
              </button>

              <input
                type="text"
                name="slot_brack_time"
                value={formData.slot_brack_time}
                onChange={handleChange}
                placeholder="Slot Break Time"
                className="border p-2 rounded w-full"
                required
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

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this availability?</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border rounded-xl" onClick={() => setDeleteId(null)}>
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
};


export default DrAvailablities;