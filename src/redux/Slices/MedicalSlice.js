import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://hospital.51development.shop/api/medicals";
const TOKEN = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";
const clinic_id = "1";

const config = {
  headers: { 
    Authorization: `Bearer ${TOKEN}`,
    "X-Clinic-ID": clinic_id,
  },
};

// ----------------- Thunks -----------------

export const fetchAllItems = createAsyncThunk(
  "medical/fetchAllItems",
  async () => {
    const res = await axios.get(API_URL, config);
    console.log("API RESPONSE:", res.data);
    return res.data.data;
  }
);

export const fetchItemById = createAsyncThunk(
  "medical/fetchItemById",
  async (id) => {
    const res = await axios.get(`${API_URL}/${id}`, config);
    return res.data.data;
  }
);

export const addItem = createAsyncThunk(
  "medical/addItem",
  async (itemData) => {
    const res = await axios.post(API_URL, itemData, config);
    return res.data; // ✅ your slice already has this
  }
);

// ✅ Updated updateItem thunk
export const updateItem = createAsyncThunk(
  "medical/updateItem",
  async ({ id, name, address, city, state, email, phone }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", name);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("email", email);
      formData.append("phone", phone);

      const res = await axios.post(`${API_URL}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${TOKEN}`, // ✅ your slice had "token" typo
          "X-Clinic-ID": clinic_id,
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Return updated item directly
      return res.data.data;

    } catch (err) {
      // ✅ rejectWithValue allows your component catch() to work with toast
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteItem = createAsyncThunk(
  "medical/deleteItem",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`, config);
    return id;
  }
);

// ----------------- Slice -----------------

const medicalSlice = createSlice({
  name: "medical",
  initialState: {
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
  },
  reducers: {
    // optional: add synchronous reducers here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllItems.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.selectedItem = action.payload || null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload.data || action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const updatedItem = action.payload; // ✅ updated payload
        const index = state.items.findIndex((i) => i.id === updatedItem.id);
        if (index >= 0) state.items[index] = updatedItem; // ✅ fix: replace with updatedItem
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      })

      // ----------------- Matchers -----------------
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message; // ✅ use payload for rejectWithValue
        }
      );
  },
});

export default medicalSlice.reducer;
