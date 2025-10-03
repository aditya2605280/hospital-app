import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  insertUser,
  updateUser,
  deleteUser,
  fetchRole,
  resetPassword,
  updatePassword,
} from "../../redux/Slices/UsersSlice";
import { Search, Shield, Trash2, Edit, PlusCircle, MoreVertical, ChevronUp } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function User() {
  const dispatch = useDispatch();
  const { users, role, loading } = useSelector((state) => state.users);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    password: "",
    password_confirmation: "",
    role_id: "",
  });

  // New state for password forms
  const [mode, setMode] = useState("form"); // "form" | "changePassword" | "forgotPassword"
  const [old_password, setold_password] = useState("");
  const [new_password, setnew_password] = useState("");
  const [new_password_confirmation, setnew_password_confirmation] = useState("");

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchRole());
  }, [dispatch]);

  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile_no: "",
      password: "",
      password_confirmation: "",
      role_id: "",
    });
    setEditData(null);
    setMode("form");
    setold_password("");
    setnew_password("");
   setnew_password_confirmation("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!editData) {
        await dispatch(insertUser(formData)).unwrap();
        toast.success("User added successfully! 🎉");
      } else {
        await dispatch(updateUser({ id: editData.id, payload: formData })).unwrap();
        toast.success("User updated successfully! 🎉");
      }
      resetForm();
      setShowForm(false);
      dispatch(fetchUser());
    } catch (error) {
      console.error("Update error:", error);
      toast.error(editData ? "Update failed 🚫" : "Add failed 🚫");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("User deleted successfully! 🗑️");
      dispatch(fetchUser());
    } catch {
      toast.error("Delete failed 🚫");
    }
    setDeleteId(null);
  };

  // Auto-fill edit form
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        email: editData.email || "",
        mobile_no: editData.mobile_no || "",
        password: "",
        password_confirmation: "",
        role_id: editData.role_id || "",
      });
    }
  }, [editData]);

  return (
    <div className="p-4 md:px-2 bg-gray-100 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Loading Overlay */}
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
              <h2 className="text-xl md:text-2xl font-bold">Users Management</h2>
              <p className="text-sm opacity-80">Manage system users</p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            <PlusCircle size={18} /> New User
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Total count */}
      <div className="mb-2 font-semibold text-gray-700">Total Users: {users.length}</div>

      {/* Desktop Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white text-left rounded text-sm md:text-base">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 text-sm md:text-base">
                  <td className="p-3">{u.id}</td>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.mobile_no}</td>
                  <td className="p-3">{role[u.role_id]?.name}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditData(u);
                        setShowForm(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
                    >
                      <Edit size={14} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(u.id)}
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
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div key={u.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-gray-600 text-sm">{u.email}</p>
                </div>
                 <button
                  onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}
                  className={`transform transition-transform duration-300 ${
                  expandedId === u.id ? "rotate-180" : "rotate-0"
                  }`}
                  >
                  <ChevronUp size={20} />
                </button>
              </div>

              {expandedId === u.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Mobile: </span>
                    {u.mobile_no}
                  </p>
                  <p>
                    <span className="font-semibold">Role: </span>
                    {role[u.role_id]?.name}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditData(u);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(u.id)}
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
          <p className="text-gray-500">No users found.</p>
        )}
      </div>

      {/* Add/Edit/Password Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            {mode === "form" && (
              <>
                <h3 className="text-lg font-semibold mb-4">{editData ? "Edit User" : "Add User"}</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    value={formData.mobile_no}
                    onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                    placeholder="Mobile Number"
                    className="w-full border p-2 rounded"
                    required
                  />

                  {!editData && (
                    <>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Password"
                        className="w-full border p-2 rounded"
                        required
                      />
                      <input
                        type="password"
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                        placeholder="Confirm Password"
                        className="w-full border p-2 rounded"
                        required
                      />
                    </>
                  )}

                  <select
                    value={formData.role_id}
                    onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                    className="border p-2 rounded w-full"
                    required
                  >
                    <option value="">Select Role</option>
                    {role && Object.values(role).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>

                  {editData && (
                    <div className="flex justify-between text-sm mt-2">
                      <button type="button" className="text-blue-600 hover:underline" onClick={() => setMode("forgotPassword")}>
                        Forgot Password?
                      </button>
                      <button type="button" className="text-blue-600 hover:underline" onClick={() => setMode("changePassword")}>
                        Change Password
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 border rounded-xl">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">
                      {editData ? "Update" : "Save"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Change Password Form */}
            {mode === "changePassword" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await dispatch(updatePassword({ id: editData.id, old_password, new_password, new_password_confirmation })).unwrap();
                      toast.success("Password updated successfully! 🔐");
                      setMode("form");
                      setold_password(""); setnew_password(""); setnew_password_confirmation("");
                    } catch {
                      toast.error("Failed to update password 🚫");
                    }
                  }}
                  className="space-y-3"
                >
                  <input type="password" placeholder="Old Password" value={old_password} onChange={(e) => setold_password(e.target.value)} className="w-full border p-2 rounded" required />
                  <input type="password" placeholder="New Password" value={new_password} onChange={(e) => setnew_password(e.target.value)} className="w-full border p-2 rounded" required />
                  <input type="password" placeholder="Confirm New Password" value={new_password_confirmation} onChange={(e) => setnew_password_confirmation(e.target.value)} className="w-full border p-2 rounded" required />

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setMode("form")} className="px-4 py-2 border rounded-xl">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">Update Password</button>
                  </div>
                </form>
              </>
            )}

            {/* Forgot Password Form */}
            {mode === "forgotPassword" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Forgot Password</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await dispatch(resetPassword({ email: editData.email })).unwrap();
                      toast.success("Reset link sent to email! 📧");
                      setMode("form");
                    } catch {
                      toast.error("Failed to send reset link 🚫");
                    }
                  }}
                  className="space-y-3"
                >
                  <input type="email" placeholder="Email" value={editData.email} readOnly className="w-full border p-2 rounded bg-gray-100" />
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setMode("form")} className="px-4 py-2 border rounded-xl">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">Send Reset Link</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
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
//   fetchUser,
//   insertUser,
//   updateUser,
//   deleteUser,
//   fetchRole,
//   resetPassword,
//   updatePassword,
// } from "../Slice/UsersSlice";
// import { Search, Shield, Trash2, Edit, PlusCircle, MoreVertical } from "lucide-react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function User() {
//   const dispatch = useDispatch();
//   const { users, role, loading } = useSelector((state) => state.users);

