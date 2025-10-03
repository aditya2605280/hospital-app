import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://hospital.51development.shop/api/medicines";
const TOKEN = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
const CLINIC_ID = "1";

const config = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "X-Clinic-ID": CLINIC_ID,
  },
};

// 🔹 Fetch all medicines
export const fetchMedicines = createAsyncThunk(
  "medicines/fetchMedicines",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL, config);
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Insert medicine (total_quantity stays string)
export const insertMedicine = createAsyncThunk(
  "medicines/insertMedicine",
  async (formData, { rejectWithValue }) => {
    try {
      const payload = {
        ...formData,
        clinic_id: CLINIC_ID,
        total_quantity: formData.total_quantity || "0", // keep string
      };
      const res = await axios.post(API_URL, payload, config);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Update medicine
export const updateMedicine = createAsyncThunk(
  "medicines/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const payload = {
        ...data,
        clinic_id: CLINIC_ID,
        total_quantity: data.total_quantity || "0", // keep string
      };
      const res = await axios.put(`${API_URL}/${id}`, payload, config);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 Delete medicine
export const deleteMedicine = createAsyncThunk(
  "medicines/deleteMedicine",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const medicineSlice = createSlice({
  name: "medicines",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch medicines
      .addCase(fetchMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Insert medicine
      .addCase(insertMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertMedicine.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.data.push(action.payload);
        }
      })
      .addCase(insertMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Update medicine
      .addCase(updateMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMedicine.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((m) => m.id === action.payload.id);
        if (index >= 0) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Delete medicine
      .addCase(deleteMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default medicineSlice.reducer;
