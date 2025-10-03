import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://api.allorigins.win/get?url=http://hospital.51development.shop/api";

const token = localStorage.getItem("token");
const clinic_id = localStorage.getItem("1");

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, userData, {
        headers: {
          "X-Clinic-ID": clinic_id, // 👈 send this
        },
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("clinic_id", res.data.clinic_id);
      console.log(res.data);

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const fetchLoggedInUser = createAsyncThunk(
  "auth/fetchLoggedInUser",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("http://hospital.51development.shop/api/me", {
        headers: { Authorization: `Bearer ${token}`, "X-Clinic-ID": clinic_id },
      });

      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    token: null,
    user: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      .addCase(fetchLoggedInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoggedInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchLoggedInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user";
      });
  },
});

export default authSlice.reducer;
