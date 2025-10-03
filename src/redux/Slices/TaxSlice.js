import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://hospital.51development.shop/api/taxes";
const TOKEN = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
const CLINIC_ID = "1";

const config = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "X-Clinic-ID": CLINIC_ID,
  },
};

// 🔹 Fetch all Taxes
export const fetchTaxes = createAsyncThunk(
  "taxes/fetchTaxes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL, config);
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Insert Tax
export const insertTax = createAsyncThunk(
  "taxes/insertTax",
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

// 🔹 Update Tax (FIXED: send only allowed fields to avoid 422)
export const updateTax = createAsyncThunk(
  "taxes/updateTax",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // ✅ Only send name, group_id, percentage
      const payload = {
        name: data.name,
        group_id: data.group_id || null, // optional
        percentage: data.percentage,
      };
      const res = await axios.put(`${API_URL}/${id}`, payload, config);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Delete Tax
export const deleteTax = createAsyncThunk(
  "taxes/deleteTax",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      return id; // return deleted ID to remove from state
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const TaxesSlice = createSlice({
  name: "taxes",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch Taxes
      .addCase(fetchTaxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
      })
      .addCase(fetchTaxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Insert Tax
      .addCase(insertTax.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertTax.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.data.push(action.payload); // ✅ add newly inserted tax
        }
      })
      .addCase(insertTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Update Tax
      .addCase(updateTax.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTax.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((tax) => tax.id === action.payload.id);
        if (index >= 0) state.data[index] = action.payload; // ✅ replace only the updated tax
      })
      .addCase(updateTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Delete Tax
      .addCase(deleteTax.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTax.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((tax) => tax.id !== action.payload); // ✅ remove deleted tax
      })
      .addCase(deleteTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default TaxesSlice.reducer;
