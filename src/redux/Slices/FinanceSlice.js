import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// 🔑 Tokens
const empToken = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
const clinic_id = "1";
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

// 📌 Fetch 
// 📌 Fetch Finance Summary
export const fetchFinanceSummary = createAsyncThunk(
  "finance/fetchFinanceSummary",
  async (date, { rejectWithValue }) => {
    try {
      const res = await empApi.get(`/finance/summary?date=${date}`);
      console.log("Finance Summary API Response:", res.data.summary); // 👀 debug
      return res.data.summary; // assuming backend returns { data: {...} }
    } catch (err) {
      console.error("Finance Summary API Error:", err.response || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// 📌 Insert Employee
export const addExpense = createAsyncThunk(
  "finance/addExpense",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await empApi.post("/expense/add", payload);
       console.log(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addIncome= createAsyncThunk(
  "finance/addIncome",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await empApi.post("/income/add", payload);
      console.log(res.data);
      
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



/* -------------------- Slice -------------------- */
const FinanceSlice = createSlice({
  name: "finance",
  initialState: {
  finance: [],  // ✅ renamed for clarity
  expense:[],
  income:[],
 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Employees
      .addCase(fetchFinanceSummary.fulfilled, (state, action) => {
        state.finance = Array.isArray(action.payload)
      ? action.payload
      : [action.payload];
      })
      .addCase(addExpense .fulfilled, (state, action) => {
        state.expense.push(action.payload);
      }) 

      .addCase(addIncome .fulfilled, (state, action) => {
        state.income.push(action.payload);
      }) 
  },
});

export default FinanceSlice.reducer;
