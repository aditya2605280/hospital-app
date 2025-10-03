import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// 🔑 Auth details
const token = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
const clinic_id = "1";

// 📌 Fetch
export const fetchdata = createAsyncThunk(
  "Supplier/fetchdata",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axios.get(
        "https://hospital.51development.shop/api/suppliers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Clinic-ID": clinic_id,
          },
        }
      );
      return resp.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//Insert
// Insert supplier
export const insertData = createAsyncThunk(
  "Supplier/insertData",
  async (formData, { rejectWithValue }) => {
    try {
      const resp = await axios.post(
        "https://hospital.51development.shop/api/suppliers",
        formData, // 👈 body data goes here
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Clinic-ID": clinic_id,
          },
        }
      );
       fetchdata();
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
//update
export const updateData = createAsyncThunk(
  "Supplier/updateData",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `https://hospital.51development.shop/api/suppliers/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Clinic-ID": clinic_id,
           
          },
        }
      );
      fetchdata();
      return { id, updated: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
//delete
export const deleteData =createAsyncThunk(
  "Supplier/deleteData",

async (id) => {
    try {
     const resp= await axios.delete(
        `https://hospital.51development.shop/api/suppliers/${id}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Clinic-ID": clinic_id,
          },
        }
      );
      fetchdata();
    } catch (err) {
      console.error("Error deleting:", err.response?.data || err.message);
    }
  }
)

const SupplierSlice = createSlice({
  name: "Supplier",
  initialState: {
    data: [],
    users:[],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
       
      .addCase(fetchdata.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data; // API returns { data: [...] }
      })
     
      // Insert data
      .addCase(insertData.pending, (state) => {
      
        state.success = false;
      })
      .addCase(insertData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // Optionally push new record into state.data (if API sends it back)
        if (action.payload?.newRecord) {
          state.users.push(action.payload.newRecord);
        }
      })
      .addCase(insertData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.success = false;
      })
       .addCase(updateData.fulfilled, (state, action) => {
      state.loading = false;
      const { id, updateData } = action.payload;
      const index = state.users.findIndex((u) => u.id === parseInt(id));
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...updateData };
      }
    })


    // ✅ Delete
    .addCase(deleteData.fulfilled, (state, action) => {
  state.users = state.users.filter((item) => item.id !== action.payload);
}); 
  },
});
  

export default SupplierSlice.reducer;
