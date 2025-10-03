import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://hospital.51development.shop/api";
const token = localStorage.getItem("token");
const clinic_id = localStorage.getItem("clinic_id");

// ---------------- CREATE USER ----------------
export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/add-users`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Clinic-ID": clinic_id,
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to create user";
      return rejectWithValue(errorMessage);
    }
  }
);

// ---------------- FETCH USERS ----------------
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Clinic-ID": clinic_id,
        },
      });
      
      
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch users";
      return rejectWithValue(errorMessage);
    }
  }
);

// ---------------- UPDATE USER ----------------
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Clinic-ID": clinic_id,
          "Content-Type": "multipart/form-data",
        },
      };

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append("_method", "PUT");

      const response = await axios.post(
        `${BASE_URL}/update-users/${id}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to update user";
      return rejectWithValue(errorMessage);
    }
  }
);

// ---------------- DELETE USER ----------------
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
     const response = await axios.delete(`${BASE_URL}/delete-users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Clinic-ID": clinic_id,
        },
      });

      console.log(response);
      
      return userId;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete user";
      return rejectWithValue(errorMessage);
    }
  }
);

// ---------------- TOGGLE USER STATUS ----------------
export const toggleUserStatus = createAsyncThunk(
  "user/toggleUserStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/users/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Clinic-ID": clinic_id,
          },
        }
      );
      return { id, status: response.data.status };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to toggle status";
      return rejectWithValue(errorMessage);
    }
  }
);

// ---------------- SLICE ----------------
const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false, // for create
    loading: false, // for fetch/update
    success: false,
    error: null,
    users: [],
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE USER
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // FETCH USERS
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE USER
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload?.user;
        if (updatedUser && Array.isArray(state.users)) {
          const index = state.users.findIndex((u) => u.id === updatedUser.id);
          if (index !== -1) {
            state.users[index] = updatedUser;
          }
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE USER
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // TOGGLE STATUS
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const user = state.users.find((u) => u.id === id);
        if (user) user.is_active = status;
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
