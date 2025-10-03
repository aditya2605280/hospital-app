import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// 🔑 Tokens
const empToken = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
const clinic_id = "4";
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

// 📌 Fetch Prescription
export const fetchPrescriptions = createAsyncThunk(
  "prescriptions/fetchPrescriptions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/prescriptions");
      console.log("Get",res.data.data);
      
      return res.data.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchlabBooking = createAsyncThunk(
  "prescriptions/fetchlabBooking",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/lab/bookings");
      console.log("booking",res.data);
      
      return res.data.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// 📌 Insert Prescription
export const insertPrescriptions = createAsyncThunk(
  "prescriptions/insertPrescriptions",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await Api.post("/prescriptions", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//update Prescription
export const updatePrescriptions = createAsyncThunk(
  "prescriptions/updatePrescriptions",
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
      const res = await Api.put(`/prescriptions/${user_id}`, updatePayload);
      return { user_id, updated: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// 📌 Delete Prescription
export const deletePresriptions = createAsyncThunk(
  "prescriptions/deletePresriptions",
  async (id, { rejectWithValue }) => {
    try {
      await Api.delete(`/prescriptions/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


//Appointment
//Appointment
export const fetchAppointments = createAsyncThunk(
  "prescriptions/fetchAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/appointments");
      console.log("appointments", res.data);
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



// 📌 Fetch Users
export const fetchLabsTests = createAsyncThunk(
  "prescriptions/fetchLabsTests",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/lab-tests`);
     
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Fetch Qualifications
export const fetchMedicines = createAsyncThunk(
  "prescriptions/fetchMedicines",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/medicines`);
     console.log("labtest",res.data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


/* -------------------- Slice -------------------- */
const prescriptionsSlice = createSlice({
  name: "prescriptions",
  initialState: {
  appointments:[],
  booking:[],
   prescriptions: [],
   LabsTests: [], 
    medicines:[] ,  // ✅ renamed for clarity
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Employees
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
       const data=   state.prescriptions = action.payload || [];
        console.log("Stste",data);
        
      })

      .addCase(fetchlabBooking.fulfilled, (state, action) => {
       const data=   state.booking = action.payload || [];
        console.log("State",data);
        
      })
            .addCase(insertPrescriptions.fulfilled, (state, action) => {
        if (action.payload?.data) {
            state.prescriptions.push(action.payload.data);
        }
        })
            .addCase(updatePrescriptions.fulfilled, (state, action) => {
        const { user_id, updated } = action.payload;
        const index = state.prescriptions.findIndex((e) => e.user_id === user_id);
        if (index !== -1) {
            state.prescriptions[index] = { ...state.prescriptions[index], ...updated };
        }
        })

      .addCase(deletePresriptions.fulfilled, (state, action) => {
        state.prescriptions = state.prescriptions.filter((e) => e.id !== action.payload);
      })

      // Labs-tests
     // Labs-tests
.addCase(fetchLabsTests.fulfilled, (state, action) => {
  state.LabsTests = action.payload || [];
})

// Medicines
.addCase(fetchMedicines.fulfilled, (state, action) => {
  state.medicines = action.payload || [];
})

// Appointments
.addCase(fetchAppointments.fulfilled, (state, action) => {
  state.appointments = action.payload || [];
})

},
});

export default prescriptionsSlice.reducer;
