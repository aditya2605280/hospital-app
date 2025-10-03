import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchData,
  fetchDoctors,
  createUser,
  updateUser,
  deleteUser,
} from "../../redux/Slices/CommissionSettingsSlice";
import {
  Search,
  Shield,
  Trash2,
  Edit,
  PlusCircle,
  ChevronUp,
  Settings,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CommissionSettings() {
  const dispatch = useDispatch();
  const { data: commissions = [], loading = false, doctors = {} } =
    useSelector((state) => state.commission_settings ?? {});

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // commission being edited
  const [form, setForm] = useState({
    doctor_id: "",
    type: "",
    source: "",
    value: "",
    calculation_type: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState("");

  // fetch on mount
  useEffect(() => {
    dispatch(fetchData());
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (!showForm) {
      setForm({ doctor_id: "", type: "", source: "", value: "", calculation_type: "" });
      setEditing(null);
      setError("");
    }
  }, [showForm]);

  const filtered = commissions
    .filter((c) => {
      const doctorName = doctors?.[c.doctor_id]?.name || "";
      const searchable = `${c.doctor_id} ${doctorName} ${c.type} ${c.source}`.toLowerCase();
      return searchable.includes(searchTerm.toLowerCase());
    })
    .reverse();

  // submit add or update
  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setError("");

    if (!form.doctor_id) {
      setError("Please select a doctor");
      return;
    }

    try {
      if (editing) {
        await dispatch(updateUser({ id: editing.id, updatedUser: form })).unwrap();
        toast.success("Commission updated successfully");
      } else {
        await dispatch(createUser(form)).unwrap();
        toast.success("Commission added successfully");
      }
      dispatch(fetchData());
      setShowForm(false);
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (c) => {
    setEditing(c);
    setForm({
      doctor_id: c.doctor_id || "",
      type: c.type || "",
      source: c.source || "",
      value: c.value || "",
      calculation_type: c.calculation_type || "",
    });
    setShowForm(true);
  };

  const confirmDelete = (id) => setDeleteId(id);

  const doDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteUser(deleteId)).unwrap();
      toast.success("Commission deleted");
      dispatch(fetchData());
    } catch {
      toast.error("Delete failed");
    }
    setDeleteId(null);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-4 md:p-6 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-400 border border-blue-300">
            <Shield size={28} color="white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Commission Settings</h1>
            <p className="text-sm opacity-85">Manage doctor commissions</p>
          </div>
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto">
          <div className="flex items-center bg-white rounded-lg p-2 shadow w-full md:w-72">
            <Search size={16} className="text-gray-500" />
            <input
              className="ml-2 outline-none text-gray-700 w-full"
              placeholder="Search by Doctor ID, name, type or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
              setForm({ doctor_id: "", type: "", source: "", value: "", calculation_type: "" });
            }}
            className="flex items-center gap-2 bg-white text-blue-600 px-3 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            <PlusCircle size={16} /> New
          </button>
        </div>
      </div>

      <div className="mt-4 mb-2 text-gray-700 font-medium">Total: {commissions.length}</div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">S.No</th>
              <th className="p-3 text-left">Doctor</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Source</th>
              <th className="p-3 text-left">Value</th>
              <th className="p-3 text-left">Calculation</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">No records found.</td>
              </tr>
            ) : (
              filtered.map((c, idx) => (
                <tr key={c.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{doctors[c.doctor_id]?.name || `Doctor #${c.doctor_id}`}</td>
                  <td className="p-3">{c.type}</td>
                  <td className="p-3">{c.source}</td>
                  <td className="p-3">{c.value}</td>
                  <td className="p-3">{c.calculation_type}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button onClick={() => handleEdit(c)} className="flex items-center gap-2 bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-600">
                      <Settings size={14} /> Edit
                    </button>
                    <button onClick={() => confirmDelete(c.id)} className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600">
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden flex flex-col gap-3 mt-3">
        {filtered.length === 0 ? (
          <div className="p-4 bg-white rounded shadow text-center text-gray-500">No records found.</div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-lg p-3 shadow">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{doctors[c.doctor_id]?.name || `Doctor #${c.doctor_id}`}</p>
                  <p className="text-sm text-gray-600">{c.type} • {c.source}</p>
                </div>

                <div className="flex items-start gap-2">
                  <button
                    onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                    className={`transform transition-transform ${expandedId === c.id ? 'rotate-180' : 'rotate-0'}`}
                    aria-label="expand"
                  >
                    <ChevronUp size={20} />
                  </button>
                </div>
              </div>

              {expandedId === c.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p><span className="font-semibold">Value:</span> {c.value}</p>
                  <p><span className="font-semibold">Calculation:</span> {c.calculation_type}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleEdit(c)} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                      <Edit size={14} /> Edit
                    </button>
                    <button onClick={() => confirmDelete(c.id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-xl shadow-lg w-11/12 md:w-96 p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-3">{editing ? "Edit Commission" : "Add Commission"}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                value={form.doctor_id}
                onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Doctor</option>
                {doctors && Object.values(doctors).map((d) => (
                  <option key={d.id} value={d.id}>{d.name || `Doctor #${d.id}`}</option>
                ))}
              </select>

              <input type="text" placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border p-2 rounded" />
              <input type="text" placeholder="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="w-full border p-2 rounded" />
              <input type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full border p-2 rounded" />
              <input type="text" placeholder="Calculation Type" value={form.calculation_type} onChange={(e) => setForm({ ...form, calculation_type: e.target.value })} className="w-full border p-2 rounded" />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setError(""); }} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded shadow">{editing ? 'Save' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-xl p-4 md:w-1/3 w-11/12 shadow">
            <h3 className="font-semibold text-lg">Confirm Delete</h3>
            <p className="text-sm text-gray-700 mt-2">Are you sure you want to delete this commission?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={doDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
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
//   fetchData,
//   fetchDoctors,
//   createUser,
//   updateUser,
//   deleteUser,
// } from "../Slice/CommissionSettingsSlice";
// import { Search, Settings, Trash2, Shield } from "lucide-react";
// import { toast } from "react-toastify";

// const CommissionSettings = () => {
//   const dispatch = useDispatch();
//   const { data = [], loading = false, error = null, doctors = {} } = useSelector(
//     (state) => state.commission_settings ?? {}
//   );

//   const [newUser, setNewUser] = useState({
//     doctor_id: "",
//     type: "",
//     source: "",
//     value: "",
//     calculation_type: "",
//   });
//   const [form, setForm] = useState({
//     doctor_id: "",
//     type: "",
//     source: "",
//     value: "",
//     calculation_type: "",
//   });
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [updateError, setUpdateError] = useState("");
//   const [addError, setAddError] = useState("");
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);

//   // Fetch data
//   useEffect(() => {
//     dispatch(fetchData());
//     dispatch(fetchDoctors());
//   }, [dispatch]);

//   // Add commission
//   const handleAdd = async (e) => {
//     e.preventDefault();
//     setAddError("");

//     if (!newUser.doctor_id) {
//       setAddError("Please select a doctor");
//       return;
//     }

//     try {
//       await dispatch(createUser(newUser)).unwrap();
//       dispatch(fetchData());
//       setNewUser({ doctor_id: "", type: "", source: "", value: "", calculation_type: "" });
//       setShowAddForm(false);
//       toast.success("Commission added successfully");
//     } catch {
//       toast.error("Failed to add commission");
//     }
//   };

//   // Edit commission
//   const handleEdit = (user) => {
//     setEditingUserId(user.id);
//     setForm({
//       doctor_id: user.doctor_id || "",
//       type: user.type || "",
//       source: user.source || "",
//       value: user.value || "",
//       calculation_type: user.calculation_type || "",
//     });
//   };

//   // Update commission
//   const handleUpdate = async () => {
//     setUpdateError("");
//     if (!form.doctor_id) {
//       setUpdateError("Please select a doctor");
//       return;
//     }

//     try {
//       await dispatch(updateUser({ id: editingUserId, updatedUser: form })).unwrap();
//       await dispatch(fetchData()).unwrap();
//       toast.success("Commission updated successfully");
//       setEditingUserId(null);
//     } catch {
//       setUpdateError("Failed to update commission");
//       toast.error("Failed to update commission");
//     }
//   };

//   // Delete commission
//   const confirmDelete = (id) => {
//     setDeleteId(id);
//     setShowDeleteConfirm(true);
//   };

//   const cancelDelete = () => {
//     setDeleteId(null);
//     setShowDeleteConfirm(false);
//   };

//   const handleDelete = async () => {
//     if (deleteId) {
//       try {
//         await dispatch(deleteUser(deleteId)).unwrap();
//         await dispatch(fetchData()).unwrap();
//         toast.success("Commission deleted successfully");
//       } catch {
//         toast.error("Failed to delete commission");
//       }
//     }
//     cancelDelete();
//   };

//   // Filtered data
//   const filteredData = data
//     .filter(
//       (user) =>
//         user?.doctor_id?.toString().includes(searchTerm) ||
//         user?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user?.source?.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .reverse();

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md mb-6">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-3 cursor-pointer" onClick={() => dispatch(fetchData())}>
//             <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#5492F5] shadow">
//               <Shield className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold leading-tight">Commission Settings</h1>
//               <p className="text-sm text-gray-200">Manage Doctor Commissions</p>
//             </div>
//           </div>
//           <button
//             onClick={() => setShowAddForm(!showAddForm)}
//             className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition font-medium"
//           >
//             + Add New Commission
//           </button>
//         </div>

//         {/* Search */}
//         <div className="bg-white rounded-lg px-3 w-full py-2 flex items-center shadow-sm mt-4">
//           <Search className="w-4 h-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by Doctor ID, Type or Source..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="ml-2 w-full text-gray-700 focus:outline-none"
//           />
//           {searchTerm && (
//             <button onClick={() => setSearchTerm("")} className="text-sm text-gray-500 ml-2">
//               Clear
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Add Form */}
//       {showAddForm && (
//         <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
//           <form onSubmit={handleAdd} className="bg-white p-6 rounded-lg shadow w-96 space-y-3">
//             <select
//               value={newUser.doctor_id}
//               onChange={(e) => setNewUser({ ...newUser, doctor_id: e.target.value })}
//               className="w-full border rounded p-2"
//             >
//               <option value="">Select Doctor</option>
//               {doctors &&
//                 Object.values(doctors).map((doc) => (
//                   <option key={doc.id} value={doc.id}>
//                     {doc.name || `Doctor #${doc.id}`} (ID: {doc.id})
//                   </option>
//                 ))}
//             </select>
//             {addError && <p className="text-red-500 text-sm">{addError}</p>}
//             <input type="text" placeholder="Type" value={newUser.type} onChange={(e) => setNewUser({ ...newUser, type: e.target.value })} className="w-full border rounded p-2" />
//             <input type="text" placeholder="Source" value={newUser.source} onChange={(e) => setNewUser({ ...newUser, source: e.target.value })} className="w-full border rounded p-2" />
//             <input type="number" placeholder="Value" value={newUser.value} onChange={(e) => setNewUser({ ...newUser, value: e.target.value })} className="w-full border rounded p-2" />
//             <input type="text" placeholder="Calculation Type" value={newUser.calculation_type} onChange={(e) => setNewUser({ ...newUser, calculation_type: e.target.value })} className="w-full border rounded p-2" />

//             <div className="flex justify-end gap-2">
//               <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
//               <button type="button" onClick={() => { setShowAddForm(false); setAddError(""); }} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Table */}
//       <div className="bg-white shadow-xl rounded-xl overflow-x-auto max-w-5xl mx-auto mb-8 border border-gray-200">
//         <table className="min-w-full border-collapse">
//           <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
//             <tr>
//               <th className="p-3 font-semibold text-center">S.No</th>
//               <th className="p-3 font-semibold text-center">Doctor</th>
//               <th className="p-3 font-semibold text-center">Type</th>
//               <th className="p-3 font-semibold text-center">Source</th>
//               <th className="p-3 font-semibold text-center">Value</th>
//               <th className="p-3 font-semibold text-center">Calculation Type</th>
//               <th className="p-3 font-semibold text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="p-6 text-center text-gray-500">No records found.</td>
//               </tr>
//             ) : (
//               filteredData.map((user, index) => (
//                 <tr key={user.id} className={index % 2 === 0 ? "bg-white border-b" : "bg-gray-50 border-b"}>
//                   <td className="p-3 align-middle text-center">{index + 1}</td>
//                   <td className="p-3 align-middle text-center">{doctors?.[user.doctor_id]?.name || `Doctor #${user.doctor_id}`}</td>
//                   <td className="p-3 align-middle text-center">{user.type}</td>
//                   <td className="p-3 align-middle text-center">{user.source}</td>
//                   <td className="p-3 align-middle text-center">{user.value}</td>
//                   <td className="p-3 align-middle text-center">{user.calculation_type}</td>
//                   <td className="p-3 align-middle text-center">
//                     <div className="flex gap-2 justify-center">
//                       <button onClick={() => handleEdit(user)} className="bg-blue-500 text-white px-4 py-1 rounded-lg flex items-center gap-1 hover:bg-blue-600 transition duration-200">
//                         <Settings className="w-4 h-4" /> Edit
//                       </button>
//                       <button onClick={() => confirmDelete(user.id)} className="bg-red-500 text-white px-4 py-1 rounded-lg flex items-center gap-1 hover:bg-red-600 transition duration-200">
//                         <Trash2 className="w-4 h-4" /> Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Update Modal */}
//       {editingUserId && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-3">
//             <h2 className="text-lg font-bold">Update Commission</h2>
//             <select
//               value={form.doctor_id}
//               onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
//               className="w-full border rounded p-2"
//             >
//               <option value="">Select Doctor</option>
//               {doctors &&
//                 Object.values(doctors).map((doc) => (
//                   <option key={doc.id} value={doc.id}>
//                     {doc.name || `Doctor #${doc.id}`} (ID: {doc.id})
//                   </option>
//                 ))}
//             </select>
//             {updateError && <p className="text-red-500 text-sm">{updateError}</p>}
//             <input type="text" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border rounded p-2" placeholder="Type" />
//             <input type="text" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="w-full border rounded p-2" placeholder="Source" />
//             <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full border rounded p-2" placeholder="Value" />
//             <input type="text" value={form.calculation_type} onChange={(e) => setForm({ ...form, calculation_type: e.target.value })} className="w-full border rounded p-2" placeholder="Calculation Type" />
//             <div className="flex justify-end gap-2">
//               <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
//               <button onClick={() => { setEditingUserId(null); setUpdateError(""); }} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
//             <p className="text-gray-700 mb-6">Are you sure you want to delete this commission?</p>
//             <div className="flex justify-end gap-3">
//               <button onClick={cancelDelete} className="bg-gray-400 text-white px-4 py-2 rounded">No</button>
//               <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Yes, Delete</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CommissionSettings;

