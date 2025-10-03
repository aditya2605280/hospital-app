import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const TOKEN = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
const clinic_id = "1";

const axiosInstance = axios.create({
  baseURL: "https://hospital.51development.shop/api",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "X-Clinic-ID": clinic_id,
  },
});

/* ------------------ Patients Thunks ------------------ */

// Fetch All Patients
export const fetchAllPatients = createAsyncThunk(
  "patients/fetchAll",
  async () => {
    const res = await axiosInstance.get("/patients");
    return res.data.data;
  }
);

// Fetch Patient by ID
export const fetchPatientById = createAsyncThunk(
  "patients/fetchById",
  async (id) => {
    const res = await axiosInstance.get(`/patients/${id}`);
    return res.data.data;
  }
);

// Add Patient
export const addPatient = createAsyncThunk(
  "patients/add",
  async (data, thunkAPI) => {
    try {
      // ✅ FormData added to fix doctor_id null issue
      const form = new FormData(); // ← change
      Object.keys(data).forEach((key) => {
        form.append(key, data[key] || "");
      }); // ← change

      const res = await axiosInstance.post("/patients", form); // ← change
      return res.data.data || res.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        error.message;
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// Update Patient
export const updatePatient = createAsyncThunk(
  "patients/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const form = new FormData(); // ← change
      form.append("_method", "PUT"); // ← change
      Object.keys(data).forEach((key) => {
        form.append(key, data[key] || "");
      }); // ← change

      const res = await axiosInstance.post(`/patients/${id}`, form); // ← change
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Delete Patient
export const deletePatient = createAsyncThunk(
  "patients/delete",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/patients/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/* ------------------ Doctors Thunk ------------------ */
export const fetchAllDoctors = createAsyncThunk(
  "patients/fetchAllDoctors",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/doctors");
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

/* ------------------ Slice ------------------ */
const patientsSlice = createSlice({
  name: "patients",
  initialState: {
    list: [],
    selectedPatient: null,
    doctors: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSelected: (state) => {
      state.selectedPatient = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Patients
      .addCase(fetchAllPatients.fulfilled, (state, action) => {
  // Map doctor info if returned as object
  state.list = action.payload.map((patient) => {
    // If patient.doctor exists, use its id
    if (patient.doctor) {
      return {
        ...patient,
        doctor_id: patient.doctor.id,
        doctor_name: patient.doctor.name,
      };
    }
    return patient;
  });
  state.loading = false;
})

      .addCase(fetchPatientById.fulfilled, (state, action) => {
  const patient = action.payload;
  if (patient.doctor) {
    state.selectedPatient = {
      ...patient,
      doctor_id: patient.doctor.id,
      doctor_name: patient.doctor.name,
    };
  } else {
    state.selectedPatient = patient;
  }
  state.loading = false;
})

      .addCase(addPatient.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.loading = false;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex((p) => p.id === updated.id);
        if (index !== -1) state.list[index] = updated;
        if (state.selectedPatient?.id === updated.id) {
          state.selectedPatient = updated;
        }
        state.loading = false;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
        if (state.selectedPatient?.id === action.payload) {
          state.selectedPatient = null;
        }
        state.loading = false;
      })
      // Doctors
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
        state.loading = false;
      });
  },
});

export const { clearSelected } = patientsSlice.actions;
export default patientsSlice.reducer;
