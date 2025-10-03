import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctor,
  fetchUsers,
  fetchQualifications,
  insertDoctor,
  updateDoctor,
  deleteDoctor,
} from "../../redux/Slices/DoctorSlice";
import {
  Search,
  Stethoscope,
  Trash2,
  Edit,
  PlusCircle,
  MoreVertical,
  ChevronUp,
  Shield,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DoctorUI() {
  const dispatch = useDispatch();
  const { doctor, users, qualifications, loading } = useSelector(
    (state) => state.doctor
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    user_id: "",
    qualification_id: "",
    specialization: "",
    registration_number: "",
    experience: "",
    about: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    dispatch(fetchDoctor());
    dispatch(fetchUsers());
    dispatch(fetchQualifications());
  }, [dispatch]);

  const filteredDoctors = doctor.filter((doc) =>
    (users[doc.user_id]?.name || doc.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteDoctor(id)).unwrap();
      toast.success("Doctor deleted successfully! 🎉");
      dispatch(fetchDoctor());
    } catch {
      toast.error("Delete failed! 🚫");
    }
    setDeleteId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };

    try {
      if (!editData) {
        await dispatch(insertDoctor(payload)).unwrap();
        toast.success("Doctor added successfully! 🎉");
      } else {
        await dispatch(updateDoctor({ user_id: editData.user_id, payload })).unwrap();
        toast.success("Doctor updated successfully! 🎉");
      }
      resetForm();
      dispatch(fetchDoctor());
      setShowForm(false);
    } catch {
      toast.error(editData ? "Update failed! 🚫" : "Add failed! 🚫");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      user_id: "",
      qualification_id: "",
      specialization: "",
      registration_number: "",
      experience: "",
      about: "",
      address: "",
      city: "",
    });
    setEditData(null);
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        user_id: editData.user_id || "",
        qualification_id: editData.qualification_id || "",
        specialization: editData.specialization || "",
        registration_number: editData.registration_number || "",
        experience: editData.experience || "",
        about: editData.about || "",
        address: editData.address || "",
        city: editData.city || "",
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
                Doctor Management
              </h2>
              <p className="text-sm opacity-80">Manage system doctors</p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            <PlusCircle size={18} /> New Doctor
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
        Total Doctors: {doctor.length}
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white text-left rounded text-sm md:text-base">
              <th className="p-3">Name</th>
              <th className="p-3">Specialization</th>
              <th className="p-3">Qualification</th>
              <th className="p-3">Experience</th>
              <th className="p-3">City</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 text-sm md:text-base">
                  <td className="p-3">{doc.name}</td>
                  <td className="p-3">{doc.specialization}</td>
                  <td className="p-3">
                    {qualifications[doc.qualification_id]?.degree}
                  </td>
                  <td className="p-3">{doc.experience}</td>
                  <td className="p-3">{doc.city}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditData(doc);
                        setShowForm(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
                    >
                      <Edit size={14} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(doc.id)}
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
                  No doctors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <div key={doc.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{doc.name}</p>
                  <p className="text-gray-600 text-sm">
                    {doc.specialization}
                  </p>
                </div>
                 <button
                  onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
                  className={`transform transition-transform duration-300 ${
                  expandedId === doc.id ? "rotate-180" : "rotate-0"
                  }`}
                  >
                  <ChevronUp size={20} />
                </button>
              </div>

      {expandedId === doc.id && (
        <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
          <p><span className="font-semibold">Qualification: </span>{qualifications[doc.qualification_id]?.degree}</p>
          <p><span className="font-semibold">Experience: </span>{doc.experience}</p>
          <p><span className="font-semibold">City: </span>{doc.city}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                setEditData(doc);
                setShowForm(true);
              }}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              <Edit size={16} /> Update
            </button>
            <button
              onClick={() => setDeleteId(doc.id)}
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
          <p className="text-gray-500">No doctors found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editData ? "Edit Doctor" : "Add Doctor"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Doctor Name"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="Specialization"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Experience"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                className="w-full border p-2 rounded"
              />
               <input
                type="text"
                value={formData.registration_number}
                onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                placeholder="registration_number"
                className="w-full border p-2 rounded"
              />
               <input
                type="text"
                value={formData.about}
                onChange={(e) => setFormData({ ...formData,  about: e.target.value })}
                placeholder=" About"
                className="w-full border p-2 rounded"
              />
              {/* Dropdowns */}
              <select
                value={formData.qualification_id}
                onChange={(e) => setFormData({ ...formData, qualification_id: e.target.value })}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Qualification</option>
                {Object.values(qualifications).map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.degree}
                  </option>
                ))}
              </select>

              <select
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                className="border p-2 rounded w-full"
              >
                <option value="">Select User</option>
                {Object.values(users).map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.full_name}
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
            <p className="mb-4">Are you sure you want to delete this doctor?</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border rounded-xl" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600" onClick={() => handleDelete(deleteId)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchDoctor,
//   fetchUsers,
//   fetchQualifications,
//   insertDoctor,
//   updateDoctor,
//   deleteDoctor,
// } from "../Slice/DoctorSlice";
// import { Search, User, Stethoscope, Trash2, Edit, PlusCircle, Building2 } from "lucide-react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function Doctor() {
//   const dispatch = useDispatch();
//   const { doctor, users, qualifications, loading } = useSelector((state) => state.doctor);

//   const [search, setSearch] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);

//   const [formData, setFormData] = useState({
//     user_id: "",
//     qualification_id: "",
//     specialization: "",
//     registration_number: "",
//     experience: "",
//     about: "",
//     address: "",
//     city: "",
//   });

//   useEffect(() => {
//     dispatch(fetchDoctor());
//     dispatch(fetchUsers());
//     dispatch(fetchQualifications());
//   }, [dispatch]);

//   const filteredDoctors = doctor.filter((doc) =>
//     (doc.name || "").toLowerCase().includes(search.toLowerCase())
//   );

//   const handleDelete = async (id) => {
//     try {
//       await dispatch(deleteDoctor(id)).unwrap();
//       toast.success("Doctor deleted successfully! 🎉");
//       dispatch(fetchDoctor());
//     } catch {
//       toast.error("Delete failed! 🚫");
//     }
//     setDeleteId(null);
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   const payload = { ...formData };

//   try {
//     if (!editData) {
//       await dispatch(insertDoctor(payload)).unwrap();
//       toast.success("Doctor added successfully! 🎉");
//     } else {
//       // pass user_id correctly
//       await dispatch(updateDoctor({ user_id: editData.user_id, payload })).unwrap();
//       toast.success("Doctor updated successfully! 🎉");
//     }
//     resetForm();
//     dispatch(fetchDoctor());
//     setShowForm(false);
//   } catch {
//     toast.error(editData ? "Update failed! 🚫" : "Add failed! 🚫");
//   }
// };


//   const resetForm = () => {
//     setFormData({
//       user_id: "",
//       qualification_id: "",
//       specialization: "",
//       registration_number: "",
//       experience: "",
//       about: "",
//       address: "",
//       city: "",
//     });
//     setEditData(null);
//   };

//   useEffect(() => {
//     if (editData) {
//       setFormData({
//         user_id: editData.user_id || "",
//         qualification_id: editData.qualification_id || "",
//         clinic_id: editData.clinic_id || "",
//         specialization: editData.specialization || "",
//         registration_number: editData.registration_number || "",
//         experience: editData.experience || "",
//         about: editData.about || "",
//         address: editData.address || "",
//         city: editData.city || "",
//       });
//     }
//   }, [editData]);

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen relative">
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Loading */}
//       {loading && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
//           <p className="text-white text-lg bg-gray-700 px-6 py-3 rounded">Loading...</p>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
//         <h2 className="text-2xl font-bold flex items-center gap-2">
//           <Stethoscope size={28} className="text-blue-600" /> Doctor Management
//         </h2>
//         <div className="flex gap-2">
//           <div className="flex items-center bg-white p-2 rounded-lg shadow w-64">
//             <Search size={18} className="text-gray-500" />
//             <input
//               type="text"
//               placeholder="Search doctors..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="flex-1 outline-none text-gray-700"
//             />
//           </div>
//           <button
//             onClick={() => {
//               resetForm();
//               setShowForm(true);
//             }}
//             className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
//           >
//             <PlusCircle size={18} /> Add Doctor
//           </button>
//         </div>
//       </div>

