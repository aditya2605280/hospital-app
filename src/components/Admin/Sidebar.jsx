import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import {
  Shield,
  LayoutDashboard,
  UserPlus,
  Users,
  UserCheck,
  Heart,
  Box,
  CreditCard,
  Calendar,
  FileText,
  Stethoscope,
  Landmark,
  Microchip,
  Microscope,
  TestTube,
  Tablet,
  Table2,
  Tablets,
  Pill,
  ShieldPlus,
  TestTube2,
  Hospital,
  Ambulance,
  DollarSign,
  ShieldMinus,
  ToyBrick,
  CandlestickChart,
} from "lucide-react"; // Update with the appropriate icons
import Medicine from "./Medicine";

const Sidebar = ({ activeItem, handleItemClick, className = "" }) => {
  const user = useSelector((state) => state.auth.user);

  // Define your sidebar items with appropriate icons for each component
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard, // Dashboard icon
      section: "main",
    },
  ];

  const userManagementItems = [
    { id: "appointments", label: "Appointments", icon: Calendar, section: "user" }, // Appointments icon
    { id: "brands", label: "Brands", icon: CandlestickChart, section: "user" }, // Brands icon
    { id: "commission", label: "Commission", icon: CreditCard, section: "user" }, // Commission icon
    { id: "commission-settings", label: "Commission Settings", icon: ShieldMinus, section: "user" }, // Commission Settings icon
    { id: "create-user", label: "Create User", icon: UserPlus, section: "user" }, // Create User icon
    { id: "doctor", label: "Doctor", icon: Stethoscope, section: "user" }, // Doctor icon
    { id: "dr-availabilities", label: "Dr Availabilities", icon: Users, section: "user" }, // Dr Availabilities icon
    { id: "finance", label: "Finance", icon: Landmark, section: "user" }, // Finance icon
    { id: "form", label: "Form", icon: FileText, section: "user" }, // Form icon
    { id: "lab-booking", label: "Lab Booking", icon: Microscope, section: "user" }, // Lab Booking icon
    { id: "lab-results", label: "Lab Results", icon: FileText, section: "user" }, // Lab Results icon
    { id: "labs-emp", label: "Labs Emp", icon: Users, section: "user" }, // Labs Emp icon
    { id: "labs-test", label: "Labs Test", icon: TestTube2, section: "user" }, // Labs Test icon
    { id: "medical", label: "Medical", icon: ShieldPlus, section: "user" }, // Medical icon
    { id: "medicine", label: "Medicine", icon: Pill, section: "user" }, // Medicine icon
    { id: "medicine-purchases", label: "Medicine Purchases", icon: Hospital, section: "user" }, // Medicine Purchases icon
    { id: "patients-list", label: "Patients List", icon: Users, section: "user" }, // Patients List icon
    { id: "prescriptions", label: "Prescriptions", icon: FileText, section: "user" }, // Prescriptions icon
    { id: "receptions", label: "Receptions", icon: UserCheck, section: "user" }, // Receptions icon
    { id: "role-management", label: "Role Management", icon: UserCheck, section: "user" }, // Role Management icon
    { id: "supplier", label: "Supplier", icon: Ambulance, section: "user" }, // Supplier icon
    { id: "tax", label: "Tax", icon: DollarSign, section: "user" }, // Tax icon
    { id: "tax-group", label: "Tax Group", icon: FileText, section: "user" }, // Tax Group icon
    { id: "user", label: "User", icon: Users, section: "user" }, // User icon
    { id: "user-management", label: "User Management", icon: Users, section: "user" }, // User Management icon
  ];

  // Navigation item component
  const NavItem = ({ item, isActive, onClick }) => (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-gray-200 text-gray-900 font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <item.icon size={20} />
      <span className="text-sm">{item.label}</span>
    </button>
  );

  // Sidebar scroll position logic
  const navScrollRef = useRef(null);
  const lastScroll = useRef(0);

  // Save scroll position before activeItem changes
  useEffect(() => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollTop = lastScroll.current;
    }
  }, [activeItem]);

  const handleNavScroll = () => {
    if (navScrollRef.current) {
      lastScroll.current = navScrollRef.current.scrollTop;
    }
  };

  return (
    <div
      className={`bg-white border-r h-screen border-gray-200 flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation (scrollable) */}
      <div
        ref={navScrollRef}
        className="flex-1 p-4 space-y-6 overflow-y-auto"
        onScroll={handleNavScroll}
      >
        {/* Main Navigation */}
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
              onClick={handleItemClick}
            />
          ))}
        </div>

        {/* Management Section */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">
            MANAGEMENT SECTION
          </h3>
          <div className="space-y-2">
            {userManagementItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onClick={handleItemClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "GU"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-gray-500 truncate">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
