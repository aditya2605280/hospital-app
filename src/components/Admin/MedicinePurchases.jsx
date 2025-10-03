import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMedicinePurchases,
  insertMedicinePurchases,
  updateMedicinePurchases,
  deleteMedicinePurchases,
  fetchFrom,
  fetchBrands,
  fetchSupplier,
  fetchMedicine,
} from "../../redux/Slices/MedicinePurchasesSlice";
import {
  Search,
  Trash2,
  Edit,
  PlusCircle,
  MoreVertical,
  Shield,
  ChevronUp,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MedicinePurchases() {
  const dispatch = useDispatch();
  const { medicinePurchases, forms, brands, supplier, medicines, loading } =
    useSelector((state) => state.medicinePurchases);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    generic_name: "",
    hsn_code: "",
    units_per_strip: "",
    strips_per_box: "",
    total_boxes: "",
    sale_price: "",
    purchase_price: "",
    gst_percent: "",
    discount_percent: "",
    batch_number: "",
    expiry_date: "",
    manufacturer: "",
    reorder_level: "",
    storage_conditions: "",
    medicine_id: "",
    supplier_id: "",
    brand_id: "",
    form_id: "",
  });

  useEffect(() => {
    dispatch(fetchMedicinePurchases());
    dispatch(fetchFrom());
    dispatch(fetchBrands());
    dispatch(fetchSupplier());
    dispatch(fetchMedicine());
  }, [dispatch]);

  const filteredPurchases = medicinePurchases.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      generic_name: "",
      hsn_code: "",
      units_per_strip: "",
      strips_per_box: "",
      total_boxes: "",
      sale_price: "",
      purchase_price: "",
      gst_percent: "",
      discount_percent: "",
      batch_number: "",
      expiry_date: "",
      manufacturer: "",
      reorder_level: "",
      storage_conditions: "",
      medicine_id: "",
      supplier_id: "",
      brand_id: "",
      form_id: "",
    });
    setEditData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await dispatch(
          updateMedicinePurchases({ id: editData.id, payload: formData })
        ).unwrap();
        toast.success("Medicine purchase updated successfully! 🎉");
      } else {
        await dispatch(insertMedicinePurchases(formData)).unwrap();
        toast.success("Medicine purchase added successfully! 🎉");
      }
      resetForm();
      setShowForm(false);
      dispatch(fetchMedicinePurchases());
    } catch {
      toast.error(editData ? "Update failed 🚫" : "Add failed 🚫");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteMedicinePurchases(id)).unwrap();
      toast.success("Deleted successfully 🎉");
      dispatch(fetchMedicinePurchases());
    } catch {
      toast.error("Delete failed 🚫");
    }
    setDeleteId(null);
  };

  // Auto-fill when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        brand_id: editData.brand?.id || "",
        form_id: editData.form?.id || "",
        supplier_id: editData.supplier?.id || "",
        medicine_id: editData.medicine?.id || "",
      });
    }
  }, [editData]);

  return (
    <div className="p-4 md:px-2 bg-gray-100 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <p className="text-white text-xl bg-gray-700 px-6 py-4 rounded">
            Loading...
          </p>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 text-white p-4 rounded-xl shadow flex justify-between flex-col gap-4 mb-6">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-3">
              <Shield size={32} color="white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-bold">
                Medicine Purchases
              </h2>
              <p className="text-sm opacity-80">Manage purchased medicines</p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            <PlusCircle size={18} /> New Purchase
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search purchases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Total count */}
      <div className="mb-2 font-semibold text-gray-700">
        Total Purchases: {medicinePurchases.length}
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
        <table className="w-full border-collapse">
                        <thead>
              <tr className="bg-white text-left text-sm md:text-base">
              <th className="p-3">Name</th>
              <th className="p-3">Generic</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Form</th>
              <th className="p-3">Medicine</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Sale Price</th>
              <th className="p-3">Purchase Price</th>
              <th className="p-3">Expiry</th>
              <th className="p-3 text-center">Actions</th>              
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.length > 0 ? (
              filteredPurchases.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="hover:bg-gray-50 text-sm md:text-base"
                >
                  <td className="p-3">{purchase.name}</td>
                  <td className="p-3">{purchase.generic_name}</td>
                  <td className="p-3">{brands[purchase.brand_id]?.name}</td>
                  <td className="p-3">{forms[purchase.form_id]?.name}</td>
                  <td className="p-3">{medicines[purchase.medicine_id]?.brand_name}</td>
                  <td className="p-3">{supplier[purchase.supplier_id]?.name}</td>
                  <td className="p-3">{purchase.sale_price}</td>
                  <td className="p-3">{purchase.purchase_price}</td>
                  <td className="p-3">{purchase.expiry_date}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditData(purchase);
                        setShowForm(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
                    >
                      <Edit size={14} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(purchase.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No purchases found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredPurchases.length > 0 ? (
          filteredPurchases.map((purchase) => (
            <div key={purchase.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{purchase.name}</p>
                  <p className="text-gray-600 text-sm">
                    {brands[purchase.brand_id]?.name}
                  </p>
                </div>
                                  <button
                  onClick={() => setExpandedId(expandedId === purchase.id ? null : purchase.id)}
                  className={`transform transition-transform duration-300 ${
                  expandedId === purchase.id ? "rotate-180" : "rotate-0"
                  }`}
                  >
                  <ChevronUp size={20} />
                  </button>
                
              </div>

              {expandedId === purchase.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Generic: </span>
                    {purchase.generic_name}
                  </p>
                  <p>
                    <span className="font-semibold">Form: </span>
                    {forms[purchase.form_id]?.name}
                  </p>
                  <p>
                    <span className="font-semibold">Sale: </span>
                    {purchase.sale_price}
                  </p>
                  <p>
                    <span className="font-semibold">Purchase: </span>
                    {purchase.purchase_price}
                  </p>
                  <p>
                    <span className="font-semibold">Expiry: </span>
                    {purchase.expiry_date}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditData(purchase);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(purchase.id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No purchases found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editData ? "Edit Purchase" : "Add Purchase"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Medicine Name"
                className="w-full border p-2 rounded"
                required
              />


              {/* input in 2 field in row */}
             
              <input
                type="text"
                value={formData.generic_name}
                onChange={(e) =>
                  setFormData({ ...formData, generic_name: e.target.value })
                }
                placeholder="Generic Name"
                className="w-full border p-2 rounded"
              />

              {/* Brand */}
              <select
                value={formData.brand_id}
                onChange={(e) =>
                  setFormData({ ...formData, brand_id: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Brand</option>
                {Object.values(brands).map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              {/* Form */}
              <select
                value={formData.form_id}
                onChange={(e) =>
                  setFormData({ ...formData, form_id: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Form</option>
                {Object.values(forms).map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>

              {/* Supplier */}
              <select
                value={formData.supplier_id}
                onChange={(e) =>
                  setFormData({ ...formData, supplier_id: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Supplier</option>
                {Object.values(supplier).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              {/* Medicine */}
              <select
                value={formData.medicine_id}
                onChange={(e) =>
                  setFormData({ ...formData, medicine_id: e.target.value })
                }
                className="w-full  text-black border p-2 rounded"
              >
                <option value="">Select Medicine</option>
                {Object.values(medicines).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.brand_name}
                  </option>
                ))}
              </select>

              {/* Prices */}
            
                <input
                  type="number"
                  value={formData.sale_price}
                  onChange={(e) =>
                    setFormData({ ...formData, sale_price: e.target.value })
                  }
                  placeholder="Sale Price"
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  value={formData.purchase_price}
                  onChange={(e) =>
                    setFormData({ ...formData, purchase_price: e.target.value })
                  }
                  placeholder="Purchase Price"
                  className="w-full border p-2 rounded"
                  required
                />

          <input
          type="text"
          placeholder="Total boxes"
          value={formData.total_boxes}
          onChange={(e) =>
            setFormData({ ...formData, total_boxes: e.target.value })
          }
          className="border p-2 rounded"
        />
         <input
          type="text"
          placeholder="Unit per Strip"
          value={formData.units_per_strip}
          onChange={(e) =>
            setFormData({ ...formData, units_per_strip: e.target.value })
          }
          className="border p-2 rounded"
        />
         <input
          type="text"
          placeholder="Strips Per Box"
          value={formData.strips_per_box}
          onChange={(e) =>
            setFormData({ ...formData, strips_per_box: e.target.value })
          }
          className="border p-2 rounded"
        />

         <input
          type="text"
          placeholder="GST percentage"
          value={formData.gst_percent}
          onChange={(e) =>
            setFormData({ ...formData, gst_percent: e.target.value })
          }
          className="border p-2 rounded"
        />

         <input
          type="text"
          placeholder="Discount Percentage"
          value={formData.discount_percent}
          onChange={(e) =>
            setFormData({ ...formData, discount_percent: e.target.value })
          }
          className="border p-2 rounded"
        />

         <input
          type="text"
          placeholder="Batch Number"
          value={formData.batch_number}
          onChange={(e) =>
            setFormData({ ...formData, batch_number: e.target.value })
          }
          className="border p-2 rounded"
        />

         <input
          type="date"
          placeholder="Expiry Date"
          value={formData.expiry_date}
          onChange={(e) =>
            setFormData({ ...formData, expiry_date: e.target.value })
          }
          className="border p-2 rounded"
        />

          <input
          type="date"
          placeholder="Manufacture"
          value={formData.manufacturer}
          onChange={(e) =>
            setFormData({ ...formData, manufacturer: e.target.value })
          }
          className="border p-2 rounded"
        />

          <input
          type="text"
          placeholder="Recorder Level"
          value={formData.reorder_level}
          onChange={(e) =>
            setFormData({ ...formData, reorder_level: e.target.value })
          }
          className="border p-2 rounded"
        />
         <input
          type="text"
          placeholder="Storage Condition"
          value={formData.storage_conditions}
          onChange={(e) =>
            setFormData({ ...formData, storage_conditions: e.target.value })
          }
          className="border p-2 rounded"
        />
        
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
                >
                  {editData ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete this purchase?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded-xl"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                onClick={() => handleDelete(deleteId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchMedicinePurchases,
//   insertMedicinePurchases,
//   updateMedicinePurchases,
//   deleteMedicinePurchases,
//   fetchFrom,
//   fetchBrands,
//   fetchSupplier,
//   fetchMedicine,
// } from "../Slice/MedicinePurchasesSlice";
// import { Search, Trash2, Edit, PlusCircle } from "lucide-react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const MedicinePurchases = () => {
//   const dispatch = useDispatch();
//   const { medicinePurchases, forms, brands,supplier, medicines,  } = useSelector(
//     (state) => state.medicinePurchases
//   );

//   const [searchTerm, setSearchTerm] = useState("");
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     id: "",
//     name: "",
//     generic_name: "",
//     hsn_code: "",
//     units_per_strip: "",
//     strips_per_box: "",
//     total_boxes: "",
//     sale_price: "",
//     purchase_price: "",
//     gst_percent: "",
//     discount_percent: "",
//     batch_number: "",
//     expiry_date: "",
//     manufacturer: "",
//     reorder_level: "",
//     storage_conditions: "",
//     medicine_id: "",
//     supplier_id: "",
//     brand_id: "",
//     form_id: "",
//   });

//   useEffect(() => {
//     dispatch(fetchMedicinePurchases());
//     dispatch(fetchFrom());
//     dispatch(fetchBrands());
//     dispatch(fetchMedicine());
//     dispatch(fetchSupplier());
//   }, [dispatch]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (editMode) {
//       dispatch(updateMedicinePurchases({ id: formData.id, payload: formData }))
//         .unwrap()
//         .then(() => {
//           toast.success("Medicine Purchase updated successfully");
//           resetForm();
//         })
//         .catch(() => toast.error("Failed to update"));
//     } else {
//       dispatch(insertMedicinePurchases(formData))
//         .unwrap()
//         .then(() => {
//           toast.success("Medicine Purchase added successfully");
//           resetForm();
//         })
//         .catch(() => toast.error("Failed to add"));
//     }
//   };

//   const handleEdit = (purchase) => {
//     setEditMode(true);
//     setFormData({
//       ...purchase,
//       brand_id: purchase.brand?.id || "",
//       form_id: purchase.form?.id || "",
//       supplier_id:purchase.supplier||" ",
//       medicines_id:purchase.medicines||""

//     });
//   };

//   const handleDelete = (id) => {
//     dispatch(deleteMedicinePurchases(id))
//       .unwrap()
//       .then(() => toast.success("Deleted successfully"))
//       .catch(() => toast.error("Delete failed"));
//   };

//   const resetForm = () => {
//     setEditMode(false);
//     setFormData({
//       id: "",
//       name: "",
//       generic_name: "",
//       hsn_code: "",
//       units_per_strip: "",
//       strips_per_box: "",
//       total_boxes: "",
//       sale_price: "", 
//       purchase_price: "",
//       gst_percent: "",
//       discount_percent: "",
//       batch_number: "",
//       expiry_date: "",
//       manufacturer: "",
//       reorder_level: "",
//       storage_conditions: "",
//       medicine_id: "",
//       supplier_id: "",
//       brand_id: "",
//       form_id: "",
//     });
//   };

//   const filteredData = medicinePurchases.filter((item) =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-6">
//       <ToastContainer />
//       <h2 className="text-xl font-bold mb-4">Medicine Purchases</h2>

//       {/* Search + Add */}
//       <div className="flex justify-between mb-4">
//         <div className="flex items-center gap-2 border px-2 rounded">
//           <Search className="w-4 h-4" />
//           <input
//             type="text"
//             placeholder="Search medicine..."
//             className="outline-none p-1"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <button
//           onClick={resetForm}
//           className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
//         >
//           <PlusCircle size={16} /> Add New
//         </button>
//       </div>

//       {/* Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded mb-6"
//       >
//         <input
//           type="text"
//           placeholder="Medicine Name"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="text"
//           placeholder="Generic Name"
//           value={formData.generic_name}
//           onChange={(e) =>
//             setFormData({ ...formData, generic_name: e.target.value })
//           }
//           className="border p-2 rounded"
//         />

         

//         {/* Dropdowns */}
//         {/* <select
//           value={formData.brand_id}
//           onChange={(e) =>
//             setFormData({ ...formData, brand_id: e.target.value })
//           }
//           className="border p-2 rounded"
//           required
//         >
//           <option value="">Select Brand</option>
//           {Object.values(brands).map((brand) => (
//             <option key={brand.id} value={brand.id}>
//               {brand.name}
//             </option>
//           ))}
//         </select>

//         <select
//           value={formData.form_id}
//           onChange={(e) =>
//             setFormData({ ...formData, form_id: e.target.value })
//           }
//           className="border p-2 rounded"
//           required
//         >
//           <option value="">Select Form</option>
//           {Object.values(forms).map((form) => (
//             <option key={form.id} value={form.id}>
//               {form.name}
//             </option>
//           ))}
//         </select> */}

//         <input
//           type="text"
//           placeholder="HSN Code"
//           value={formData.hsn_code}
//           onChange={(e) =>
//             setFormData({ ...formData, hsn_code: e.target.value })
//           }
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           placeholder="Sale Price"
//           value={formData.sale_price}
//           onChange={(e) =>
//             setFormData({ ...formData, sale_price: e.target.value })
//           }
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           placeholder="Purchase Price"
//           value={formData.purchase_price}
//           onChange={(e) =>
//             setFormData({ ...formData, purchase_price: e.target.value })
//           }
//           className="border p-2 rounded"
//         />
        //  <input
        //   type="text"
        //   placeholder="Total boxes"
        //   value={formData.total_boxes}
        //   onChange={(e) =>
        //     setFormData({ ...formData, total_boxes: e.target.value })
        //   }
        //   className="border p-2 rounded"
        // />
        //  <input
        //   type="text"
        //   placeholder="Unit per Strip"
        //   value={formData.units_per_strip}
        //   onChange={(e) =>
        //     setFormData({ ...formData, units_per_strip: e.target.value })
        //   }
        //   className="border p-2 rounded"
        // />
        //  <input
        //   type="text"
        //   placeholder="Strips Per Box"
        //   value={formData.strips_per_box}
        //   onChange={(e) =>
        //     setFormData({ ...formData, strips_per_box: e.target.value })
        //   }
        //   className="border p-2 rounded"
        // />

        //  <input
        //   type="text"
        //   placeholder="GST percentage"
        //   value={formData.gst_percent}
        //   onChange={(e) =>
        //     setFormData({ ...formData, gst_percent: e.target.value })
        //   }
        //   className="border p-2 rounded"
        // />

        //  <input
        //   type="text"
        //   placeholder="Discount Percentage"
        //   value={formData.discount_percent}
        //   onChange={(e) =>
        //     setFormData({ ...formData, discount_percent: e.target.value })
        //   }
        //   className="border p-2 rounded"
        // />

        //  <input
        //   type="text"
        //   placeholder="Batch Number"
        //   value={formData.batch_number}
        //   onChange={(e) =>
        //     setFormData({ ...formData, batch_number: e.target.value })
        //   }
        //   className="border p-2 rounded"
        // />

        //  <input
        //   type="date"
        //   placeholder="Expiry Date"
        //   value={formData.expiry_date}
        //   onChange={(e) =>
        //     setFormData({ ...formData, expiry_date: e.target.value })
        //   }
        //   className="border p-2 rounded"
        // />

        //   <input
        //   type="date"
        //   placeholder="Manufacture"
        //   value={formData.manufacturer}
        //   onChange={(e) =>
        //     setFormData({ ...formData, manufacturer: e.target.value })
        //   }
        //   className="border p-2 rounded"
        // />

        //   <input
        //   type="text"
        //   placeholder="Recorder Level"
        //   value={formData.reorder_level}
        //   onChange={(e) =>
        //     setFormData({ ...formData, reorder_level: e.target.value })
        //   }
        //   className="border p-2 rounded"
        // />
        //  <input
        //   type="text"
        //   placeholder="Storage Condition"
        //   value={formData.storage_conditions}
        //   onChange={(e) =>
        //     setFormData({ ...formData, storage_conditions: e.target.value })
        //   }
        //   className="border p-2 rounded"
        // />
       
//        <select
//           value={formData.brand_id}
//           onChange={(e) =>
//             setFormData({ ...formData, brand_id: e.target.value })
//           }
//           className="border p-2 rounded"
//           required
//         >
//           <option value="">Select Brand</option>
//           {Object.values(brands).map((brand) => (
//             <option key={brand.id} value={brand.id}>
//               {brand.name}
//             </option>
//           ))}
//         </select>

//         <select
//           value={formData.form_id}
//           onChange={(e) =>
//             setFormData({ ...formData, form_id: e.target.value })
//           }
//           className="border p-2 rounded"
//           required
//         >
//           <option value="">Select Form</option>
//           {Object.values(forms).map((form) => (
//             <option key={form.id} value={form.id}>
//               {form.name}
//             </option>
//           ))}
//         </select>

//          <select
//           value={formData.supplier_id}
//           onChange={(e) =>
//             setFormData({ ...formData, supplier_id: e.target.value })
//           }
//           className="border p-2 rounded"
//           required
//         >
//           <option value="">Select Supplier</option>
//           {Object.values(supplier).map((supplier) => (
//             <option key={supplier.id} value={supplier.id}>
//               {supplier.name}
//             </option>
//           ))}
//         </select>
//           <select
//           value={formData.medicine_id}
//           onChange={(e) =>
//             setFormData({ ...formData, medicine_id: e.target.value })
//           }
//           className="border p-2 rounded"
         
//         >
//           <option value="">Select Medicine</option>
//           {Object.values(medicines).map((medicine) => (
//             <option key={medicine.id} value={medicine.id}>
//               {medicine.name}
//             </option>
//           ))}
//         </select>
//         <button
//           type="submit"
//           className="bg-green-500 text-white px-4 py-2 rounded col-span-2"
//         >
//           {editMode ? "Update" : "Add"}
//         </button>
//       </form>

//       {/* Table */}
//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-200 text-left">
//             <th className="p-2">Name</th>
//             <th className="p-2">Generic</th>
//             <th className="p-2">Brand</th>
//             <th className="p-2">Form</th>
//             <th className="p-2">Sale Price</th>
//             <th className="p-2">Purchase Price</th>
//             <th className="p-2">Manufacturer</th>
//             <th className="p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((purchase) => (
//             <tr key={purchase.id} className="border-b">
//               <td className="p-2">{purchase.name}</td>
//               <td className="p-2">{purchase.generic_name}</td>
//               <td className="p-2">{brands[purchase.brand_id]?.name}</td>
//               <td className="p-2">{forms[purchase.form_id]?.name}</td>
//               <td className="p-2">{purchase.sale_price}</td>
//               <td className="p-2">{purchase.purchase_price}</td>
//                <td className="p-2">{purchase.manufacturer}</td>
//               <td className="p-2 flex gap-2">
//                 <button
//                   onClick={() => handleEdit(purchase)}
//                   className="text-blue-500"
//                 >
//                   <Edit size={16} />
//                 </button>
//                 <button
//                   onClick={() => handleDelete(purchase.id)}
//                   className="text-red-500"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </td>
//             </tr>
//           ))}
//           {filteredData.length === 0 && (
//             <tr>
//               <td colSpan="7" className="text-center p-4 text-gray-500">
//                 No medicines found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default MedicinePurchases;
