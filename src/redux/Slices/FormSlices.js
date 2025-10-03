import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

        const token = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
        const clinic_id = "1";

//Thunk For Fetch data
export const fetchData = createAsyncThunk(
    "Forms/fetchData",
    async()=>{

        const res = await axios.get("https://hospital.51development.shop/api/forms?", {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Clinic-ID": clinic_id,
      },
    });

    return Array.isArray(res.data) ? res.data : res.data.data || [];
    }
);

// Add Item Async Thunk
export const addItem = createAsyncThunk(
  "Forms/addItem",
  async (name) => {

    const res = await axios.post(
      "https://hospital.51development.shop/api/forms",
      { name }, // Send new item name in body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Clinic-ID": clinic_id,
        },
      }
    );
    
    return res.data; // Newly created item from server
  }
);
    //Update
   export const updateItem = createAsyncThunk(
  "Forms/updateItem",
  async ({ id, name }) => {
    const token = "535|bCo4YR0OlQEVbAj5K9vpcO6q0vuSE5f4Qzclnm1If5d97144";
    const clinic_id = "1";

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", name);

    const res = await axios.post(
      `https://hospital.51development.shop/api/forms/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Clinic-ID": clinic_id,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("API Response (update):", res.data);

    return res.data;
  }
);


//Thunk Delete Item
export const deleteItem = createAsyncThunk(
    "Forms/deleteItem",
    async(id) =>{


        await axios.delete(
            `https://hospital.51development.shop/api/forms/${id}`,
            {
                headers:{
                    Authorization: `Bearer ${token}`,
                    "X-Clinic-ID" : clinic_id,
                },
            }
        );
        return id;
    }
);
 
//SLICES
const referenceSlice = createSlice({
    name:"Forms",
    initialState:{
        data:[],
        loading: false,
        error:null,
    },
    extraReducers: (builder)=>{
        builder
        .addCase(fetchData.pending, (state)=>{
            state.loading = true;
        })
        .addCase(fetchData.fulfilled, (state,action)=>{
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(fetchData.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
         .addCase(addItem.fulfilled, (state, action) => {
        state.data.push(action.payload); // Add new item to state
        })

        .addCase(updateItem.fulfilled, (state,action)=>{
            const index  = state.data.findIndex((item)=> item.id === action.payload.id);
            if (index !==1){
                state.data[index] = action.payload;
            }
        })

         .addCase(deleteItem.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
      });
    },
});

export default referenceSlice.reducer;