//       {/* Desktop Table */}
//       <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-50 text-left">
//               <th className="p-3">Name</th>
//               <th className="p-3">Specialization</th>
//               <th className="p-3">Qualification</th>
//               <th className="p-3">Experience</th>
//               <th className="p-3">City</th>
//               <th className="p-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredDoctors.length > 0 ? (
//               filteredDoctors.map((doc) => (
//                 <tr key={doc.id} className="hover:bg-gray-50">
//                   <td className="p-3">{doc.name}</td>
//                   <td className="p-3">{doc.specialization}</td>
//                   <td className="p-3">
//                     {qualifications[doc.qualification_id]?.degree || "N/A"}
//                   </td>
//                   <td className="p-3">{doc.experience}</td>
//                   <td className="p-3">{doc.city}</td>
//                   <td className="p-3 flex justify-center gap-2">
//                     <button
//                       onClick={() => {
//                         setEditData(doc);
//                         setShowForm(true);
//                       }}
//                       className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
//                     >
//                       <Edit size={14} /> Edit
//                     </button>
//                     <button
//                       onClick={() => setDeleteId(doc.id)}
//                       className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
//                     >
//                       <Trash2 size={14} /> Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center p-4">
//                   No doctors found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Card View */}
//       <div className="grid grid-cols-1 gap-4 md:hidden">
//         {filteredDoctors.map((doc) => (
//           <div key={doc.id} className="bg-white rounded-xl shadow p-4">
//             <h3 className="text-lg font-semibold flex items-center gap-2">
//               <User size={18} className="text-blue-500" /> {doc.name}
//             </h3>
//             <p className="text-sm text-gray-600">{doc.specialization}</p>
//             <p className="text-sm">Qualification: {qualifications[doc.qualification_id]?.degree}</p>
//             <p className="text-sm">Experience: {doc.experience}</p>
//             <p className="text-sm">City: {doc.city}</p>
//             <div className="flex gap-2 mt-3">
//               <button
//                 onClick={() => {
//                   setEditData(doc);
//                   setShowForm(true);
//                 }}
//                 className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
//               >
//                 <Edit size={14} /> Edit
//               </button>
//               <button
//                 onClick={() => setDeleteId(doc.id)}
//                 className="flex-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
//               >
//                 <Trash2 size={14} /> Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add/Edit Modal */}
//       {showForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
//             <h3 className="text-lg font-semibold mb-4">
//               {editData ? "Edit Doctor" : "Add Doctor"}
//             </h3>
//             <form onSubmit={handleSubmit} className="space-y-3">
//               {/* Inputs */}
//                <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 placeholder="name"
//                 className="w-full border p-2 rounded"
                
