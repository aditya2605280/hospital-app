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

// 📌 Fetch Doctor
export const fetchDoctor = createAsyncThunk(
  "doctor/fetchDoctor",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/doctors");
      console.log("Get",res.data.data);
      
      return res.data.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Insert D0ctor
export const insertDoctor = createAsyncThunk(
  "doctor/insertDoctor",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await Api.post("/doctors", payload);
      console.log(res.data.data);
      
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//update Doctor
export const updateDoctor = createAsyncThunk(
  "doctor/updateDoctor",
  async ({ user_id,payload }, { rejectWithValue }) => {
    try {
      const res = await Api.put(`/doctors/${user_id}`, payload);
      console.log(res.data);
      
      return { user_id, updated: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// 📌 Delete dooctor
export const deleteDoctor = createAsyncThunk(
  "doctor/deleteDoctor",
  async (id, { rejectWithValue }) => {
    try {
      await Api.delete(`/doctors/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Fetch Users
export const fetchUsers = createAsyncThunk(
  "doctor/fetchUsers",
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
  "doctor/fetchQualifications",
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
const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
   doctor: [],
    users: [], 
    qualifications:[] ,  // ✅ renamed for clarity
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Employees
      .addCase(fetchDoctor.fulfilled, (state, action) => {
     const data=   state.doctor = action.payload || [];
        console.log("Stste",data);
        
      })
            .addCase(insertDoctor.fulfilled, (state, action) => {
        if (action.payload?.data) {
            state.doctor.push(action.payload.data);
        }
        })
            .addCase(updateDoctor.fulfilled, (state, action) => {
        const { user_id, updated } = action.payload;
        const index = state.doctor.findIndex((e) => e.user_id === user_id);
        if (index !== -1) {
            state.doctor[index] = { ...state.doctor[index], ...updated };
        }
        })

      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.doctor = state.doctor.filter((e) => e.id !== action.payload);
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

export default doctorSlice.reducer;
