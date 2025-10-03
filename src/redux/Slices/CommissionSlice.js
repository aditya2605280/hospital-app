import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔑 Tokens & API
const token = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
const clinic_id = "1";
const BASE_URL = "https://hospital.51development.shop/api";

// ✅ Axios instance — DON'T set global Content-Type so FormData works
const Api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    "X-Clinic-ID": clinic_id,
  },
});

// ------------------ Async Thunks ------------------

// Fetch commissions
export const fetchCommission = createAsyncThunk(
  "commission/fetchCommission",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/commissions");
      // if API returns {data: []} → extract
      console.log(res.data);
      
      return res.data.data || res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Insert commission
export const insertCommission = createAsyncThunk(
  "commission/insertCommission",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await Api.post("/commissions", payload);
      return res.data; // {message, data}
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update commission
export const updateCommission = createAsyncThunk(
  "commission/updateCommission",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await Api.put(`/commissions/${id}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete commission
export const deleteCommission = createAsyncThunk(
  "commission/deleteCommission",
  async (id, { rejectWithValue }) => {
    try {
      const res = await Api.delete(`/commissions/${id}`);
      return { id, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update status
export const updateCommissionStatus = createAsyncThunk(
  "commission/updateCommissionStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await Api.post(`/commissions/${id}/mark-paid`, { status });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch doctors
export const fetchDoctors = createAsyncThunk(
  "commission/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/doctors");
      // Store as object keyed by id for easy lookup
      const doctorMap = {};
      (res.data.data || res.data).forEach((d) => {
        doctorMap[d.id] = d;
      });
      return doctorMap;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ------------------ Slice ------------------

const commissionSlice = createSlice({
  name: "commission",
  initialState: {
    commission: [],   // ✅ always array
    doctors: {},      // ✅ object map
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch commission
      .addCase(fetchCommission.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommission.fulfilled, (state, action) => {
        state.loading = false;
        state.commission = action.payload; // ✅ array
      })
      .addCase(fetchCommission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // insert commission
      .addCase(insertCommission.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.commission.push(action.payload.data);
        }
      })

      // update commission
      .addCase(updateCommission.fulfilled, (state, action) => {
        const updated = action.payload.data;
        const index = state.commission.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          state.commission[index] = updated;
        }
      })

      // delete commission
      .addCase(deleteCommission.fulfilled, (state, action) => {
        state.commission = state.commission.filter(
          (c) => c.id !== action.payload.id
        );
      })

      // update status
      .addCase(updateCommissionStatus.fulfilled, (state, action) => {
        const updated = action.payload.data;
        const index = state.commission.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          state.commission[index] = updated;
        }
      })

      // fetch doctors
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
      });
  },
});

export default commissionSlice.reducer;