//   const [search, setSearch] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [expandedId, setExpandedId] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile_no: "",
//     password: "",
//     password_confirmation: "",
//     role_id: "",
//   });

//   useEffect(() => {
//     dispatch(fetchUser());
//     dispatch(fetchRole());
//   }, [dispatch]);

//   const filteredUsers = users.filter((u) =>
//     (u.name || "").toLowerCase().includes(search.toLowerCase())
//   );

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       email: "",
//       mobile_no: "",
//       password: "",
//       password_confirmation: "",
//       role_id: "",
//     });
//     setEditData(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (!editData) {
//         await dispatch(insertUser(formData)).unwrap();
//         toast.success("User added successfully! 🎉");
//       } else {
//         await dispatch(updateUser({ id: editData.id, payload: formData })).unwrap();
//         toast.success("User updated successfully! 🎉");
//       }
//       resetForm();
//       setShowForm(false);
//       dispatch(fetchUser());
//     } catch (error) {
//       console.error("Update error:", error);
//       toast.error(editData ? "Update failed 🚫" : "Add failed 🚫");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await dispatch(deleteUser(id)).unwrap();
//       toast.success("User deleted successfully! 🗑️");
//       dispatch(fetchUser());
//     } catch {
//       toast.error("Delete failed 🚫");
//     }
//     setDeleteId(null);
//   };

//   const handleResetPassword = async (id) => {
//     try {
//       await dispatch(resetPassword({ id })).unwrap();
//       toast.success("Password reset link sent! 🔑");
//     } catch {
//       toast.error("Failed to reset password 🚫");
//     }
//   };

//   const handleChangePassword = async (id) => {
//     const newPass = prompt("Enter new password:");
//     if (!newPass) return;
//     try {
//       await dispatch(updatePassword({ id, password: newPass })).unwrap();
//       toast.success("Password updated successfully! 🔐");
//     } catch {
//       toast.error("Failed to update password 🚫");
//     }
//   };

