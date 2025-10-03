import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const empToken = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
const clinic_id = "1";
const BASE_URL = "https://hospital.51development.shop/api";

const empApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${empToken}`,
    "X-Clinic-ID": clinic_id,
  },
});

// FETCH
export const fetchLabsTests = createAsyncThunk(
  "labsTests/fetchLabsTests",
  async () => {
    const response = await empApi.get(`/lab-tests`);
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  }
);

// INSERT
export const insertLabsTests = createAsyncThunk(
  "labsTests/insert",
  async (payload) => {
    const response = await empApi.post(`/lab-tests`, payload);
    return response.data;
  }
);

// UPDATE
export const updateLabsTests = createAsyncThunk(
  "labsTests/updateLabsTests",
  async ({ id, payload }) => {
    const response = await empApi.put(`/lab-tests/${id}`, payload);
    return response.data;
  }
);

// DELETE
export const deleteLabsTests = createAsyncThunk(
  "labsTests/deleteLabsTests",
  async (id) => {
    await empApi.delete(`/lab-tests/${id}`);
    return id;
  }
);

// Slice
const LabTestSlice = createSlice({
  name: "labsTests",
  initialState: {
    labsTestsData: [], // ✅ must be an array
    loading: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // FETCH
    builder
      .addCase(fetchLabsTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLabsTests.fulfilled, (state, action) => {
        state.loading = false;
        state.labsTestsData = action.payload; // ✅ fixed
      })
      .addCase(fetchLabsTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // INSERT
    builder
      .addCase(insertLabsTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertLabsTests.fulfilled, (state, action) => {
        state.loading = false;
        state.labsTestsData.push(action.payload);
      })
      .addCase(insertLabsTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // UPDATE
    builder
      .addCase(updateLabsTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLabsTests.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.labsTestsData.findIndex(
          (test) => test.id === action.payload.id
        );
        if (index !== -1) state.labsTestsData[index] = action.payload; // ✅ fixed
      })
      .addCase(updateLabsTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // DELETE
    builder
      .addCase(deleteLabsTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLabsTests.fulfilled, (state, action) => {
        state.loading = false;
        state.labsTestsData = state.labsTestsData.filter(
          (test) => test.id !== action.payload
        );
      })
      .addCase(deleteLabsTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default LabTestSlice.reducer;


// // LabTestSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Base URL for API
//  const empToken = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";

// const clinic_id = "1";
// const BASE_URL = "https://hospital.51development.shop/api";

// // ✅ Axios instance
// const empApi = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     Authorization: `Bearer ${empToken}`,
//     "X-Clinic-ID": clinic_id,
//   },
// });// replace with your real API

// // ✅ Fetch all lab tests
// export const fetchLabsTests = createAsyncThunk(
//   "labsTests/fetchLabsTests",
//   async () => {
//     const response = await empApi.get(`/lab-tests`);
//     return response.data; // Assuming API returns an array of lab test objects
//   }
// );

// // ✅ Insert new lab test
// export const insertLabsTests = createAsyncThunk(
//   "labsTests/insert",
//   async (payload) => {
//     const response = await empApi.post(`/lab-tests`, payload);
//     return response.data;
//   }
// );

// // ✅ Update existing lab test
// export const updateLabsTests = createAsyncThunk(
//   "labsTests/updateLabsTests",
//   async ({ id, payload }) => {
//     const response = await empApi.put(`/lab-tests/${id}`, payload);
//     return response.data;
//   }
// );

// // ✅ Delete lab test
// export const deleteLabsTests = createAsyncThunk(
//   "labsTests/deleteLabsTests",
//   async (id) => {
//     await empApi.delete(`/lab-tests/${id}`);
//     return id; // return deleted id
//   }
// );

// // Initial state


// const LabTestSlice = createSlice({
//   name: "labsTests",
//   initialState:{
//     labsTestsData: [],
//     loading:null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     // FETCH
//     builder
//       .addCase(fetchLabsTests.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchLabsTests.fulfilled, (state, action) => {
//         state.loading = false;
//         state. labsTestsData = action.payload;
//       })
//       .addCase(fetchLabsTests.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });

//     // INSERT
//     builder
//       .addCase(insertLabsTests.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(insertLabsTests.fulfilled, (state, action) => {
//         state.loading = false;
//         state. labsTestsData.push(action.payload);
//       })
//       .addCase(insertLabsTests.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });

//     // UPDATE
//     builder
//       .addCase(updateLabsTests.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateLabsTests.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state. labsTestsData.findIndex(
//           (test) => test.id === action.payload.id
//         );
//         if (index !== -1) state.labsTests[index] = action.payload;
//       })
//       .addCase(updateLabsTests.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });

//     // DELETE
//     builder
//       .addCase(deleteLabsTests.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteLabsTests.fulfilled, (state, action) => {
//         state.loading = false;
//         state. labsTestsData = state. labsTestsData.filter(
//           (test) => test.id !== action.payload
//         );
//       })
//       .addCase(deleteLabsTests.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default LabTestSlice.reducer;
