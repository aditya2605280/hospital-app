"use client"

import { useEffect, useState } from "react"
import { Search, Plus, Users, Trash2, Edit } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { fetchUsers, deleteUser, toggleUserStatus } from "../../redux/Slices/userSlice"
import UpdateUser from "./UpdateUser"
import CreateUser from "./CreateUser"
import { toast } from "react-toastify"

const UserManagement = () => {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState("")
  const { users, loading, error } = useSelector((state) => state.user || {})

  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showUpdateUser, setShowUpdateUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Fetch users
  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  // Show error in toast (instead of red box)
  useEffect(() => {
    if (error) {
      toast.error(error?.message || String(error) || "Something went wrong ❌")
    }
  }, [error])

  // Filtered users for search
  const filteredUsers =
    users?.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  // Handlers
  const handleCloseCreate = () => setShowCreateUser(false)

  const handleUpdateUser = (user) => {
    setSelectedUser(user)
    setShowUpdateUser(true)
  }

  const handleBackToList = () => {
    setShowUpdateUser(false)
    setSelectedUser(null)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await dispatch(deleteUser(id)).unwrap()
        toast.success("User deleted successfully 🩺")
        dispatch(fetchUsers())
      } catch (err) {
        toast.error(err?.message || "Failed to delete user ❌")
      }
    }
  }

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "1" ? "0" : "1"
    try {
      await dispatch(toggleUserStatus({ id, status: newStatus })).unwrap()
      toast.success(`User marked as ${newStatus === "1" ? "Active" : "Inactive"} ✅`)
      dispatch(fetchUsers())
    } catch (err) {
      toast.error(err?.message || "Failed to update status ❌")
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    )
  }

  // Switch Pages (Create / Update)
  if (showCreateUser) return <CreateUser onBack={handleCloseCreate} />
  if (showUpdateUser && selectedUser) return <UpdateUser user={selectedUser} onBack={handleBackToList} />

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">User Management</h1>
              <p className="text-blue-100 text-sm">Manage hospital staff & their access roles</p>
            </div>
          </div>

          {/* Add User */}
          <button
            onClick={() => setShowCreateUser(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors shadow-sm w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

     {/* Table / User List */}
<div className="p-2 sm:p-6">
  {filteredUsers.length > 0 ? (
    <div className="min-w-full">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                #
              </th>
              <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-2 sm:px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user, index) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-2 sm:px-3 md:px-6 py-4 text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-2 sm:px-3 md:px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="ml-2 sm:ml-3">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {user.name || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-0.5">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 md:px-6 py-4 text-sm text-gray-900 truncate">
                  {user.email}
                </td>
                <td className="px-2 sm:px-3 md:px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role?.name || "N/A"}
                  </span>
                </td>
                <td className="px-2 sm:px-3 md:px-6 py-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={user.status === "1"}
                      onChange={() =>
                        handleStatusToggle(user.id, user.status)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors relative">
                      <div
                        className={`absolute top-[2px] left-[2px] h-4 w-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
                          user.status === "1" ? "translate-x-5" : ""
                        }`}
                      ></div>
                    </div>
                  </label>
                </td>
                <td className="px-2 sm:px-3 md:px-6 py-4 text-center">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <button
                      onClick={() => handleUpdateUser(user)}
                      className="inline-flex items-center px-3 py-1 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-rose-600 transition"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    {/* Mobile Card View */}
<div className="space-y-4 md:hidden">
  {filteredUsers.map((user, index) => (
    <div
      key={user.id}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
    >
      {/* Top Row: Avatar + Name + Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {user.name || "N/A"}
            </h3>
            {/* Show Role here instead of Email */}
            <p className="text-sm text-gray-500 truncate">
              {user.role?.name || "N/A"}
            </p>
          </div>
        </div>

        {/* Status toggle aligned with username */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={user.status === "1"}
            onChange={() => handleStatusToggle(user.id, user.status)}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors relative">
            <div
              className={`absolute top-[2px] left-[2px] h-4 w-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
                user.status === "1" ? "translate-x-5" : ""
              }`}
            ></div>
          </div>
        </label>
      </div>

      {/* Email shown in badge style (instead of Role) */}
      <div className="mb-3">
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 truncate inline-block max-w-full">
          {user.email || "N/A"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleUpdateUser(user)}
          className="inline-flex items-center justify-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
        >
          <Edit className="h-4 w-4 mr-2" />
          Update
        </button>
        <button
          onClick={() => handleDelete(user.id)}
          className="inline-flex items-center justify-center px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-rose-600 transition"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </button>
      </div>
    </div>
  ))}
</div>

    </div>
  ) : (
    <div className="text-center py-12">
      <Users className="h-12 w-12 text-gray-300 mb-4" />
      <p className="text-gray-500 text-lg font-medium">No users found</p>
      <p className="text-gray-400 text-sm">
        {searchTerm ? "Try adjusting your search" : "Add your first hospital staff member"}
      </p>
    </div>
  )}
</div>

    </div>
  )
}

export default UserManagement
