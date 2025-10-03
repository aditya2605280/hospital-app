import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import userReducer from "./Slices/userSlice";
import roleReducer from "./Slices/roleSlice";
import permissionReducer from "./Slices/permissionSlice";
import appointmentSlice from "./Slices/AppointmentSlice";
import brandsSlice from "./Slices/brandsSlice";
import commission_settingsSlice from "./Slices/CommissionSettingsSlice";
import CommissionSlice from "./Slices/CommissionSlice";
import doctorSlice from "./Slices/DoctorSlice";
import DrAvailablitiesSlice from "./Slices/DrAvailablitiesSlice";
import FinanceSlice from "./Slices/FinanceSlice";
import Formslices from "./Slices/FormSlices";
import LabsSlice from "./Slices/LabsSlice";
import labBookingSlice from "./Slices/LabBookingSlice";
import labResultSlice from "./Slices/LabResultSlice";
import LabsTestSlice from "./Slices/LabTestSlice";
import medicalSlice from "./Slices/MedicalSlice";
import medicinesSlice from "./Slices/MedicineSlice";
import medicinePurchasesSlice from "./Slices/MedicinePurchasesSlice";
import patientsSlice from "./Slices/PatientsSlice";
import prescriptionsSlice from "./Slices/PrescriptionsSlice";
import receptionSlice from "./Slices/ReceptionSlice";
import SupplierSlice from "./Slices/SupplierSlice";
import taxesSlice from "./Slices/TaxSlice";
import taxGroupsSlice from "./Slices/TaxGroupSlice";
import usersSlice from "./Slices/UsersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    role: roleReducer,
    permissions: permissionReducer,
    appointment: appointmentSlice,
    brand: brandsSlice,
    commission: CommissionSlice,
    commission_settings: commission_settingsSlice,
    doctor: doctorSlice,
    DrAvailablities: DrAvailablitiesSlice,
    finance: FinanceSlice,
    Forms: Formslices,
    Labs: LabsSlice,
    labBooking: labBookingSlice,
    labResult: labResultSlice,
    labsTests: LabsTestSlice,
    medical: medicalSlice,
    medicines: medicinesSlice,
    medicinePurchases: medicinePurchasesSlice,
    patients: patientsSlice,
    prescriptions: prescriptionsSlice,
    receptions: receptionSlice,
    Supplier: SupplierSlice,
    taxes: taxesSlice,
    taxGroups: taxGroupsSlice,
    users: usersSlice,
  },
});
