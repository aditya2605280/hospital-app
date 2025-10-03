import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFinanceSummary, addIncome, addExpense } from "../../redux/Slices/FinanceSlice";
import { fetchlabBooking } from "../../redux/Slices/LabBookingSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlusCircle, Search, Shield, ChevronUp } from "lucide-react";

const Finance = () => {
  const dispatch = useDispatch();
  const { finance = [] } = useSelector((state) => state.finance); // ✅ fallback to []
  const { booking = [] } = useSelector((state) => state.labBooking); // ✅ fallback to []

  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const [incomeForm, setIncomeForm] = useState({
    booking_id: "",
    amount: "",
    payment_mode: "",
    received_by: "",
    date: "",
  });

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    paid_to: "",
    date: "",
    notes: "",
  });

  // helper: format today's date
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  // set default date to today on mount
  useEffect(() => {
    if (!date) {
      setDate(getToday());
    }
  }, [date]);

  // Fetch bookings on mount
  useEffect(() => {
    dispatch(fetchlabBooking());
  }, [dispatch]);

  // Fetch finance summary whenever date changes
  useEffect(() => {
    if (!date) return;

    const loadFinance = async () => {
      try {
        await dispatch(fetchFinanceSummary(date)).unwrap();
        toast.success(`Finance summary loaded for ${date}`);
      } catch (err) {
        toast.error("Failed to fetch finance summary");
        console.error("Finance fetch error:", err);
      }
    };

    loadFinance();
  }, [date, dispatch]);

  const handleAddIncome = async () => {
    if (
      !incomeForm.booking_id ||
      !incomeForm.amount ||
      !incomeForm.payment_mode ||
      !incomeForm.received_by ||
      !incomeForm.date
    ) {
      toast.error("Please fill all income fields");
      return;
    }
    try {
      await dispatch(addIncome(incomeForm)).unwrap();
      toast.success("Income added successfully!");
      setShowIncomeForm(false);
      setIncomeForm({
        booking_id: "",
        amount: "",
        payment_mode: "",
        received_by: "",
        date: "",
      });
      if (date) dispatch(fetchFinanceSummary(date));
    } catch (err) {
      toast.error("Failed to add income");
      console.error("Income error:", err);
    }
  };

  const handleAddExpense = async () => {
    if (!expenseForm.title || !expenseForm.amount || !expenseForm.paid_to || !expenseForm.date) {
      toast.error("Please fill all expense fields");
      return;
    }
    try {
      await dispatch(addExpense(expenseForm)).unwrap();
      toast.success("Expense added successfully!");
      setShowExpenseForm(false);
      setExpenseForm({
        title: "",
        amount: "",
        paid_to: "",
        date: "",
        notes: "",
      });
      if (date) dispatch(fetchFinanceSummary(date));
    } catch (err) {
      toast.error("Failed to add expense");
      console.error("Expense error:", err);
    }
  };


  const filteredFinance = finance.filter((item) =>
    (item.date || "").toLowerCase().includes(search.toLowerCase())
  );

  
  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 text-white p-4 rounded-xl shadow flex justify-between flex-col gap-4 mb-6">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-3">
              <Shield size={32} color="white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-bold">Finance</h2>
              <p className="text-sm opacity-80">Finance Management</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowExpenseForm(true)}
              className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
            >
              <PlusCircle size={18} /> Add Expense
            </button>
            <button
              onClick={() => setShowIncomeForm(true)}
              className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
            >
              <PlusCircle size={18} /> Add Income
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Date Picker */}
      <div className="mb-4">
        <input
          type="date"
          value={date.replace(/\//g, "-")}
          onChange={(e) => setDate(e.target.value.replace(/-/g, "/"))}
          className="border p-2 rounded"
        />
      </div>

      {/* DESKTOP TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white text-left rounded text-sm md:text-base">
              <th className="p-3">ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total Income</th>
              <th className="p-3">Total Expense</th>
              <th className="p-3">Net</th>
            </tr>
          </thead>
          <tbody>
            {filteredFinance.length > 0 ? (
              filteredFinance.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50 text-sm md:text-base">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.date}</td>
                  <td className="p-3">{item.total_income}</td>
                  <td className="p-3">{item.total_expense}</td>
                  <td className="p-3">{item.net}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredFinance.length > 0 ? (
          filteredFinance.map((item, index) => (
            <div key={item.id || index} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <p className="font-semibold">{index + 1}. Finance</p>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
                  className={`transform transition-transform duration-300 ${
                    expandedId === item.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronUp size={20} />
                </button>
              </div>
              {expandedId === item.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Date: </span>
                    {item.date}
                  </p>
                  <p>
                    <span className="font-semibold">Income: </span>
                    {item.total_income}
                  </p>
                  <p>
                    <span className="font-semibold">Expense: </span>
                    {item.total_expense}
                  </p>
                  <p>
                    <span className="font-semibold">Net: </span>
                    {item.net}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No data found.</p>
        )}
      </div>

      {/* INCOME MODAL */}
      {showIncomeForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <h2 className="text-xl font-bold mb-4">Add Income</h2>

            <select
              value={incomeForm.booking_id}
              onChange={(e) => {
                setIncomeForm({ ...incomeForm, booking_id: e.target.value });
                if (e.target.value) toast.info(`Booking #${e.target.value} selected`);
              }}
              className="border w-full p-2 mb-2 rounded"
            >
              <option value="">Select Booking</option>
              {booking.map((b) => (
                <option key={b.id} value={b.id}>
                  Booking #{b.id}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={incomeForm.amount}
              onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
              className="border w-full p-2 mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Payment Mode"
              value={incomeForm.payment_mode}
              onChange={(e) => setIncomeForm({ ...incomeForm, payment_mode: e.target.value })}
              className="border w-full p-2 mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Received By"
              value={incomeForm.received_by}
              onChange={(e) => setIncomeForm({ ...incomeForm, received_by: e.target.value })}
              className="border w-full p-2 mb-2 rounded"
            />
            <input
              type="date"
              value={incomeForm.date.replace(/\//g, "-")}
              onChange={(e) =>
                setIncomeForm({ ...incomeForm, date: e.target.value.replace(/-/g, "/") })
              }
              className="border w-full p-2 mb-2 rounded"
            />

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleAddIncome}
                className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowIncomeForm(false)}
                className="flex-1 bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPENSE MODAL */}
      {showExpenseForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <h2 className="text-xl font-bold mb-4">Add Expense</h2>

            <input
              type="text"
              placeholder="Title"
              value={expenseForm.title}
              onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
              className="border w-full p-2 mb-2 rounded"
            />
            <input
              type="number"
              placeholder="Amount"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
              className="border w-full p-2 mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Paid To"
              value={expenseForm.paid_to}
              onChange={(e) => setExpenseForm({ ...expenseForm, paid_to: e.target.value })}
              className="border w-full p-2 mb-2 rounded"
            />
            <input
              type="date"
              value={expenseForm.date.replace(/\//g, "-")}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, date: e.target.value.replace(/-/g, "/") })
              }
              className="border w-full p-2 mb-2 rounded"
            />
            <textarea
              placeholder="Notes"
              value={expenseForm.notes}
              onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
              className="border w-full p-2 mb-2 rounded"
            />

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleAddExpense}
                className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowExpenseForm(false)}
                className="flex-1 bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
