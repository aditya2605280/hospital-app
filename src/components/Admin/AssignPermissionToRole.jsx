import { useState, useEffect } from "react";
import { ArrowLeft, ShieldCheck, Save, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  assignPermissionsToRole,
  fetchAssignedPermissions,
  fetchPermissions,
} from "../../redux/Slices/permissionSlice";
import { toast } from "react-toastify";

const AssignPermissionToRole = ({ roleId, roleName, onClose }) => {
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());

  const { allPermissions, assignedPermissions, loading, error } = useSelector(
    (state) => state.permissions
  );

  const dispatch = useDispatch();

  // 🔹 Fetch permissions + assigned ones
  useEffect(() => {
    dispatch(fetchPermissions());
    dispatch(fetchAssignedPermissions(roleId));
  }, [dispatch, roleId]);

  useEffect(() => {
    setAvailablePermissions(allPermissions);
  }, [allPermissions]);

  // 🔹 Pre-check assigned permissions
  useEffect(() => {
    if (!allPermissions.length || !assignedPermissions.length) return;

    const matchedIds = allPermissions
      .filter((perm) => assignedPermissions.includes(perm.name))
      .map((perm) => perm.id);

    setSelectedPermissions(new Set(matchedIds));
  }, [allPermissions, assignedPermissions]);

  // 🔹 Group by category
  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    const category = permission.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(permission);
    return acc;
  }, {});

  const handleSelectAllCategory = (categoryPermissions, isChecked) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      categoryPermissions.forEach((permission) =>
        isChecked ? newSet.add(permission.id) : newSet.delete(permission.id)
      );
      return newSet;
    });
  };

  const isAllSelectedInCategory = (categoryPermissions) =>
    categoryPermissions.every((p) => selectedPermissions.has(p.id));

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      newSet.has(permissionId) ? newSet.delete(permissionId) : newSet.add(permissionId);
      return newSet;
    });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await dispatch(
        assignPermissionsToRole({
          roleId,
          permissions: Array.from(selectedPermissions),
        })
      ).unwrap();

      toast.success(`✅ Permissions for '${roleName}' updated successfully!`);
      onClose();
    } catch (err) {
      toast.error(`❌ Failed to update permissions: ${err.message || "Server error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // 🔹 Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-100 border border-red-200 p-4 rounded">
          <p className="text-red-700 font-semibold">
            Error: {error.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-5xl mx-auto my-6">
      {/* Header */}
      <div className="flex items-center space-x-4 border-b border-gray-200 pb-4 mb-6">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Assign Permissions for:
            </h2>
            <p className="text-2xl text-gray-500 font-medium capitalize">
              {roleName}
            </p>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="space-y-10">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-1">
          Available Permissions
        </h3>

        {Object.entries(groupedPermissions).length === 0 ? (
          <p className="text-gray-500 italic">No permissions available.</p>
        ) : (
          Object.entries(groupedPermissions).map(([category, permissions]) => (
            <div
              key={category}
              className="space-y-4 border-2 hover:shadow-lg p-6 rounded-xl transition"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-md font-semibold text-gray-700 bg-gradient-to-r from-blue-50 via-white to-white px-3 py-1 rounded-md border border-blue-100">
                  {category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </h4>
                <label className="inline-flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
                    checked={isAllSelectedInCategory(permissions)}
                    onChange={(e) =>
                      handleSelectAllCategory(permissions, e.target.checked)
                    }
                  />
                  Select All
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {permissions.map((permission) => (
                  <label
                    key={permission.id}
                    htmlFor={`permission-${permission.id}`}
                    className="flex items-center p-3 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      id={`permission-${permission.id}`}
                      checked={selectedPermissions.has(permission.id)}
                      onChange={() => handlePermissionChange(permission.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {permission.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-8 border-t border-gray-200 justify-end sm:justify-start">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition"
          disabled={isSaving}
        >
          <X className="inline h-4 w-4 mr-2" />
          Cancel
        </button>
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="flex-1 sm:flex-none inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 focus:ring-2 focus:ring-blue-500 transition"
        >
          {isSaving ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AssignPermissionToRole;
