import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
const clinic_id = "1";

// Fetch commission settings
export const fetchData = createAsyncThunk(
  "commission_settings/fetchData",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        "https://hospital.51development.shop/api/commission-settings",
        {
          headers: { Authorization: `Bearer ${token}`, "X-Clinic-ID": clinic_id },
        }
      );
      return res.data; // res.data should contain { data: [...] }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Fetch doctors
export const fetchDoctors = createAsyncThunk(
  "commission_settings/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "https://hospital.51development.shop/api/doctors",
        {
          headers: { Authorization: `Bearer ${token}`, "X-Clinic-ID": clinic_id },
        }
      );
      const obj = {};
      (res.data?.data || []).forEach((d) => (obj[d.id] = d));
      return obj;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add new commission
export const createUser = createAsyncThunk(
  "commission_settings/createUser",
  async (newUser, thunkAPI) => {
    try {
      const res = await axios.post(
        "https://hospital.51development.shop/api/commission-settings",
        newUser,
        {
          headers: { Authorization: `Bearer ${token}`, "X-Clinic-ID": clinic_id },
        }
      );
      return res.data; // res.data should contain the new commission
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Update commission

export const updateUser = createAsyncThunk(
  "commission_settings/updateUser",
  async ({ id, updatedUser }, thunkAPI) => {
    try {
      const res = await axios.put(
        `https://hospital.51development.shop/api/commission-settings/${id}`,
        updatedUser, // send JSON directly
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Clinic-ID": clinic_id,
          },
        }
      );

      return { id, updatedUser, response: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Delete commission
export const deleteUser = createAsyncThunk(
  "commission_settings/deleteUser",
  async (id, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("_method", "DELETE"); // Laravel style

      const res = await axios.post(
        `https://hospital.51development.shop/api/commission-settings/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Clinic-ID": clinic_id,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return { id, response: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Slice
const CommissionSettingsSlice = createSlice({
  name: "commission_settings",
  initialState: {
    data: [],
    loading: false,
    error: null,
    labbookings: {}, // store fetched doctors
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Data
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data || [];
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Fetch Doctors
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload || {};
      })

      // Add User
      .addCase(createUser.fulfilled, (state, action) => {
        state.data.push(action.payload.data);
      })

      // Update User
     .addCase(updateUser.fulfilled, (state, action) => {
  state.loading = false;
  const { id, updatedUser } = action.payload;
  const index = state.data.findIndex((u) => u.id === parseInt(id));
  if (index !== -1) {
    state.data[index] = { ...state.data[index], ...updatedUser };
  }
})


      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = state.data.filter((u) => u.id !== action.payload.id);
      });
  },
});

export default CommissionSettingsSlice.reducer;
