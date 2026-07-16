import React from "react";
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Divider, Box, Typography
} from "@mui/material";
import {
  Dashboard, Inventory, People, LocalShipping, ShoppingCart,
  Receipt, Assessment, Business, Description, BarChart, Assignment
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const drawerWidth = 280;

function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // src/components/Sidebar.js
  const rawRole = user?.role || "GUEST";

  const userRole = rawRole.toUpperCase().trim().replace(/\s+/g, '_');

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard", roles: ["ADMIN", "SALES_EXECUTIVE", "PURCHASE_MANAGER", "INVENTORY_MANAGER", "ACCOUNTANT"] },
    { text: "Products", icon: <Inventory />, path: "/products", roles: ["ADMIN", "INVENTORY_MANAGER"] },
    { text: "Customers", icon: <People />, path: "/customers", roles: ["ADMIN", "SALES_EXECUTIVE"] },
    { text: "Suppliers", icon: <Business />, path: "/suppliers", roles: ["ADMIN", "PURCHASE_MANAGER"] },
    { text: "Sales Orders", icon: <ShoppingCart />, path: "/sales-orders", roles: ["ADMIN", "SALES_EXECUTIVE"] },
    { text: "Purchase Orders", icon: <LocalShipping />, path: "/purchase-orders", roles: ["ADMIN", "PURCHASE_MANAGER"] },
    { text: "GRN (Stock Update)", icon: <Assignment />, path: "/grn", roles: ["ADMIN", "PURCHASE_MANAGER", "INVENTORY_MANAGER"] },
    { text: "Invoices", icon: <Description />, path: "/invoices", roles: ["ADMIN", "ACCOUNTANT", "SALES_EXECUTIVE"] },
    { text: "Reports", icon: <BarChart />, path: "/reports", roles: ["ADMIN", "ACCOUNTANT"] },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileOpen) handleDrawerToggle();
  };

  const drawer = (
    <Box sx={{ height: '100%', background: "linear-gradient(180deg, #3D2B28 0%, #2A1714 100%)", color: 'white' }}>
      <Box sx={{ p: 3.5, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: 0.5 }}>
          ERP SYSTEM
        </Typography>
        <Typography
          variant="caption"
          sx={{
            opacity: 0.85,
            display: "inline-block",
            mt: 0.75,
            px: 1.5,
            py: 0.4,
            borderRadius: "20px",
            bgcolor: "rgba(242, 134, 122, 0.25)",
            letterSpacing: 0.5,
            fontWeight: 600
          }}
        >
          {rawRole} Panel
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
      <List sx={{ px: 2, mt: 2 }}>
        {menuItems
          .filter((item) => item.roles.includes(userRole))
          .map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.75 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: '10px',
                  py: 1.1,
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    background: "linear-gradient(90deg, #F2867A 0%, #EF6F62 100%)",
                    color: "#ffffff",
                    boxShadow: "0 4px 14px rgba(242, 134, 122, 0.4)",
                    "& .MuiListItemIcon-root": { color: "#ffffff" },
                    "&:hover": {
                      background: "linear-gradient(90deg, #F2867A 0%, #EF6F62 100%)",
                    }
                  },
                  "&:hover": { bgcolor: 'rgba(255,255,255,0.06)' }
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? "inherit" : "#BBAFA9", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 600 : 500, fontSize: "0.92rem" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );

  return (
    <Box component="nav">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: 'none',
            boxShadow: "4px 0 24px rgba(0,0,0,0.15)"
          }
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default Sidebar;