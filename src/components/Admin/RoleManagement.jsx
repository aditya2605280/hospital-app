import { useState, useEffect } from "react";
import { Search, Shield, Plus, Settings, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { deleteRole, fetchRoles } from "../../redux/Slices/roleSlice";
import CreateRoleForm from "./CreateRoleForm";
import AssignPermissionToRole from "./AssignPermissionToRole";
import { toast } from "react-toastify";

const RoleManagement = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const roles = useSelector((state) => state.role?.roles || []);
  const loading = useSelector((state) => state.role?.loading);
  const error = useSelector((state) => state.role?.error);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); // { id, name }
  const [showAssignPermission, setShowAssignPermission] = useState(false);

  // Fetch roles on mount
  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  // Handle error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Filter roles based on search term
  const filteredRoles = roles.filter(
    (role) =>
      role?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete role
  const handleDeleteRole = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete role "${name}"?`
    );
    if (!confirmDelete) return;

    try {
      await dispatch(deleteRole(id)).unwrap();
      toast.success(`Role "${name}" deleted successfully.`);
      dispatch(fetchRoles()); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error(err || "Error deleting role.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading roles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showAssignPermission && selectedRole) {
    return (
      <AssignPermissionToRole
        roleId={selectedRole.id}
        roleName={selectedRole.name}
        onClose={() => setShowAssignPermission(false)}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/15 backdrop-blur-sm rounded-lg border border-white/20">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Role List</h1>
              <p className="text-blue-100 text-sm">
                Manage system roles and permissions
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateRoleModal(true)}
            className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Role
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Roles</p>
            <p className="text-lg font-semibold text-gray-800">
              {filteredRoles.length}
            </p>
          </div>
        </div>
      </div>

      {/* Role List */}
      <div className="p-2">
        {filteredRoles.length > 0 ? (
          <div className="space-y-4">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 sm:flex items-center justify-between"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-100">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                    </h3>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-row gap-2">
                  <button
                    onClick={() => {
                      setSelectedRole({ id: role.id, name: role.name });
                      setShowAssignPermission(true);
                    }}
                    className="inline-flex items-center justify-center px-3.5 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Assign Permission
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id, role.name)}
                    className="inline-flex items-center justify-center px-3.5 py-1.5 bg-rose-500 text-white text-sm font-medium rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Role
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-50 rounded-full mb-4 border border-blue-100">
                <Shield className="h-12 w-12 text-blue-500" />
              </div>
              <p className="text-gray-600 text-lg font-medium">No roles found</p>
              <p className="text-gray-500 text-sm">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Get started by creating your first role"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredRoles.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium text-blue-600">
                {filteredRoles.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-blue-600">{roles.length}</span>{" "}
              roles
            </p>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateRoleModal && (
        <CreateRoleForm onClose={() => setShowCreateRoleModal(false)} />
      )}
    </div>
  );
};

export default RoleManagement;
