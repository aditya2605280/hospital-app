"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { useDispatch } from "react-redux"
import { createRole, fetchRoles } from "../../redux/Slices/roleSlice";
import { toast } from "react-toastify"

const CreateRoleForm = ({ onClose }) => {
  const [roleName, setRoleName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!roleName.trim()) {
      toast.error("Role Name cannot be empty ❌")
      return
    }

    setIsSubmitting(true)
    try {
      await dispatch(createRole(roleName)).unwrap()
      await dispatch(fetchRoles()).unwrap()
      toast.success("Role created successfully ✅")
      onClose()
    } catch (err) {
      toast.error(err?.message || "Failed to create role ❌")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative border border-gray-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Create New Role
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="roleName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Role Name
            </label>
            <input
              type="text"
              id="roleName"
              name="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              outline-none transition-colors"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 
              font-medium rounded-lg hover:bg-gray-50 
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-blue-600 
              text-white font-medium rounded-lg hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-blue-500 disabled:opacity-50 
              disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRoleForm
