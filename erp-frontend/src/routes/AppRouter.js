import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Box } from "@mui/material";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Customers from "../pages/Customers";
import Suppliers from "../pages/Suppliers";
import SalesOrders from "../pages/SalesOrders";
import PurchaseOrders from "../pages/PurchaseOrders";
import GRN from "../pages/GRN";
import Invoices from "../pages/Invoices";
import Reports from "../pages/Reports";
import LandingPage from "../components/LandingPage"; // 👈 Added this
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Profile from "../pages/Profile";



function AppRouter() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const Layout = ({ children }) => (
    <Box sx={{ display: "flex" }}>
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: "100%", sm: "100%" },
          mt: "64px",
        }}
      >
        {children}
      </Box>
    </Box>
  );

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Layout><Products /></Layout></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><Layout><Customers /></Layout></ProtectedRoute>} />
        <Route path="/suppliers" element={<ProtectedRoute><Layout><Suppliers /></Layout></ProtectedRoute>} />
        <Route path="/sales-orders" element={<ProtectedRoute><Layout><SalesOrders /></Layout></ProtectedRoute>} />
        <Route path="/purchase-orders" element={<ProtectedRoute><Layout><PurchaseOrders /></Layout></ProtectedRoute>} />
        <Route path="/grn" element={<ProtectedRoute><Layout><GRN /></Layout></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute><Layout><Invoices /></Layout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;