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
export const fetchlabBooking = createAsyncThunk(
  "commission/fetchlabBooking",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/lab/bookings");
      // if API returns {data: []} → extract
      console.log(res.data);
      
      return res.data.data || res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Insert commission
export const insertlabBooking= createAsyncThunk(
  "labBooking/insertlabBooking",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await Api.post("/lab/bookings", payload);
      console.log(res.data);
      
      return res.data; // {message, data}
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update commission
export const updatelabBooking= createAsyncThunk(
  "labBooking/updatelabBooking",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await Api.put(`/lab/bookings/${id}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete commission
export const deletelabBooking = createAsyncThunk(
  "labBooking/deletelabBooking",
  async (id, { rejectWithValue }) => {
    try {
      const res = await Api.delete(`/lab/bookings/${id}`);
      return { id, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



// ------------------ Slice ------------------

const labBookingSlice = createSlice({
  name: "labBooking",
  initialState: {
    booking: [],  // ✅ always array    // ✅ object map
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch commission
      .addCase(fetchlabBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchlabBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload; // ✅ array
      })
      .addCase(fetchlabBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // insert commission
      .addCase(insertlabBooking.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.booking.push(action.payload.data);
        }
      })

      // update commission
      .addCase(updatelabBooking.fulfilled, (state, action) => {
        const updated = action.payload.data;
        const index = state.booking.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          state.booking[index] = updated;
        }
      })

      // delete commission
      .addCase(deletelabBooking.fulfilled, (state, action) => {
        state.booking = state. booking.filter(
          (c) => c.id !== action.payload.id
        );
      })
    },
});

export default labBookingSlice.reducer;






// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// // 🔑 Tokens
// const empToken = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
// const clinic_id = "4";
// const BASE_URL = "https://hospital.51development.shop/api";

// // ✅ Axios instance
// const Api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     Authorization: `Bearer ${empToken}`,
//     "X-Clinic-ID": clinic_id,
//   },
// });

// /* -------------------- Thunks -------------------- */

// export const fetchlabBooking = createAsyncThunk(
//   "labBooking/fetchlabBooking",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await Api.get("/lab/bookings");
//       console.log("booking",res.data);
      
//       return res.data.data; 
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );
// // 📌 Insert Prescription
// export const insertlabBooking = createAsyncThunk(
//   "labBooking/insertlabBooking",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await Api.post("/lab/bookings", payload);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// //update Prescription
// export const updatelabBooking = createAsyncThunk(
//   "labBooking/updatelabBooking",
//   async ({ user_id, payload }, { rejectWithValue }) => {
//     try {
//       const res = await Api.put(`/lab/bookings/${id}`, updatePayload);
//       return { user_id, updated: res.data };
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );


// // 📌 Delete Prescription
// export const deletelabBooking = createAsyncThunk(
//   "labBooking/deletelabBooking",
//   async (id, { rejectWithValue }) => {
//     try {
//       await Api.delete(`/lab/bookings/${id}`);
//       return id;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );



// /* -------------------- Slice -------------------- */
// const LabBookingSlice = createSlice({
//   name: "labBooking",
//     initialState: {
//     booking:[],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Employees
      

//       .addCase(fetchlabBooking.fulfilled, (state, action) => {
//        const data=  state.booking = action.payload || [];
//         console.log("State",data);
        
//       })
//             .addCase(insertlabBooking.fulfilled, (state, action) => {
//         if (action.payload?.data) {
//             state.booking.push(action.payload.data);
//         }
//         })
//             .addCase(updatelabBooking.fulfilled, (state, action) => {
//         const { user_id, updated } = action.payload;
//         const index = state.booking.findIndex((e) => e.user_id === user_id);
//         if (index !== -1) {
//             state.booking[index] = { ...state.booking[index], ...updated };
//         }
//         })

//       .addCase(deletelabBooking.fulfilled, (state, action) => {
//         state.booking = state.booking.filter((e) => e.id !== action.payload);
//       })
// },
// });

// export default LabBookingSlice.reducer;
