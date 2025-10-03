
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔑 Tokens & API
const token = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
const clinic_id = "1";
const BASE_URL = "https://hospital.51development.shop/api";

// ✅ Axios instance — DON'T set global Content-Type so FormData works
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    "X-Clinic-ID": clinic_id,
  },
});

// ================== Thunks ==================

// Fetch appointments
export const fetchAppointments = createAsyncThunk(
  "appointment/fetchAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/appointments");
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch doctors
export const fetchDoctors = createAsyncThunk(
  "appointment/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/doctors");
      const obj = {};
      (res.data?.data || []).forEach((d) => (obj[d.id] = d));
      console.log("Doctor",res.data.data);
      
      return obj;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch patients
export const fetchPatients = createAsyncThunk(
  "appointment/fetchPatients",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/patients");
      const obj = {};
      (res.data?.data || []).forEach((p) => (obj[p.id] = p));
      console.log("Patient",res.data.data);
      
      return obj;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Insert appointment
export const insertAppointment = createAsyncThunk(
  "appointment/insertAppointment",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/appointments", payload);
      return res.data?.data || payload;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update appointment (full update)
export const updateAppointment = createAsyncThunk(
  "appointment/updateAppointment",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/appointments/${id}`, payload);
      return res.data?.data || { id, ...payload };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update appointment status (server expects FormData; try PUT then POST fallback)
export const updateAppointmentStatus = createAsyncThunk(
  "appointment/updateAppointmentStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("status", status);

      // try PUT first
      try {
        const res = await axiosInstance.post(`/appointments/${id}/status`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // Some APIs return data in res.data.data, some in res.data
        return res.data?.data || res.data || { id, status };
      } catch (innerErr) {
        // if server responds 405 (method not allowed), try POST
        if (innerErr.response?.status === 405) {
          const res2 = await axiosInstance.post(
            `/appointments/${id}/status`,
            form,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          return res2.data?.data || res2.data || { id, status };
        }
        throw innerErr;
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete appointment
export const deleteAppointment = createAsyncThunk(
  "appointment/deleteAppointment",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/appointments/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ================== Slice ==================
const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    appointments: [],
    doctors: {},
    patients: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch doctors
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
      })

      // Fetch patients
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.patients = action.payload;
      })

      // Insert appointment
      .addCase(insertAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
      })

      // Update appointment (full update)
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const payload = action.payload || {};
        if (!payload.id) return;
        const idx = state.appointments.findIndex((a) => a.id === payload.id);
        if (idx !== -1) {
          state.appointments[idx] = { ...state.appointments[idx], ...payload };
        }
      })

      // Update appointment status
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const payload = action.payload || {};
        // Sometimes API returns the appointment object, sometimes minimal obj {id, status}
        const id = payload.id;
        const status = payload.status ?? (payload?.data && payload.data.status);
        if (!id) return;
        const idx = state.appointments.findIndex((a) => a.id === id);
        if (idx !== -1 && status !== undefined) {
          state.appointments[idx].status = status;
        }
      })

      // Delete appointment
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(
          (a) => a.id !== action.payload
        );
      });
  },
});

export default appointmentSlice.reducer;


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // 🔑 Tokens & API
// const token = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
// const clinic_id = "1";
// const BASE_URL = "https://hospital.51development.shop/api";

// // ✅ Axios instance
// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//     "X-Clinic-ID": clinic_id,
//   },
// });

// // ================== Thunks ==================

// // Fetch appointments
// export const fetchAppointments = createAsyncThunk(
//   "appointment/fetchAppointments",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.get("/appointments");
//       return res.data.data || [];
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // Fetch doctors
// export const fetchDoctors = createAsyncThunk(
//   "appointment/fetchDoctors",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.get("/doctors");
//       const obj = {};
//       (res.data.data || []).forEach((d) => (obj[d.id] = d));
//       return obj;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // Fetch patients
// export const fetchPatients = createAsyncThunk(
//   "appointment/fetchPatients",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.get("/patients");
//       const obj = {};
//       (res.data.data || []).forEach((p) => (obj[p.id] = p));
//       return obj;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // Insert appointment
// export const insertAppointment = createAsyncThunk(
//   "appointment/insertAppointment",
//   async (payload, { rejectWithValue }) => {
//     try {
        
//       const res = await axiosInstance.post("/appointments", payload);
//       return res.data.data || payload; // fallback
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // Update appointment (full update)
// export const updateAppointment = createAsyncThunk(
//   "appointment/updateAppointment",
//   async ({ id, payload }, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.put(`/appointments/${id}`, payload);
//       return res.data.data || { id, ...payload }; // fallback
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // Update appointment status (only status)
// export const updateAppointmentStatus = createAsyncThunk(
//   "appointment/updateAppointmentStatus",
//   async ({ id, status }, { rejectWithValue }) => {
//     try {
//           const formData = new FormData();
//       formData.append("status", status);
//       const res = await axiosInstance.p(`/appointments/${id}/status`, { formData });
//       console.log(res.data);
//       return res,status|| { id, status }; // fallback
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // Delete appointment
// export const deleteAppointment = createAsyncThunk(
//   "appointment/deleteAppointment",
//   async (id, { rejectWithValue }) => {
//     try {
//       await axiosInstance.delete(`/appointments/${id}`);
//       return id;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // ================== Slice ==================
// const appointmentSlice = createSlice({
//   name: "appointment",
//   initialState: {
//     appointments: [],
//     doctors: {},
//     patients: {},
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch appointments
//       .addCase(fetchAppointments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAppointments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.appointments = action.payload;
//       })
//       .addCase(fetchAppointments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch doctors
//       .addCase(fetchDoctors.fulfilled, (state, action) => {
//         state.doctors = action.payload;
//       })

//       // Fetch patients
//       .addCase(fetchPatients.fulfilled, (state, action) => {
//         state.patients = action.payload;
//       })

//       // Insert appointment
//       .addCase(insertAppointment.fulfilled, (state, action) => {
//         state.appointments.push(action.payload);
//       })

//       // Update appointment (full update)
//       .addCase(updateAppointment.fulfilled, (state, action) => {
//         if (!action.payload || !action.payload.id) return;
//         const index = state.appointments.findIndex(
//           (a) => a.id === action.payload.id
//         );
//         if (index !== -1) {
//           state.appointments[index] = {
//             ...state.appointments[index],
//             ...action.payload,
//           };
//         }
//       })

//       // Update appointment status
//       .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
//         if (!action.payload || !action.payload.id) return;
//         const index = state.appointments.findIndex(
//           (a) => a.id === action.payload.id
//         );
//         if (index !== -1) {
//           state.appointments[index].status = action.payload.status;
//         }
//       })

//       // Delete appointment
//       .addCase(deleteAppointment.fulfilled, (state, action) => {
//         state.appointments = state.appointments.filter(
//           (a) => a.id !== action.payload
//         );
//       });
//   },
// });

// export default appointmentSlice.reducer;



// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "axios";

// // // 🔑 Tokens & API
// // const token = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
// // const clinic_id = "1";
// // const BASE_URL = "https://hospital.51development.shop/api";

// // // ✅ Axios instance
// // const axiosInstance = axios.create({
// //   baseURL: BASE_URL,
// //   headers: {
// //     Authorization: `Bearer ${token}`,
// //     "Content-Type": "application/json",
// //     "X-Clinic-ID": clinic_id,
// //   },
// // });

// // // ================== Thunks ==================

// // // Fetch appointments
// // export const fetchAppointments = createAsyncThunk(
// //   "appointment/fetchAppointments",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const res = await axiosInstance.get("/appointments");
// //       return res.data.data || [];
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data || err.message);
// //     }
// //   }
// // );

// // // Fetch doctors
// // export const fetchDoctors = createAsyncThunk(
// //   "appointment/fetchDoctors",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const res = await axiosInstance.get("/doctors");
// //       const obj = {};
// //       (res.data.data || []).forEach(d => (obj[d.id] = d));
// //       return obj;
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data || err.message);
// //     }
// //   }
// // );

// // // Fetch patients
// // export const fetchPatients = createAsyncThunk(
// //   "appointment/fetchPatients",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const res = await axiosInstance.get("/patients");
// //       const obj = {};
// //       (res.data.data || []).forEach(p => (obj[p.id] = p));
// //       return obj;
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data || err.message);
// //     }
// //   }
// // );

// // // Insert appointment
// // export const insertAppointment = createAsyncThunk(
// //   "appointment/insertAppointment",
// //   async (payload, { rejectWithValue }) => {
// //     try {
// //       const res = await axiosInstance.post("/appointments", payload);
// //       return res.data.data || payload; // fallback
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data || err.message);
// //     }
// //   }
// // );

// // // Update appointment
// // export const updateAppointment = createAsyncThunk(
// //   "appointment/updateAppointment",
// //   async ({ id, payload }, { rejectWithValue }) => {
// //     try {
// //       const res = await axiosInstance.put(`/appointments/24/status${id}`, payload);
// //       console.log(res);
      
// //       return res.data.data || { id, ...payload }; // fallback
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data || err.message);
// //     }
// //   }
// // );

// // // Delete appointment
// // export const deleteAppointment = createAsyncThunk(
// //   "appointment/deleteAppointment",
// //   async (id, { rejectWithValue }) => {
// //     try {
// //       await axiosInstance.delete(`/appointments/${value}/status${id}`);
// //       return id;
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data || err.message);
// //     }
// //   }
// // );

// // // ================== Slice ==================
// // const appointmentSlice = createSlice({
// //   name: "appointment",
// //   initialState: {
// //     appointments: [],
// //     doctors: {},
// //     patients: {},
// //     loading: false,
// //     error: null,
// //   },
// //   reducers: {},
// //   extraReducers: (builder) => {
// //     builder
// //       // Fetch appointments
// //       .addCase(fetchAppointments.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchAppointments.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.appointments = action.payload;
// //       })
// //       .addCase(fetchAppointments.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       })

// //       // Fetch doctors
// //       .addCase(fetchDoctors.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchDoctors.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.doctors = action.payload;
// //       })
// //       .addCase(fetchDoctors.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       })

// //       // Fetch patients
// //       .addCase(fetchPatients.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchPatients.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.patients = action.payload;
// //       })
// //       .addCase(fetchPatients.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       })

// //       // Insert appointment
// //       .addCase(insertAppointment.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(insertAppointment.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.appointments.push(action.payload);
// //       })
// //       .addCase(insertAppointment.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       })

// //       // Update appointment
// //       .addCase(updateAppointment.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(updateAppointment.fulfilled, (state, action) => {
// //         state.loading = false;
// //         if (!action.payload || !action.payload.id) return;
// //         const index = state.appointments.findIndex(a => a.id === action.payload.id);
// //         if (index !== -1) {
// //           state.appointments[index] = {
// //             ...state.appointments[index],
// //             ...action.payload, // merge fallback
// //           };
// //         }
// //       })
// //       .addCase(updateAppointment.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       })

// //       // Delete appointment
// //       .addCase(deleteAppointment.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(deleteAppointment.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.appointments = state.appointments.filter(a => a.id !== action.payload);
// //       })
// //       .addCase(deleteAppointment.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       });
// //   },
// // });

// // export default appointmentSlice.reducer;


