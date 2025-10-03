import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://hospital.51development.shop/api";
const token = localStorage.getItem("token");
const clinic_id = localStorage.getItem("clinic_id");

// Fetch all roles
export const fetchRoles = createAsyncThunk(
  "role/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}`, "X-Clinic-ID": clinic_id },
      });
      return response.data.roles; // Assuming API returns { roles: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Role fetch failed");
    }
  }
);

// Create a new role
export const createRole = createAsyncThunk(
  "role/createRole",
  async (roleName, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/add-roles`,
        { name: roleName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Clinic-ID": clinic_id,
          },
        }
      );
      return response.data; // Assuming API returns { data: {id, name} }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Role creation failed");
    }
  }
);

// Delete role
export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async (roleId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/delete-roles/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Clinic-ID": clinic_id,
        },
      });
      return roleId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete role");
    }
  }
);

const roleSlice = createSlice({
  name: "role",
  initialState: {
    loading: false,
    error: null,
    roles: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create role
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.roles.push(action.payload.data);
        }
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete role
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((role) => role.id !== action.payload);
      });
  },
});

export default roleSlice.reducer;
