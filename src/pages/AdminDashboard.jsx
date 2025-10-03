"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchLoggedInUser } from "../redux/Slices/authSlice";
import { LayoutDashboard, Menu, X } from "lucide-react";
import Sidebar from "../components/Admin/Sidebar";
import Navbar from "../components/Admin/Navbar";
// Import your actual pages here
import CreateUser from "../components/Admin/CreateUser";
import RoleManagement from "../components/Admin/RoleManagement";
import UserManagement from "../components/Admin/UserManagement";
import Appointments from "../components/Admin/Appointments"
import Brands from "../components/Admin/Brands"
import Commission from "../components/Admin/Commission";
import CommissionSettings from "../components/Admin/CommissionSettings";
import Doctor from "../components/Admin/Doctor";
import DrAvailablities from "../components/Admin/DrAvailablities";
import Finance from "../components/Admin/Finance";
import Form from "../components/Admin/Form";
import LabBooking from "../components/Admin/LabBooking";
import LabsEmp from "../components/Admin/LabsEmp";
import LabsTest from "../components/Admin/LabsTest";
import LabResults from "../components/Admin/LabResults";
import Medical from "../components/Admin/Medical";
import Medicine from "../components/Admin/Medicine";
import MedicinePurchases from "../components/Admin/MedicinePurchases";
import PatientsList from "../components/Admin/PatientsList";
import Prescriptions from "../components/Admin/Prescriptions";
import Receptions from "../components/Admin/Receptions";
import Supplier from "../components/Admin/Supplier";
import Tax from "../components/Admin/Tax";
import TaxGroups from "../components/Admin/TaxGroup";
import User from "../components/Admin/User";

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, [dispatch]);

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    setIsMobileMenuOpen(false); // close sidebar on mobile
  };

  const renderContent = () => {
    switch (activeItem) {
      case "create-user":
        return <CreateUser />;
      case "user-management":
        return <UserManagement />;
      case "role-management":
        return <RoleManagement />;
      case "appointments":
        return <Appointments />;
      case "brands":
        return <Brands />;
      case "commission":
        return <Commission />;
      case "commission-settings":
        return <CommissionSettings />;
      case "doctor":
        return <Doctor />;
      case "dr-availablities":
        return <DrAvailablities />;
      case "finance":
        return <Finance />;
      case "form":
        return <Form />;
      case "lab-booking":
        return <LabBooking />;
      case "labs-emp":
        return <LabsEmp />;
      case "labs-test":
        return <LabsTest />;
      case "lab-results":
        return <LabResults />;
      case "medical":
        return <Medical />;
      case "medicine":
        return <Medicine />;
      case "medicine-purchases":
        return <MedicinePurchases />;
      case "patients-list":
        return <PatientsList />;
      case "prescriptions":
        return <Prescriptions />;
      case "receptions":
        return <Receptions />;
      case "supplier":
        return <Supplier />;
      case "tax":
        return <Tax />;
      case "tax-group":
        return <TaxGroups />;
      case "user":
        return <User />;
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center transition-all">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <LayoutDashboard className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Welcome to Admin Dashboard
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Currently showing:{" "}
                <span className="font-semibold text-blue-600 capitalize">
                  {activeItem.replace("-", " ")}
                </span>
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-2 left-4 z-50 p-3 bg-white rounded-full shadow-lg border border-gray-200 focus:outline-none"
      >
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activeItem={activeItem}
        handleItemClick={handleItemClick}
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 lg:w-72
          transform transition-transform duration-300 ease-in-out
          bg-white shadow-md lg:shadow-none
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:w-[calc(100%-18rem)] flex flex-col overflow-hidden">
        {/* Fixed Navbar */}
        <div className="fixed top-0 right-0 left-0 lg:left-72 z-30 bg-white border-b border-gray-200 shadow-sm">
          <Navbar />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto mt-16 p-4 lg:p-10 space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