//   // Auto-fill edit form
//   useEffect(() => {
//     if (editData) {
//       setFormData({
//         name: editData.name || "",
//         email: editData.email || "",
//         mobile_no: editData.mobile_no || "",
//         password: "",
//         password_confirmation: "",
//         role_id: editData.role_id || "",
//       });
//     }
//   }, [editData]);

//   return (
//     <div className="p-4 md:px-2 bg-gray-100 min-h-screen relative">
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
//           <p className="text-white text-xl bg-gray-700 px-6 py-4 rounded">Loading...</p>
//         </div>
//       )}

//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 text-white p-4 rounded-xl shadow flex justify-between flex-col gap-4 mb-6">
//         <div className="flex flex-row gap-2 items-center justify-between">
//           <div className="flex gap-2 items-center">
//             <div className="bg-blue-400 rounded-xl border border-blue-300 p-3">
//               <Shield size={32} color="white" />
//             </div>
//             <div className="flex flex-col">
//               <h2 className="text-xl md:text-2xl font-bold">Users Management</h2>
//               <p className="text-sm opacity-80">Manage system users</p>
//             </div>
//           </div>

//           <button
//             onClick={() => {
//               resetForm();
//               setShowForm(true);
//             }}
//             className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
//           >
//             <PlusCircle size={18} /> New User
//           </button>
//         </div>

//         <div className="flex flex-col md:flex-row items-center justify-between gap-3">
//           <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
//             <Search size={18} className="text-gray-500" />
//             <input
//               type="text"
//               placeholder="Search users..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="flex-1 outline-none text-gray-700"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Total count */}
//       <div className="mb-2 font-semibold text-gray-700">Total Users: {users.length}</div>

//       {/* Desktop Table */}
//       <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-white text-left rounded text-sm md:text-base">
//               <th className="p-3">ID</th>
//               <th className="p-3">Name</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Mobile</th>
//               <th className="p-3">Role</th>
//               <th className="p-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.length > 0 ? (
//               filteredUsers.map((u) => (
//                 <tr key={u.id} className="hover:bg-gray-50 text-sm md:text-base">
//                   <td className="p-3">{u.id}</td>
//                   <td className="p-3">{u.name}</td>
//                   <td className="p-3">{u.email}</td>
//                   <td className="p-3">{u.mobile_no}</td>
//                   <td className="p-3">{role[u.role_id]?.name}</td>
//                   <td className="p-3 flex justify-center gap-2">
//                     <button
//                       onClick={() => {
//                         setEditData(u);
//                         setShowForm(true);
//                       }}
//                       className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
//                     >
//                       <Edit size={14} /> Update
//                     </button>
//                     <button
//                       onClick={() => setDeleteId(u.id)}
//                       className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
//                     >
//                       <Trash2 size={14} /> Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="text-center p-4">
//                   No users found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Card View */}
//       <div className="md:hidden flex flex-col gap-4">
//         {filteredUsers.length > 0 ? (
//           filteredUsers.map((u) => (
//             <div key={u.id} className="border rounded-lg shadow p-4 bg-white">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="font-semibold">{u.name}</p>
//                   <p className="text-gray-600 text-sm">{u.email}</p>
//                 </div>
//                 <button onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}>
//                   <MoreVertical size={20} />
//                 </button>
//               </div>

//               {expandedId === u.id && (
//                 <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
//                   <p>
//                     <span className="font-semibold">Mobile: </span>
//                     {u.mobile_no}
//                   </p>
//                   <p>
//                     <span className="font-semibold">Role: </span>
//                     {role[u.role_id]?.name}
//                   </p>
//                   <div className="flex gap-2 mt-2">
//                     <button
//                       onClick={() => {
//                         setEditData(u);
//                         setShowForm(true);
//                       }}
//                       className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
//                     >
//                       <Edit size={16} /> Update
//                     </button>
//                     <button
//                       onClick={() => setDeleteId(u.id)}
//                       className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//                     >
//                       <Trash2 size={16} /> Delete
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">No users found.</p>
//         )}
//       </div>

