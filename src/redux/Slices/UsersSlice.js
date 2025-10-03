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

// 📌 Fetch Users
export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await empApi.get(`/users`);
      console.log(res.data.data);
      
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Insert Employee
export const insertUser = createAsyncThunk(
  "users/insertUser",
  async (payload, { rejectWithValue }) => {
    try {
      const data = {
        name: payload.name,
        email: payload.email,
        mobile_no: payload.mobile_no,
        password: payload.password,
        password_confirmation: payload.password_confirmation,
        role_id: String(payload.role_id),
        clinic_id: String(payload.clinic_id || 1),
      };

      const res = await empApi.post("/add-users", data);
      return res.data.user || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Update Employee (General)
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = {
        name: payload.name,
        email: payload.email,
        mobile_no: payload.mobile_no,
        password: payload.password,
        password_confirmation: payload.password_confirmation,
        role_id: String(payload.role_id),
      };
      const res = await empApi.put(`/update-users/${id}`, data);
      return { id, updated: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Delete Employee
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await empApi.delete(`/delete-users/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Fetch Roles
export const fetchRole = createAsyncThunk(
  "users/fetchRole",
  async (_, { rejectWithValue }) => {
    try {
      const res = await empApi.get(`/roles`);
      return res.data.roles;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* -------------------- Extra Actions -------------------- */

// 🔹 Forgot Password
export const resetPassword = createAsyncThunk(
  "users/resetPassword",
  async ({email }, { rejectWithValue }) => {
    try {
      const res = await empApi.post(`/forgot-password/${email}`);
      console.log(email, res.data.message);
      
      return { email, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Change Password
export const updatePassword = createAsyncThunk(
  "users/updatePassword",
  async ({ id, old_password, new_password, new_password_confirmation}, { rejectWithValue }) => {
    try {
      const res = await empApi.post(`/change-password-users/${users_id}`, { old_password, new_password, new_password_confirmation });
      console.log(res.data.message );
      
      return { id, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Update Other Details (name, email, etc.)
export const updateUserDetails = createAsyncThunk(
  "users/updateUserDetails",
  async ({ id, details }, { rejectWithValue }) => {
    try {
      const res = await empApi.put(`/update-users/${id}`, details);
      return { id, updated: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Update Status (active/inactive)
export const updateUserStatus = createAsyncThunk(
  "users/updateUserStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await empApi.put(`/users/${id}/status`, { status });
      return { id, status: res.data.status };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* -------------------- Slice -------------------- */
const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    role: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.users = action.payload || [];
      })

      // 🔹 Insert
      .addCase(insertUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })

      // 🔹 Update
      .addCase(updateUser.fulfilled, (state, action) => {
        const { id, updated } = action.payload;
        const index = state.users.findIndex((e) => e.id === id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...updated };
        }
      })

      // 🔹 Delete
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((e) => e.id !== action.payload);
      })

      // 🔹 Roles
      .addCase(fetchRole.fulfilled, (state, action) => {
        state.role = action.payload || [];
      })

      /* -------------------- Extra Updates -------------------- */
      .addCase(updatePassword.fulfilled, (state, action) => {
        // nothing to change in state, only success message
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        // password reset triggered
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        const { id, updated } = action.payload;
        const index = state.users.findIndex((e) => e.id === id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...updated };
        }
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const index = state.users.findIndex((e) => e.id === id);
        if (index !== -1) {
          state.users[index].status = status;
        }
      });
  },
});

export default usersSlice.reducer;




// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// // 🔑 Tokens
// const empToken = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
// const user_token="eyJpdiI6IlhrK2RnUllLN3h6RitNSFVwdnpSM1E9PSIsInZhbHVlIjoia1VPeGdoRHVPaFZPdnlXV3ZyUkkySUFVNmhXSW42bkM2cE8xRUFkQmxtVT0iLCJtYWMiOiI2NWZiNGE4ZDI4NzZjY2NmZDUxNTI2MGJkZTkzZWZhZDQ3MzY2YjNmM2Q3YzYzNGM1MjRjYTZmNDk1MjgxYjY3IiwidGFnIjoiIn0=";
           
// const clinic_id = "1";
// const BASE_URL = "https://hospital.51development.shop/api";

// // ✅ Axios instance
// const empApi = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     Authorization: `Bearer ${empToken}`,
//     "X-Clinic-ID": clinic_id,
//   },
// });

// /* -------------------- Thunks -------------------- */

// // 📌 Fetch Users
// export const fetchUser = createAsyncThunk(
//   "users/fetchUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await empApi.get(`/users`);
//       console.log("users",res.data.data);
      
//       return res.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // 📌 Insert Employee
// // 🔹 Insert user → use /register
// export const insertUser = createAsyncThunk(
//   "users/insertUser",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const data = {
//         name: payload.name,
//         email: payload.email,
//         mobile_no: payload.mobile_no,
//         password: payload.password,
//         password_confirmation: payload.password_confirmation,
//         role_id: String(payload.role_id),
//         clinic_id: String(payload.clinic_id || 1),  // or correct clinic
//       };

//       console.log("📤 Payload for add-users:", data);

//       const res = await empApi.post("/add-users", data);
//       console.log("✅ Response from add-users:", res.data);

//       return res.data.user || res.data;
//     } catch (err) {
//       console.error("❗ 422 Error data:", err.response?.data);
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );


// // 📌 Update Employee
// export const updateUser = createAsyncThunk(
//   "users/updateUser",
//   async ({ id, payload }, { rejectWithValue }) => {
//     try {
//          const data = {
//         name: payload.name,
//         email: payload.email,
//         mobile_no: payload.mobile_no,
//         password: payload.password,
//         password_confirmation: payload.password_confirmation,
//         role_id: String(payload.role_id), // or correct clinic
//       };
//       const res = await empApi.put(`/update-users/${id}`,data);
//       console.log(res.data);
      
//       return { id, updated: res.data };
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // 📌 Delete Employee
// export const deleteUser = createAsyncThunk(
//   "users/deleteUser",
//   async (id, { rejectWithValue }) => {
//     try {
//      const resp= await empApi.delete(`/delete-users/${id}`);
//       console.log("delete",resp.data);
      
//       return id;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );


// export const fetchRole = createAsyncThunk(
//   "users/fetchRole",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await empApi.get(`/roles`);
//       console.log(res.data.roles);
//       return res.data.roles;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// /* -------------------- Slice -------------------- */
// const usersSlice = createSlice({
//   name: "users",
//   initialState: {
//     users: [], 
//     role: [],   // ✅ renamed for clarity
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Employees
//       .addCase(fetchUser.fulfilled, (state, action) => {
//         state.users = action.payload || [];
//       })
     
//       // Insert user
//       .addCase(insertUser.fulfilled, (state, action) => {
//         state.users.push(action.payload);
//       })

//       .addCase(updateUser.fulfilled, (state, action) => {
//         const { id, updated } = action.payload;
//         const index = state.users.findIndex((e) => e.id === id);
//         if (index !== -1) {
//           state.employees[index] = { ...state.users[index], ...updated };
//         }
//       })
//       .addCase(deleteUser.fulfilled, (state, action) => {
//         state.users = state.users.filter((e) => e.id !== action.payload);
//       })

//       // Users
//      .addCase(fetchRole.fulfilled, (state, action) => {
//   if (Array.isArray(action.payload)) {
//     action.payload.forEach((r) => {
//       state.role[r.id] = r;
//     });
//   }
//   })

//   },
// });

// export default usersSlice.reducer;


