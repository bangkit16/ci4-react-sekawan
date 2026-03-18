import type { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./utils/ThemeContext";
import { ToastProvider } from "./utils/ToastContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Vehicle
import Vehicles from "./pages/Vehicle/Vehicles";
import CreateVehicle from "./pages/Vehicle/Create";
import EditVehicle from "./pages/Vehicle/Edit";
import VehicleDetail from "./pages/Vehicle/VehicleDetail";

import Booking from "./pages/Booking/Booking";
import CreateBooking from "./pages/Booking/CreateBooking";
import Approvals from "./pages/Booking/Approvals";

// Driver
import Drivers from "./pages/Driver/Drivers";
import CreateDriver from "./pages/Driver/Create";
import EditDriver from "./pages/Driver/Edit";

// Employee
import Employees from "./pages/Employee/Employees";
import CreateEmployee from "./pages/Employee/Create";
import EditEmployee from "./pages/Employee/Edit";

// Location
import Locations from "./pages/Location/Locations";
import CreateLocation from "./pages/Location/Create";
import EditLocation from "./pages/Location/Edit";

const App: FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/dashboard/vehicles" element={<Vehicles />} />
            <Route
              path="/dashboard/vehicles/create"
              element={<CreateVehicle />}
            />
            <Route
              path="/dashboard/vehicles/:id"
              element={<VehicleDetail />}
            />
            <Route
              path="/dashboard/vehicles/:id/edit"
              element={<EditVehicle />}
            />
            <Route path="/dashboard/bookings" element={<Booking />} />
            <Route
              path="/dashboard/bookings/create"
              element={<CreateBooking />}
            />
            <Route path="/dashboard/approvals" element={<Approvals />} />

            <Route path="/dashboard/drivers" element={<Drivers />} />
            <Route
              path="/dashboard/drivers/create"
              element={<CreateDriver />}
            />
            <Route
              path="/dashboard/drivers/:id/edit"
              element={<EditDriver />}
            />

            <Route path="/dashboard/employees" element={<Employees />} />
            <Route
              path="/dashboard/employees/create"
              element={<CreateEmployee />}
            />
            <Route
              path="/dashboard/employees/:id/edit"
              element={<EditEmployee />}
            />

            <Route path="/dashboard/locations" element={<Locations />} />
            <Route
              path="/dashboard/locations/create"
              element={<CreateLocation />}
            />
            <Route
              path="/dashboard/locations/:id/edit"
              element={<EditLocation />}
            />

            <Route path="/dashboard/:section" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
