import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, addItem, updateItem, deleteItem } from "../../redux/Slices/FormSlices";
import { toast } from "react-toastify";
import { Pen, Trash2, Plus, Search } from "lucide-react"; // added icons

const Form = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.Forms);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newFormName, setNewFormName] = useState("");
  const inputRef = useRef(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  useEffect(() => {
    if (showAddModal && inputRef.current) inputRef.current.focus();
  }, [showAddModal]);

  const handleAdd = () => {
    if (!newFormName.trim()) return toast.error("Form name cannot be empty!");

    dispatch(addItem(newFormName))
      .unwrap()
      .then(() => {
        toast.success("Data Added Successfully");
        dispatch(fetchData());
      })
      .catch(() => toast.error("Failed to Add Data"));

    setNewFormName("");
    setShowAddModal(false);
  };

  const handleUpdate = async () => {
    if (!editName.trim()) return toast.error("Name cannot be empty");

    await dispatch(updateItem({ id: editId, name: editName }))
      .unwrap()
      .then(() => toast.success("Data Updated Successfully"))
      .catch(() => toast.error("Failed to Update Data"));

    await dispatch(fetchData());
    setEditId(null);
    setEditName("");
  };

  const confirmDelete = (id) => {
    setDeleteTargetId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteItem(deleteTargetId))
      .unwrap()
      .then(() =>
        toast.success("Item Deleted Successfully", { style: { background: "green", color: "white" } })
      )
      .catch(() => toast.error("Failed to Delete Item"));

    setShowConfirmModal(false);
    setDeleteTargetId(null);
  };

  const filteredData = data.filter(
    (item) => typeof item.name === "string" && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="bg-blue-500 rounded-xl px-8 py-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Form List</h2>
            <p className="text-white text-sm mt-1">Manage system roles and permissions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white text-blue-500 font-semibold px-6 py-2 rounded hover:bg-gray-100 flex items-center gap-2 transition transform hover:scale-105 hover:shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Form
          </button>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white"
          />
        </div>
      </div>

      {/* Table-like Cards */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-s font-medium text-black uppercase">S.No</th>
              <th className="px-6 py-3 text-left text-s font-medium text-black uppercase">Name</th>
              <th className="px-16 py-3 text-right text-s font-medium text-black uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-blue-500">
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-red-500">
                  Error: {error}
                </td>
              </tr>
            )}
            {filteredData.length === 0 && !loading && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No forms found.
                </td>
              </tr>
            )}
            {filteredData.map((item, index) => (
              <tr
                key={item.id}
                className="hover:shadow-md hover:bg-gray-50 transition transform hover:-translate-y-0.5"
              >
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editId === item.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex justify-end gap-2">
                  {editId === item.id ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1 transition transform hover:scale-105 hover:shadow-md"
                      >
                        <Pen className="w-4 h-4" /> Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition transform hover:scale-105 hover:shadow-md"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(item.id);
                          setEditName(item.name);
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1 transition transform hover:scale-105 hover:shadow-md"
                      >
                        <Pen className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(item.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1 transition transform hover:scale-105 hover:shadow-md"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredData.map((item, index) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 shadow bg-white flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition transform"
          >
            <h3 className="text-lg font-semibold text-blue-600">
              {index + 1}. {item.name}
            </h3>
            <div className="flex justify-end gap-2 mt-2">
              {editId === item.id ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1 transition transform hover:scale-105 hover:shadow-md"
                  >
                    <Pen className="w-4 h-4" /> Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition transform hover:scale-105 hover:shadow-md"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditId(item.id);
                      setEditName(item.name);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1 transition transform hover:scale-105 hover:shadow-md"
                  >
                    <Pen className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(item.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1 transition transform hover:scale-105 hover:shadow-md"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Delete Modals remain unchanged */}
    </div>
  );
};

export default Form;
