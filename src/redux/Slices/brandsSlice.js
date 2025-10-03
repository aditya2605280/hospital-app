import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
  const clinic_id = "1" ;


export const fetchData = createAsyncThunk("brand/fetchData", async (_, thunkAPI) => {
  try {
    const res = await axios.get("https://hospital.51development.shop/api/brands", {

      headers: { Authorization: `Bearer ${token}`, "X-Clinic-ID": clinic_id},
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const createUser = createAsyncThunk("brand/createUser", async (newUser, thunkAPI) => {
  try {
    const res = await axios.post("https://hospital.51development.shop/api/brands", newUser, {

      headers: { Authorization: `Bearer ${token}`, "X-Clinic-ID": clinic_id},
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});


export const updateUser = createAsyncThunk(
  "brand/updateUser",
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
        `https://hospital.51development.shop/api/brands/${id}`,
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

export const deleteUser = createAsyncThunk(
  "brand/deleteUser",
  async (id, thunkAPI) => {
    try {
      // Build FormData for Laravel-style delete
      const formData = new FormData();
      formData.append("_method", "DELETE");

      const res = await axios.post(
        `https://hospital.51development.shop/api/brands/${id}`,
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





const brandsSlice = createSlice({
    name : "brand",
    initialState : {
        data: [],
        loading : false,
        error : null,
    },
    reducers : {},
    extraReducers :(builder)=>{
        builder

      // pending: API started
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // fulfilled: API success
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data || [] ;
        console.log(action.payload.data,'payload data')
      })
      // rejected: API failed
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
    // for adduser api

       .addCase(createUser.fulfilled, (state, action) => {
        state.data.push(action.payload.data); 
      })

      // update User
    .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const { id, updatedUser } = action.payload;
        const index = state.data.findIndex((u) => u.id === parseInt(id));
        if (index !== -1) {
          state.data[index] = { ...state.data[index], ...updatedUser };
        }
      })

      //delete user
       .addCase(deleteUser.fulfilled, (state,action) =>{
        state.data = state.data.filter((u) => u.id !== action.payload.data);
      });
      
    }
})
export default brandsSlice.reducer;