//       {/* Add/Edit Modal */}
//       {showForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
//             <h3 className="text-lg font-semibold mb-4">{editData ? "Edit User" : "Add User"}</h3>
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 placeholder="Full Name"
//                 className="w-full border p-2 rounded"
//                 required
//               />
//               <input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 placeholder="Email"
//                 className="w-full border p-2 rounded"
//                 required
//               />

//               {/* 🔹 Forgot & Change Password Links */}
//               {editData && (
//                 <div className="flex justify-between text-sm">
//                   <button
//                     type="button"
//                     className="text-blue-600 hover:underline"
//                     onClick={() => handleResetPassword(editData.id)}
//                   >
//                     Forgot Password?
//                   </button>
//                   <button
//                     type="button"
//                     className="text-blue-600 hover:underline"
//                     onClick={() => handleChangePassword(editData.id)}
//                   >
//                     Change Password
//                   </button>
//                 </div>
//               )}

//               <input
//                 type="text"
//                 value={formData.mobile_no}
//                 onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
//                 placeholder="Mobile Number"
//                 className="w-full border p-2 rounded"
//                 required
//               />

//               {!editData && (
//                 <>
//                   <input
//                     type="password"
//                     value={formData.password}
//                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     placeholder="Password"
//                     className="w-full border p-2 rounded"
//                     required
//                   />
//                   <input
//                     type="password"
//                     value={formData.password_confirmation}
//                     onChange={(e) =>
//                       setFormData({ ...formData, password_confirmation: e.target.value })
//                     }
//                     placeholder="Confirm Password"
//                     className="w-full border p-2 rounded"
//                     required
//                   />
//                 </>
//               )}

//               <select
//                 value={formData.role_id}
//                 onChange={(e) =>
//                   setFormData({ ...formData, role_id: e.target.value })
//                 }
//                 className="border p-2 rounded w-full"
//                 required
//               >
//                 <option value="">Select Role</option>
//                 {role &&
//                   Object.values(role).map((r) => (
//                     <option key={r.id} value={r.id}>
//                       {r.name}
//                     </option>
//                   ))}
//               </select>

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

//       {/* Delete Confirmation Modal */}
//       {deleteId && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
//             <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
//             <p className="mb-4">Are you sure you want to delete this user?</p>
//             <div className="flex justify-end gap-2">
//               <button className="px-4 py-2 border rounded-xl" onClick={() => setDeleteId(null)}>
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



// // import React, { useEffect, useState } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import {
// //   fetchUser,
// //   insertUser,
// //   updateUser,
// //   deleteUser,
// //   fetchRole,
// // } from "../Slice/UsersSlice";
// // import {
// //   Search,
// //   Shield,
// //   Trash2,
// //   Edit,
// //   PlusCircle,
// //   MoreVertical,
// // } from "lucide-react";
// // import { toast, ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // export default function User() {
// //   const dispatch = useDispatch();
// //   const { users, role, loading } = useSelector((state) => state.users);

// //   const [search, setSearch] = useState("");
// //   const [showForm, setShowForm] = useState(false);
// //   const [editData, setEditData] = useState(null);
// //   const [expandedId, setExpandedId] = useState(null);
// //   const [deleteId, setDeleteId] = useState(null);

// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     mobile_no: "",
// //     password: "",
// //     password_confirmation: "",
// //     role_id: "",
// //   });

// //   useEffect(() => {
// //     dispatch(fetchUser());
// //     dispatch(fetchRole());
// //   }, [dispatch]);

// //   const filteredUsers = users.filter((u) =>
// //     (u.name || "").toLowerCase().includes(search.toLowerCase())
// //   );

// //   const resetForm = () => {
// //     setFormData({
// //       name: "",
// //       email: "",
// //       mobile_no: "",
// //       password: "",
// //       password_confirmation: "",
// //       role_id: "",
// //     });
// //     setEditData(null);
// //   };

// //  const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   try {
// //     if (!editData) {
// //       await dispatch(insertUser(formData)).unwrap();
// //       toast.success("User added successfully! 🎉");
// //     } else {
// //       await dispatch(updateUser({ id: editData.id, payload: formData })).unwrap();
// //       toast.success("User updated successfully! 🎉");
// //     }
// //     resetForm();
// //     setShowForm(false);
// //     dispatch(fetchUser());
// //  } catch (error) {
// //   console.error("Update error:", error);
// //   toast.error(editData ? "Update failed 🚫" : "Add failed 🚫");
// // }
// // };


