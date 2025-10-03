// src/redux/slices/permissionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://hospital.51development.shop/api";
const token = localStorage.getItem("token");
const clinic_id = localStorage.getItem("clinic_id");

// 🚀 Async thunk to fetch all permissions
export const fetchPermissions = createAsyncThunk(
  "permissions/fetchPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/permissions`, {
        headers: { Authorization: `Bearer ${token}`, "X-Clinic-ID": clinic_id },
      });

      return response.data; // adjust based on actual API response shape
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Alreaddy Assigned Permissions for Roles

export const fetchAssignedPermissions = createAsyncThunk(
  "permissions/fetchAssignedPermissions",
  async (roleId) => {
    const response = await axios.get(`${BASE_URL}/role/${roleId}/permissions`, {
      headers: { Authorization: `Bearer ${token}`, "X-Clinic-ID": clinic_id },
    });

    return response.data.permissions; // assuming response.data = [ { id: 1, name: "Create" }, ... ]
  }
);

// for update Permissions to role
export const assignPermissionsToRole = createAsyncThunk(
  "permissions/assignPermissionsToRole",
  async ({ roleId, permissions }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/assign-multiple-permissions-to-role`,
        {
          role_id: roleId,
          permissions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Clinic-ID": clinic_id,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const permissionSlice = createSlice({
  name: "permissions",
  initialState: {
    allPermissions: [],
    assignedPermissions: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetAssignState: (state) => {
      state.success = false;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.allPermissions = action.payload.permissions;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // assigned permissions
    builder
      .addCase(fetchAssignedPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedPermissions = action.payload;
      })
      .addCase(fetchAssignedPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });

    // assigning permissions
    builder
      .addCase(assignPermissionsToRole.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(assignPermissionsToRole.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(assignPermissionsToRole.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetAssignState } = permissionSlice.actions;
export default permissionSlice.reducer;
