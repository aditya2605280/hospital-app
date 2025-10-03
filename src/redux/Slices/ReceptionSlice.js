import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// 🔑 Tokens
const empToken = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";

const clinic_id = "1";
const BASE_URL = "https://hospital.51development.shop/api";

// ✅ Axios instance
const Api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${empToken}`,
    "X-Clinic-ID": clinic_id,
  },
});

/* -------------------- Thunks -------------------- */

// 📌 Fetch Reception
export const fetchReceptions = createAsyncThunk(
  "receptions/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/receptions");
      console.log("Get",res.data.data);
      
      return res.data.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Insert Reception
export const insertReception = createAsyncThunk(
  "receptions/insertReception",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await Api.post("/receptions", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Update Reception
// Update Reception (only allowed fields)
export const updateReception = createAsyncThunk(
  "receptions/updateReception",
  async ({ user_id, payload }, { rejectWithValue }) => {
    try {
      const updatePayload = {
        address: payload.address,
        joining_date: payload.joining_date,
        shift: payload.shift,
        husband_or_father_name: payload.husband_or_father_name,
        qualification_id: payload.qualification_id,
        emergency_contact: payload.emergency_contact,
      };
      const res = await Api.put(`/receptions/${user_id}`, updatePayload);
      return { user_id, updated: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// 📌 Delete Employee
export const deleteReception = createAsyncThunk(
  "receptions/deleteReception",
  async (id, { rejectWithValue }) => {
    try {
      await Api.delete(`/receptions/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Fetch Users
export const fetchUsers = createAsyncThunk(
  "receptions/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/users`);
       
        
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Fetch Qualifications
export const fetchQualifications = createAsyncThunk(
  "receptions/fetchQualifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/qualifications`);
     
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


/* -------------------- Slice -------------------- */
const receptionSlice = createSlice({
  name: "receptions",
  initialState: {
   receptions: [],
    users: [], 
    qualifications:[] ,  // ✅ renamed for clarity
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Employees
      .addCase(fetchReceptions.fulfilled, (state, action) => {
     const data=   state.receptions = action.payload || [];
        console.log("Stste",data);
        
      })
            .addCase(insertReception.fulfilled, (state, action) => {
        if (action.payload?.data) {
            state.receptions.push(action.payload.data);
        }
        })
            .addCase(updateReception.fulfilled, (state, action) => {
        const { user_id, updated } = action.payload;
        const index = state.receptions.findIndex((e) => e.user_id === user_id);
        if (index !== -1) {
            state.receptions[index] = { ...state.receptions[index], ...updated };
        }
        })

      .addCase(deleteReception.fulfilled, (state, action) => {
        state.receptions = state.receptions.filter((e) => e.id !== action.payload);
      })

      // Users
      .addCase(fetchUsers.fulfilled, (state, action) => {
        action.payload.forEach((user) => {
          state.users[user.id] = user;
        });
      })

      // Qualifications ✅ fixed
      .addCase(fetchQualifications.fulfilled, (state, action) => {
        action.payload.forEach((q) => {
          state.qualifications[q.id] = q;
        });
      });
  },
});

export default receptionSlice.reducer;
