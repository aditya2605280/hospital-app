import React, { useState } from "react";
import {
  Bell,
  BriefcaseMedical,
  ClipboardMinus,
  ClipboardPlus,
  DollarSign,
  LayoutDashboard,
  Landmark,
  LucideTextAlignStart,
  Menu,
  Microscope,
  Pill,
  Settings,
  Shield,
  ShieldMinus,
  Stethoscope,
  Syringe,
  Tablets,
  ToyBrick,
  UserCheck,
  Users,
  X,
} from "lucide-react";

import Appointments from "./Appointments";
import Brands from "./Brands";
import Commission from "./Commission";
import CommissionSettings from "./CommissionSettings";
import Doctor from "./Doctor";
import DrAvailablities from "./DrAvailablities";
import Finance from "./Finance";
import Form from "./Form";
import LabBooking from "./LabBooking";
import LabsEmp from "./LabsEmp";
import LabsTest from "./LabsTest";
import LabResults from "./LabResults";
import Medical from "./Medical";
import Medicine from "./Medicine";
import MedicinePurchases from "./MedicinePurchases";
import PatientsList from "./PatientsList";
import Prescriptions from "./Prescriptions";
import Receptions from "./Receptions";
import Supplier from "./Supplier";
import Tax from "./Tax";
import TaxGroups from "./TaxGroup";
import User from "./User";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen px-4 bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r flex flex-col z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="px-6 py-8 text-lg font-bold border-b">Admin Panel</div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Dashboard */}
          <button
            onClick={() => {
              setActivePage("Dashboard");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "Dashboard"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <p className="text-xs text-gray-400 mt-4 mb-2 uppercase">
            Management Section
          </p>

          {/* Alphabetized Navigation */}
          <button
            onClick={() => {
              setActivePage("appointments");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "appointments"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <BriefcaseMedical size={18} /> Appointment
          </button>

          <button
            onClick={() => {
              setActivePage("brands");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "brands"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <ToyBrick size={18} /> Brands
          </button>

          <button
            onClick={() => {
              setActivePage("commission");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "commission"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <ShieldMinus size={18} /> Commission
          </button>

          <button
            onClick={() => {
              setActivePage("commissionSettings");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "commissionSettings"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <ShieldMinus size={18} /> Commission Settings
          </button>

          <button
            onClick={() => {
              setActivePage("Doctor");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "Doctor"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <Stethoscope size={18} /> Doctor
          </button>

          <button
            onClick={() => {
              setActivePage("DrAvailablities");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "DrAvailablities"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <Stethoscope size={18} /> Dr Availabilities
          </button>

          <button
            onClick={() => {
              setActivePage("finance");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "finance"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <Landmark size={18} /> Finance
          </button>

          <button
            onClick={() => {
              setActivePage("Form");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "Form"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <Shield size={18} /> Form
          </button>

          <button
            onClick={() => {
              setActivePage("labBooking");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "labBooking"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <Microscope size={18} /> Lab Booking
          </button>

          <button
            onClick={() => {
              setActivePage("LabsEmp");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "LabsEmp"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <Microscope size={18} /> Labs Emp
          </button>

          <button
            onClick={() => {
              setActivePage("labsTest");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "labsTest"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <Syringe size={18} /> Labs Tests
          </button>

          <button
            onClick={() => {
              setActivePage("labResults");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "labResults"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <Microscope size={18} /> Lab Results
          </button>

          <button
            onClick={() => {
              setActivePage("medical");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "medical"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <Tablets size={18} /> Medical
          </button>

          <button
            onClick={() => {
              setActivePage("medicine");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "medicine"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <Tablets size={18} /> Medicine
          </button>

          <button
            onClick={() => {
              setActivePage("medicinePurchases");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "medicinePurchases"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <Pill size={18} /> Medicine Purchases
          </button>

          <button
            onClick={() => {
              setActivePage("patients");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "patients"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <UserCheck size={18} /> Patients
          </button>

          <button
            onClick={() => {
              setActivePage("Prescriptions");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "Prescriptions"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <ClipboardMinus size={18} /> Prescriptions
          </button>

          <button
            onClick={() => {
              setActivePage("receptions");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "receptions"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <ClipboardPlus size={18} /> Receptions
          </button>

          <button
            onClick={() => {
              setActivePage("supplier");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "supplier"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <Users size={18} /> Supplier
          </button>

          <button
            onClick={() => {
              setActivePage("tax");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "tax"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <DollarSign size={18} /> Tax
          </button>

          <button
            onClick={() => {
              setActivePage("taxGroup");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "taxGroup"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <DollarSign size={18} /> Tax Group
          </button>

          <button
            onClick={() => {
              setActivePage("user");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 ${
              activePage === "user"
                ? "bg-gray-200 text-black font-bold"
                : "text-gray-700"
            }`}
          >
            <Users size={18} /> Users
          </button>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
            AU
          </div>
          <div>
            <p className="text-sm font-semibold">Admin User</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="py-6 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex flex-row gap-2 items-center">
              <Stethoscope size={24} className="text-blue-600" />
              <h1 className="font-semibold text-gray-700">
                Admin User Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-y-auto flex-1">
          {activePage === "Dashboard" && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-lg">Welcome! HMS</p>
            </div>
          )}
          {activePage === "appointments" && <Appointments />}
          {activePage === "brands" && <Brands />}
          {activePage === "commission" && <Commission />}
          {activePage === "commissionSettings" && <CommissionSettings />}
          {activePage === "Doctor" && <Doctor />}
          {activePage === "DrAvailablities" && <DrAvailablities />}
          {activePage === "finance" && <Finance />}
          {activePage === "Form" && <Form />}
          {activePage === "labBooking" && <LabBooking />}
          {activePage === "LabsEmp" && <LabsEmp />}
          {activePage === "labsTest" && <LabsTest />}
          {activePage === "labResults" && <LabResults />}
          {activePage === "medical" && <Medical />}
          {activePage === "medicine" && <Medicine />}
          {activePage === "medicinePurchases" && <MedicinePurchases />}
          {activePage === "patients" && <PatientsList />}
          {activePage === "Prescriptions" && <Prescriptions />}
          {activePage === "receptions" && <Receptions />}
          {activePage === "supplier" && <Supplier />}
          {activePage === "tax" && <Tax />}
          {activePage === "taxGroup" && <TaxGroups />}
          {activePage === "user" && <User />}
        </main>
      </div>
    </div>
  );
}


