// src/components/PatientsList.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPatients,
  fetchPatientById,
  updatePatient,
  deletePatient,
  addPatient,
  clearSelected,
  fetchAllDoctors,
} from "../../redux/Slices/PatientsSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Shield, Trash2, Search, Plus, ChevronDown, ChevronUp } from "lucide-react";

const PatientsList = () => {
  const dispatch = useDispatch();
  const { list, doctors } = useSelector((state) => state.patients);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [fetchId, setFetchId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchedPatientId, setFetchedPatientId] = useState(null);

  const [formData, setFormData] = useState({
    doctor_id: "",
    name: "",
    father_husband_name: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    address: "",
    city: "",
    disease: "",
    disease_symptoms: "",
    disease_duration: "",
    old_reports: "",
    old_reports_note: "",
    clinic_id: "1",
  });

  const [deletePatientData, setDeletePatientData] = useState(null);

  useEffect(() => {
    dispatch(fetchAllPatients()).catch(() =>
      toast.error("Failed to fetch patients")
    );
    dispatch(fetchAllDoctors()).catch(() =>
      toast.error("Failed to fetch doctors")
    );
  }, [dispatch]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({
      doctor_id: "",
      name: "",
      father_husband_name: "",
      email: "",
      phone: "",
      gender: "",
      age: "",
      address: "",
      city: "",
      disease: "",
      disease_symptoms: "",
      disease_duration: "",
      old_reports: "",
      old_reports_note: "",
      clinic_id: "1",
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(updatePatient({ id: editId, data: formData }))
        .unwrap()
        .then(() => {
          toast.success("Patient updated successfully");
          resetForm();
          dispatch(fetchAllPatients());
        })
        .catch(() => toast.error("Failed to update patient"));
    } else {
      dispatch(addPatient(formData))
        .unwrap()
        .then(() => {
          toast.success("Patient added successfully");
          resetForm();
          dispatch(fetchAllPatients());
        })
        .catch(() => toast.error("Failed to add patient"));
    }
  };

  const handleFetchById = () => {
    if (!fetchId.trim()) return toast.error("Please enter a patient ID");

    dispatch(fetchPatientById(fetchId))
      .unwrap()
      .then((patient) => {
        toast.success("Patient fetched successfully");
        setExpandedId(patient.id);
        setFetchedPatientId(patient.id);
        setFormData({ ...formData, ...patient });
      })
      .catch(() => toast.error("Failed to fetch patient by ID"));
  };

  const confirmDelete = () => {
    if (!deletePatientData) return;
    dispatch(deletePatient(deletePatientData.id))
      .unwrap()
      .then(() => {
        toast.success("Patient deleted successfully");
        dispatch(fetchAllPatients());
      })
      .catch(() => toast.error("Failed to delete patient"))
      .finally(() => setDeletePatientData(null));
  };

  const filteredList = list
    .filter((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      a.id === fetchedPatientId ? -1 : b.id === fetchedPatientId ? 1 : 0
    );

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
<div className="bg-blue-500 rounded-lg px-8 py-6 flex flex-col gap-4">
  {/* Top Row: Title + Add Button */}
  <div className="flex items-start justify-between">
    <div className="flex items-center gap-3">
      <div className="bg-blue-400 rounded-xl border border-blue-300 p-2">
        <Shield size={28} color="white" />
      </div>
      <h2 className="text-2xl font-semibold text-white">Patients</h2>
    </div>
    <button
      onClick={() => { setShowForm(!showForm); setEditId(null); }}
      className="bg-white text-blue-500 font-semibold px-6 py-3 rounded hover:bg-gray-100 flex items-center gap-2"
    >
      <Plus className="w-4 h-4" /> {showForm && !editId ? "Close Form" : "Add Patient"}
    </button>
  </div>

  {/* Bottom Row: Search */}
  <div className="relative max-w-md w-full">
    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
    <input
      type="text"
      placeholder="Search patients..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full border border-gray-300 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white text-black"
    />
  </div>
</div>


      {/* Total Patients */}
      <p className="text-black font-semibold text-md md:text-base">
        Total Patients: {filteredList.length}
      </p>

      {/* Add Patient Form */}
      {showForm && !editId && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-4 border rounded shadow bg-white flex flex-col gap-2"
        >
          <h3 className="text-lg font-semibold">Add New Patient</h3>
          <select
            name="doctor_id"
            value={formData.doctor_id || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Doctor</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
          {Object.keys(formData).map((key) => {
            if (key === "doctor_id" || key === "clinic_id") return null;
            return (
              <input
                key={key}
                name={key}
                value={formData[key] || ""}
                onChange={handleChange}
                placeholder={key.replace("_", " ")}
                className="border p-2 rounded w-full"
              />
            );
          })}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            Add Patient
          </button>
        </form>
      )}

      {/* Desktop Table */}
      <div className="overflow-x-auto bg-white rounded shadow hidden md:block">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">S.No</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Age</th>
              <th className="px-3 py-2 text-left">Doctor</th>
              <th className="px-3 py-2 text-left">Address</th>
              <th className="px-3 py-2 text-left">City</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredList.map((patient, index) => (
              <React.Fragment key={patient.id}>
                <tr
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    setExpandedId(expandedId === patient.id ? null : patient.id)
                  }
                >
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">{patient.name}</td>
                  <td className="px-3 py-2">{patient.age}</td>
                  <td className="px-3 py-2">
                    {patient.doctor_name ||
                      doctors.find(
                        (d) => Number(d.id) === Number(patient.doctor_id)
                      )?.name ||
                      "N/A"}
                  </td>
                  <td className="px-3 py-2">{patient.address}</td>
                  <td className="px-3 py-2">{patient.city}</td>
                  <td className="px-3 py-2 flex flex-wrap gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletePatientData(patient);
                      }}
                      className="bg-red-600 text-white px-2 py-1 flex gap-2 rounded hover:bg-red-700 text-s items-center"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>

                {expandedId === patient.id && (
                  <tr className="bg-gray-50">
                    <td colSpan="7" className="px-4 py-3 text-sm">
                      <div className="space-y-1">
                        <p>
                          <strong>Father/Husband:</strong>{" "}
                          {patient.father_husband_name}
                        </p>
                        <p>
                          <strong>Email:</strong> {patient.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {patient.phone}
                        </p>
                        <p>
                          <strong>Gender:</strong> {patient.gender}
                        </p>
                        <p>
                          <strong>Disease:</strong> {patient.disease}
                        </p>
                        <p>
                          <strong>Symptoms:</strong> {patient.disease_symptoms}
                        </p>
                        <p>
                          <strong>Duration:</strong> {patient.disease_duration}
                        </p>
                        <p>
                          <strong>Old Reports Note:</strong>{" "}
                          {patient.old_reports_note}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {filteredList.map((patient, index) => (
          <div
            key={patient.id}
            className="border rounded-lg p-4 shadow bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-blue-600">
                {index + 1}. {patient.name}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setExpandedId(expandedId === patient.id ? null : patient.id)
                  }
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                >
                  {expandedId === patient.id ? <ChevronUp /> : <ChevronDown />}
                </button>
                <button
                  onClick={() => setDeletePatientData(patient)}
                  className="bg-red-600 text-white px-2 py-1 flex gap-2 rounded hover:bg-red-700 text-xs items-center"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>

            <div
              className={`transition-all duration-300 overflow-hidden ${
                expandedId === patient.id
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="mt-2 space-y-1 text-sm">
                <p><strong>Age:</strong> {patient.age}</p>
                <p>
                  <strong>Doctor:</strong>{" "}
                  {patient.doctor_name ||
                    doctors.find(
                      (d) => Number(d.id) === Number(patient.doctor_id)
                    )?.name ||
                    "N/A"}
                </p>
                <p><strong>Address:</strong> {patient.address}</p>
                <p><strong>City:</strong> {patient.city}</p>
                <p><strong>Email:</strong> {patient.email}</p>
                <p><strong>Phone:</strong> {patient.phone}</p>
                <p><strong>Disease:</strong> {patient.disease}</p>
                <p><strong>Symptoms:</strong> {patient.disease_symptoms}</p>
                <p><strong>Duration:</strong> {patient.disease_duration}</p>
                <p><strong>Reports Note:</strong> {patient.old_reports_note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      {deletePatientData && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <strong>{deletePatientData.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletePatientData(null)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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

export default PatientsList;