//               />
//               <input
//                 type="text"
//                 value={formData.specialization}
//                 onChange={(e) =>
//                   setFormData({ ...formData, specialization: e.target.value })
//                 }
//                 placeholder="Specialization"
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <input
//                 type="text"
//                 value={formData.registration_number}
//                 onChange={(e) =>
//                   setFormData({ ...formData, registration_number: e.target.value })
//                 }
//                 placeholder="Registration Number"
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 value={formData.experience}
//                 onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
//                 placeholder="Experience"
//                 className="w-full border p-2 rounded"
//               />
//               <textarea
//                 value={formData.about}
//                 onChange={(e) => setFormData({ ...formData, about: e.target.value })}
//                 placeholder="About Doctor"
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 value={formData.city}
//                 onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                 placeholder="City"
//                 className="w-full border p-2 rounded"
//               />

//               {/* Dropdowns */}
//               <select
//                 value={formData.qualification_id}
//                 onChange={(e) =>
//                   setFormData({ ...formData, qualification_id: e.target.value })
//                 }
//                 className="border p-2 rounded w-full"
//                 required
//               >
//                 <option value="">Select Qualification</option>
//                 {Object.values(qualifications).map((q) => (
//                   <option key={q.id} value={q.id}>
//                     {q.degree}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={formData.user_id}
//                 onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
//                 className="border p-2 rounded w-full"
//                 required
//               >
//                 <option value="">Select User</option>
//                 {Object.values(users).map((u) => (
//                   <option key={u.id} value={u.id}>
//                     {u.name}
//                   </option>
//                 ))}
//               </select>

//               {/* Form Buttons */}
//               <div className="flex justify-end gap-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="px-4 py-2 border rounded-xl"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
//                 >
//                   {editData ? "Update" : "Save"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation */}
//       {deleteId && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
//             <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
//             <p className="mb-4">Are you sure you want to delete this doctor?</p>
//             <div className="flex justify-end gap-2">
//               <button
//                 className="px-4 py-2 border rounded-xl"
//                 onClick={() => setDeleteId(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
//                 onClick={() => handleDelete(deleteId)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