// //   const handleDelete = async (id) => {
// //     try {
// //       await dispatch(deleteUser(id)).unwrap();
// //       toast.success("User deleted successfully! 🗑️");
// //       dispatch(fetchUser());
// //     } catch {
// //       toast.error("Delete failed 🚫");
// //     }
// //     setDeleteId(null);
// //   };

// //   // Auto-fill edit form
// //   useEffect(() => {
// //     if (editData) {
// //       setFormData({
// //         name: editData.name || "",
// //         email: editData.email || "",
// //         mobile_no: editData.mobile_no || "",
// //         password: "",
// //         password_confirmation: "",
// //         role_id: editData.role_id || "",
// //       });
// //     }
// //   }, [editData]);

// //   return (
// //     <div className="p-4 md:px-2 bg-gray-100 min-h-screen relative">
// //       <ToastContainer position="top-right" autoClose={3000} />

// //       {/* Loading Overlay */}
// //       {loading && (
// //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
// //           <p className="text-white text-xl bg-gray-700 px-6 py-4 rounded">
// //             Loading...
// //           </p>
// //         </div>
// //       )}

// //       {/* Header */}
// //       <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 text-white p-4 rounded-xl shadow flex justify-between flex-col gap-4 mb-6">
// //         <div className="flex flex-row gap-2 items-center justify-between">
// //           <div className="flex gap-2 items-center">
// //             <div className="bg-blue-400 rounded-xl border border-blue-300 p-3">
// //               <Shield size={32} color="white" />
// //             </div>
// //             <div className="flex flex-col">
// //               <h2 className="text-xl md:text-2xl font-bold">Users Management</h2>
// //               <p className="text-sm opacity-80">Manage system users</p>
// //             </div>
// //           </div>

// //           <button
// //             onClick={() => {
// //               resetForm();
// //               setShowForm(true);
// //             }}
// //             className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
// //           >
// //             <PlusCircle size={18} /> New User
// //           </button>
// //         </div>

// //         <div className="flex flex-col md:flex-row items-center justify-between gap-3">
// //           <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
// //             <Search size={18} className="text-gray-500" />
// //             <input
// //               type="text"
// //               placeholder="Search users..."
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               className="flex-1 outline-none text-gray-700"
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       {/* Total count */}
// //       <div className="mb-2 font-semibold text-gray-700">
// //         Total Users: {users.length}
// //       </div>

// //       {/* Desktop Table */}
// //       <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
// //         <table className="w-full border-collapse">
// //           <thead>
// //             <tr className="bg-white text-left rounded text-sm md:text-base">
// //               <th className="p-3">ID</th>
// //               <th className="p-3">Name</th>
// //               <th className="p-3">Email</th>
// //               <th className="p-3">Mobile</th>
// //               <th className="p-3">Role</th>
// //               <th className="p-3 text-center">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredUsers.length > 0 ? (
// //               filteredUsers.map((u) => (
// //                 <tr key={u.id} className="hover:bg-gray-50 text-sm md:text-base">
// //                   <td className="p-3">{u.id}</td>
// //                   <td className="p-3">{u.name}</td>
// //                   <td className="p-3">{u.email}</td>
// //                   <td className="p-3">{u.mobile_no}</td>
// //                   <td className="p-3">{role[u.role_id]?.name}</td>
// //                   <td className="p-3 flex justify-center gap-2">
// //                     <button
// //                       onClick={() => {
// //                         setEditData(u);
// //                         setShowForm(true);
// //                       }}
// //                       className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
// //                     >
// //                       <Edit size={14} /> Update
// //                     </button>
// //                     <button
// //                       onClick={() => setDeleteId(u.id)}
// //                       className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
// //                     >
// //                       <Trash2 size={14} /> Delete
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))
// //             ) : (
// //               <tr>
// //                 <td colSpan="6" className="text-center p-4">
// //                   No users found
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Mobile Card View */}
// //       <div className="md:hidden flex flex-col gap-4">
// //         {filteredUsers.length > 0 ? (
// //           filteredUsers.map((u) => (
// //             <div key={u.id} className="border rounded-lg shadow p-4 bg-white">
// //               <div className="flex justify-between items-center">
// //                 <div>
// //                   <p className="font-semibold">{u.name}</p>
// //                   <p className="text-gray-600 text-sm">{u.email}</p>
// //                 </div>
// //                 <button
// //                   onClick={() =>
// //                     setExpandedId(expandedId === u.id ? null : u.id)
// //                   }
// //                 >
// //                   <MoreVertical size={20} />
// //                 </button>
// //               </div>

