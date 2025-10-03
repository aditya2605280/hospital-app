import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://hospital.51development.shop/api/tax-groups";
const TOKEN = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
const CLINIC_ID = "1";

const config = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "X-Clinic-ID": CLINIC_ID,
  },
};

// 🔹 Fetch all Tax-Group
export const fetchTaxGroups = createAsyncThunk(
  "taxGroups/fetchTaxGroups",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL, config);
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Insert Tax Group
export const insertTaxGroup = createAsyncThunk(
  "taxGroups/insertTaxGroup",
  async (formData, { rejectWithValue }) => {
    try {
      const payload = {
        ...formData,
        clinic_id: CLINIC_ID, // ensure clinic_id is sent
      };
      const res = await axios.post(API_URL, payload, config);
      return res.data.data; // return inserted tax
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Update Tax Group
export const updateTaxGroup = createAsyncThunk(
  "taxGroups/updateTaxGroup",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data, config);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Delete Tax Group
export const deleteTaxGroup = createAsyncThunk(
  "taxGroups/deleteTaxGroup",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const TaxGroupSlice = createSlice({
  name: "taxGroups",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch Tax groups
      .addCase(fetchTaxGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
      })
      .addCase(fetchTaxGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔹 Insert Tax-groups
        .addCase(insertTaxGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
        })
        .addCase(insertTaxGroup.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
        state.data.push(action.payload); // ✅ add newly inserted tax
        }
        })
        .addCase(insertTaxGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        })

              // 🔹 Update
      .addCase(updateTaxGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaxGroup.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((g) => g.id === action.payload.id);
        if (index >= 0) state.data[index] = action.payload;
      })
      .addCase(updateTaxGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      // 🔹 Delete
      .addCase(deleteTaxGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaxGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((g) => g.id !== action.payload);
      })
      .addCase(deleteTaxGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },
});

export default TaxGroupSlice.reducer;

