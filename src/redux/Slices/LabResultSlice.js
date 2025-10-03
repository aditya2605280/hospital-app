import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
const clinic_id = "1";

// Fetch
export const fetchData = createAsyncThunk(
  "labResult/fetchData",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        "https://hospital.51development.shop/api/lab/results",
        {
          headers: { Authorization: `Bearer ${token}`, "X-Clinic-ID": clinic_id },
        }
      );
      return res.data; // res.data should contain { data: [...] }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Fetch booking
export const fetchlabBooking = createAsyncThunk(
  "labResult/fetchlabBooking",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "https://hospital.51development.shop/api/lab/bookings",
        {
          headers: { Authorization: `Bearer ${token}`, "X-Clinic-ID": clinic_id },
        }
      );
      const obj = {};
      (res.data?.data || []).forEach((d) => (obj[d.id] = d));
      return obj;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



// Add new 
export const createUser = createAsyncThunk(
  "labResult/createUser",
  async (newUser, thunkAPI) => {
    try {
      const res = await axios.post(
        "https://hospital.51development.shop/api/lab/results",
        newUser,
        {
          headers: { Authorization: `Bearer ${token}`, "X-Clinic-ID": clinic_id },
        }
      );
      return res.data; // res.data should contain the new 
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

//update

export const updateUser = createAsyncThunk(
  "labResult/updateUser",
  async ({ id, updatedUser }, thunkAPI) => {
    try {
      // Build FormData
      const formData = new FormData();
      Object.keys(updatedUser).forEach((key) => {
        formData.append(key, updatedUser[key]);
      });

      // Add Laravel-style method override
      formData.append("_method", "PUT");

     const res = await axios.post(
  `https://hospital.51development.shop/api/lab/results/${id}`,
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Clinic-ID": clinic_id,
      "Content-Type": "multipart/form-data",
    },
  }
);


      return { id, updatedUser, response: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


// Delete 
export const deleteUser = createAsyncThunk(
  "labResult/deleteUser",
  async (id, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("_method", "DELETE"); // Laravel style

      const res = await axios.post(
        `https://hospital.51development.shop/api/lab/results/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Clinic-ID": clinic_id,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return { id, response: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Slice
const LabResultSlice = createSlice({
  name: "labResult",
  initialState: {
    data: [],
    loading: false,
    error: null,
    bookings: [], // store fetched bookings
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Data
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data || [];
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Add User
      .addCase(createUser.fulfilled, (state, action) => {
        state.data.push(action.payload.data);
      })

      // Update User
    .addCase(updateUser.fulfilled, (state, action) => {
  state.loading = false;
  const { id, updatedUser, response } = action.payload;
  const index = state.data.findIndex((u) => u.id === parseInt(id));
  if (index !== -1) {
    state.data[index] = { ...state.data[index], ...updatedUser };
  }
})


      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = state.data.filter((u) => u.id !== action.payload.id);
      })

      // Fetch Lab Bookings
      .addCase(fetchlabBooking.fulfilled, (state, action) => {
       state.bookings = action.payload || {};
    //    console.log(action.payload,"payload data")
})

      
  },
  
});

export default LabResultSlice.reducer;