// //               {expandedId === u.id && (
// //                 <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
// //                   <p>
// //                     <span className="font-semibold">Mobile: </span>
// //                     {u.mobile_no}
// //                   </p>
// //                   <p>
// //                     <span className="font-semibold">Role: </span>
// //                     {role[u.role_id]?.name}
// //                   </p>
// //                   <div className="flex gap-2 mt-2">
// //                     <button
// //                       onClick={() => {
// //                         setEditData(u);
// //                         setShowForm(true);
// //                       }}
// //                       className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
// //                     >
// //                       <Edit size={16} /> Update
// //                     </button>
// //                     <button
// //                       onClick={() => setDeleteId(u.id)}
// //                       className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
// //                     >
// //                       <Trash2 size={16} /> Delete
// //                     </button>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           ))
// //         ) : (
// //           <p className="text-gray-500">No users found.</p>
// //         )}
// //       </div>

// //       {/* Add/Edit Modal */}
// //       {showForm && (
// //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
// //           <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
// //             <h3 className="text-lg font-semibold mb-4">
// //               {editData ? "Edit User" : "Add User"}
// //             </h3>
// //             <form onSubmit={handleSubmit} className="space-y-3">
// //               <input
// //                 type="text"
// //                 value={formData.name}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, name: e.target.value })
// //                 }
// //                 placeholder="Full Name"
// //                 className="w-full border p-2 rounded"
// //                 required
// //               />
// //               <input
// //                 type="email"
// //                 value={formData.email}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, email: e.target.value })
// //                 }
// //                 placeholder="Email"
// //                 className="w-full border p-2 rounded"
// //                 required
// //               />
// //               <input
// //                 type="text"
// //                 value={formData.mobile_no}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, mobile_no: e.target.value })
// //                 }
// //                 placeholder="Mobile Number"
// //                 className="w-full border p-2 rounded"
// //                 required
// //               />
// //               {!editData && (
// //                 <>
// //                   <input
// //                     type="password"
// //                     value={formData.password}
// //                     onChange={(e) =>
// //                       setFormData({ ...formData, password: e.target.value })
// //                     }
// //                     placeholder="Password"
// //                     className="w-full border p-2 rounded"
// //                     required
// //                   />
// //                   <input
// //                     type="password"
// //                     value={formData.password_confirmation}
// //                     onChange={(e) =>
// //                       setFormData({
// //                         ...formData,
// //                         password_confirmation: e.target.value,
// //                       })
// //                     }
// //                     placeholder="Confirm Password"
// //                     className="w-full border p-2 rounded"
// //                     required
// //                   />
// //                 </>
// //               )}
//               // <select
//               //   value={formData.role_id}
//               //   onChange={(e) =>
//               //     setFormData({ ...formData, role_id: e.target.value })
//               //   }
//               //   className="border p-2 rounded w-full"
//               //   required
//               // >
//               //   <option value="">Select Role</option>
//               //   {role &&
//               //     Object.values(role).map((r) => (
//               //       <option key={r.id} value={r.id}>
//               //         {r.name}
//               //       </option>
//               //     ))}
//               // </select>

// //               <div className="flex justify-end gap-2 pt-2">
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowForm(false)}
// //                   className="px-4 py-2 border rounded-xl"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
// //                 >
// //                   {editData ? "Update" : "Save"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}

// //       {/* Delete Confirmation Modal */}
// //       {deleteId && (
// //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
// //           <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
// //             <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
// //             <p className="mb-4">Are you sure you want to delete this user?</p>
// //             <div className="flex justify-end gap-2">
// //               <button
// //                 className="px-4 py-2 border rounded-xl"
// //                 onClick={() => setDeleteId(null)}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
// //                 onClick={() => handleDelete(deleteId)}
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }



