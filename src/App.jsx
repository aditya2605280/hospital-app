import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import UserDashboard from "./pages/UserDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoutes>
              <AdminDashboard/>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoutes>
              <AdminDashboard />
            </ProtectedRoutes>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
