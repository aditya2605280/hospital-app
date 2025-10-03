"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Phone,
  Shield,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createUser,
  fetchUsers,
  clearUserError,
} from "../../redux/Slices/userSlice";
import { fetchRoles } from "../../redux/Slices/roleSlice";
import { toast } from "react-toastify";

const CreateUser = ({ onBack }) => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.user);
  const roles = useSelector((state) => state?.role?.roles || []);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    role_id: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    if (error) dispatch(clearUserError());
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearUserError());

    if (userData.password !== userData.password_confirmation) {
      toast.error("❌ Passwords do not match", { autoClose: 3000 });
      return;
    }

    try {
      await dispatch(createUser(userData)).unwrap();
      await dispatch(fetchUsers()).unwrap();

      toast.success("✅ User created successfully!", { autoClose: 2000 });

      setUserData({
        name: "",
        email: "",
        mobile_no: "",
        role_id: "",
        password: "",
        password_confirmation: "",
      });

      if (onBack) onBack();
    } catch (err) {
      toast.error(err?.message || "❌ Failed to create user", {
        autoClose: 4000,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4 mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Back to user list"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Create New User
          </h2>
          <p className="text-gray-600">
            Add a new user to the system with their details and role.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter full name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter email address"
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              name="mobile_no"
              value={userData.mobile_no}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter mobile number"
            />
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              name="role_id"
              value={userData.role_id}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors 
              appearance-none bg-white"
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter password"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password_confirmation"
                value={userData.password_confirmation}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Confirm password"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg 
            text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 
            focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg 
            hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 
            focus:ring-blue-500 transition-colors flex items-center"
          >
            {loading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
            Create User
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
