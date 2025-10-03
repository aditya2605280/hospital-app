
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  fetchUserById,
  fetchLabById,
  insertEmployee,
  updateEmployee,
  deleteEmployee,
  fetchQualificationById
} from "../../redux/Slices/LabsSlice";
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

export default function LabsEmp() {
  const dispatch = useDispatch();
  const { employees, users, labs, qualifications, loading } = useSelector(
    (state) => state.Labs
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    age: "",
    qualification_id: "",
    experience: "",
    joining_date: "",
    address: "",
    lab_id: "",
    user_id: "",
  });

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchUserById());
    dispatch(fetchLabById());
    dispatch( fetchQualificationById());
  }, [dispatch]);

 
  const filteredEmployees = employees.filter((emp) => {
    const userName = users[emp.user_id]?.name || "";
    const addressName = emp.address || "";
     const  experienceName = emp. experience || "";
      const   labName =labs[ emp. lab_id]?.name || "";
  
    // combine all searchable fields
    const combined = `${userName} ${experienceName} ${addressName} ${ labName}`.toLowerCase();
  
    return combined.includes(search.toLowerCase());
  });

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEmployee(id)).unwrap();
      toast.success("Employee deleted successfully! 🎉");
      dispatch(fetchEmployees());
    } catch {
      toast.error("Delete failed! 🚫");
    }
    setDeleteId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      user_id: Number(formData.user_id),
      lab_id: Number(formData.lab_id),
      qualification_id: Number(formData.qualification_id),
      clinic_id: 1,
    };

    try {
      if (!editData) {
        payload.employee_id = `EMP-${String(employees.length + 1).padStart(
          3,
          "0"
        )}`;
        await dispatch(insertEmployee(payload)).unwrap();
        toast.success("Employee added successfully! 🎉");
      } else {
        payload.employee_id = editData.employee_id;
        await dispatch(updateEmployee({ id: editData.id, payload })).unwrap();
        toast.success("Employee updated successfully! 🎉");
      }
      resetForm();
      dispatch(fetchEmployees());
      setShowForm(false);
    } catch {
      toast.error(editData ? "Update failed! 🚫" : "Add failed! 🚫");
    }
  };

  const resetForm = () => {
    setFormData({
      age: "",
      qualification_id: "",
      experience: "",
      joining_date: "",
      address: "",
      lab_id: "",
      user_id: "",
    });
    setEditData(null);
  };

  // Auto-fill when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        age: editData.age || "",
        qualification_id: editData.qualification_id || "",
        experience: editData.experience || "",
        joining_date: editData.joining_date || "",
        address: editData.address || "",
        lab_id: editData.lab_id || "",
        user_id: editData.user_id || "",
      });
    }
  }, [editData]);

  // Auto-fill address from lab selection
  useEffect(() => {
    if (formData.lab_id && labs[formData.lab_id]) {
      setFormData((prev) => ({
        ...prev,
        address: labs[formData.lab_id].address || prev.address,
      }));
    }
  }, [formData.lab_id, labs]);

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
               Lab Employee Management
              </h2>
              <p className="text-sm opacity-80">Manage system employees</p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            <PlusCircle size={18} /> New Employee
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Total count */}
      <div className="mb-2 font-semibold text-gray-700">
        Total Employees: {employees.length}
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white text-left rounded text-sm md:text-base">
              <th className="p-3">Emp ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Age</th>
              <th className="p-3">Qualification</th>
              <th className="p-3">Experience</th>
              <th className="p-3">Joining Date</th>
              <th className="p-3">Address</th>
              <th className="p-3">Lab</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-gray-50 text-sm md:text-base"
                >
                  <td className="p-3">{emp.employee_id}</td>
                  <td className="p-3">{users[emp.user_id]?.name}</td>
                  <td className="p-3">{emp.age}</td>
                  <td className="p-3">
                    {qualifications[emp.qualification_id]?.degree}
                  </td>
                  <td className="p-3">{emp.experience}</td>
                  <td className="p-3">{emp.joining_date}</td>
                  <td className="p-3">{emp.address}</td>
                  <td className="p-3">{labs[emp.lab_id]?.name}</td>
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
                <td colSpan="9" className="text-center p-4">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="border rounded-lg shadow p-4 bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{users[emp.user_id]?.name}</p>
                  <p className="text-gray-600 text-sm">
                    {labs[emp.lab_id]?.name}
                  </p>
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
                    <span className="font-semibold">Emp ID: </span>
                    {emp.employee_id}
                  </p>
                  <p>
                    <span className="font-semibold">Age: </span>
                    {emp.age}
                  </p>
                  <p>
                    <span className="font-semibold">Qualification: </span>
                    {qualifications[emp.qualification_id]?.degree}
                  </p>
                  <p>
                    <span className="font-semibold">Experience: </span>
                    {emp.experience}
                  </p>
                  <p>
                    <span className="font-semibold">Joining: </span>
                    {emp.joining_date}
                  </p>
                  <p>
                    <span className="font-semibold">Address: </span>
                    {emp.address}
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
          <p className="text-gray-500">No employees found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editData ? "Edit Employee" : "Add Employee"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                placeholder="Age"
                className="w-full border p-2 rounded"
                required
              />

              {/* Qualification dropdown */}
              <select
                value={formData.qualification_id}
                onChange={(e) =>
                  setFormData({ ...formData, qualification_id: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Qualification</option>
                          {qualifications &&
              Object.values(qualifications).map((qualification) => (
                <option key={qualification.id} value={qualification.id}>
                  {qualification.degree}
                </option>
              ))}
              </select>

              <input
                type="text"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                placeholder="Experience"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="date"
                value={formData.joining_date}
                onChange={(e) =>
                  setFormData({ ...formData, joining_date: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Address"
                className="w-full border p-2 rounded"
                required
              />
              <div className="flex flex-col md:flex-row gap-2">
                <select
                  value={formData.lab_id}
                  onChange={(e) =>
                    setFormData({ ...formData, lab_id: e.target.value })
                  }
                  className="border p-2 rounded flex-1"
                  required
                >
                  <option value="">Select Lab</option>
                  {Object.values(labs).map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.user_id}
                  onChange={(e) =>
                    setFormData({ ...formData, user_id: e.target.value })
                  }
                  className="border p-2 rounded flex-1"
                  required
                >
                  <option value="">Select User</option>
                  {Object.values(users).map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.full_name}
                    </option>
                  ))}
                </select>
              </div>
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
              Are you sure you want to delete this employee?
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
