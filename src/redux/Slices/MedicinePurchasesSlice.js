import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// 🔑 Tokens
const empToken = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
const clinic_id = "4";
const BASE_URL = "https://hospital.51development.shop/api";

// ✅ Axios instance
const empApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${empToken}`,
    "X-Clinic-ID": clinic_id,
  },
});

/* -------------------- Thunks -------------------- */

// 📌 Fetch Employees
export const fetchMedicinePurchases = createAsyncThunk(
  "MedicinePurchases/fetchMedicinePurchases",
  async (_, { rejectWithValue }) => {
    try {
      const res = await empApi.get("/medicine-purchases");
      console.log("medicinepurchases",res.data.data);
      
      return res.data.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Insert Employee
export const insertMedicinePurchases = createAsyncThunk(
  "MedicinePurchases/insertEmployee",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await empApi.post("/medicine-purchases", payload);
      console.log(res.data);
      
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Update Employee
export const updateMedicinePurchases = createAsyncThunk(
  "MedicinePurchases/updateEmployee",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await empApi.put(`/medicine-purchases/${id}`, payload);
      return { id, updated: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Delete Employee
export const deleteMedicinePurchases = createAsyncThunk(
  "MedicinePurchases/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      await empApi.delete(`/medicine-purchases/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Fetch Users
export const fetchFrom = createAsyncThunk(
  "MedicinePurchases/fetchFrom",
  async (_, { rejectWithValue }) => {
    try {
      const res = await empApi.get(`/forms`);
      //console.log("",res.data);
      
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// 📌 Fetch Labs
export const fetchBrands = createAsyncThunk(
  "MedicinePurchases/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const res = await empApi.get(`/brands`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchSupplier = createAsyncThunk(
  "MedicinePurchases/fetchSupplier",
  async (_, { rejectWithValue }) => {
    try {
      const res = await empApi.get(`/suppliers`);
      console.log(res.data);
      
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchMedicine = createAsyncThunk(
  "Labs/fetchMedicine",
  async (_, { rejectWithValue }) => {
    try {
      const res = await empApi.get(`/medicines`);
      console.log("medicies",res.data);
      
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* -------------------- Slice -------------------- */
const MedicinePurchasesSlice = createSlice({
  name: "medicinePurchases",
  initialState: {
    medicinePurchases: [],
    forms: [], 
    brands: [],
    supplier:[],
    medicines:[], 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Employees
      .addCase(fetchMedicinePurchases.fulfilled, (state, action) => {
        state.medicinePurchases = action.payload || [];
      })
      .addCase(insertMedicinePurchases.fulfilled, (state, action) => {
        state.medicinePurchases.push(action.payload);
      })
      .addCase(updateMedicinePurchases.fulfilled, (state, action) => {
        const { id, updated } = action.payload;
        const index = state.medicinePurchases.findIndex((e) => e.id === id);
        if (index !== -1) {
          state.medicinePurchases[index] = { ...state.medicinePurchases[index], ...updated };
        }
      })
      .addCase(deleteMedicinePurchases.fulfilled, (state, action) => {
        state.medicinePurchases = state.medicinePurchases.filter((e) => e.id !== action.payload);
      })

      // Users
      .addCase(fetchFrom.fulfilled, (state, action) => {
        action.payload.forEach((from) => {
          state.forms[from.id] = from;
        });
      })

       .addCase(fetchSupplier.fulfilled, (state, action) => {
        action.payload.forEach((supplier) => {
          state.supplier[supplier.id] = supplier;
        });
      })

      .addCase(fetchMedicine.fulfilled, (state, action) => {
        action.payload.forEach((medicine) => {
          state.medicines[medicine.id] = medicine;
        });
      })

      // Labs
      .addCase( fetchBrands.fulfilled, (state, action) => {
        action.payload.forEach((brands) => {
          state.brands[brands.id] = brands;
        });
    })
 },
});

export default MedicinePurchasesSlice.reducer;


