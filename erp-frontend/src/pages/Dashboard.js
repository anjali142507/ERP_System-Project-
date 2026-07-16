import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography, Box, Card, CardContent, CircularProgress } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import API from "../services/api";
import {
  AttachMoney,
  Inventory,
  ReceiptLong,
  ShoppingCart,
  WarningAmber,
  LocalShipping,
} from "@mui/icons-material";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Role normalize logic: "Sales Executive" -> "SALES_EXECUTIVE"
  const rawRole = user?.role || "GUEST";
  const userRole = rawRole.toUpperCase().replace(/\s+/g, '_');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Document endpoints: /sales-summary, /purchase-summary, /stock-alerts
        const response = await API.get("/api/dashboard/summary");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // API data mapping as per Document Requirements
  const allWidgets = [
    {
      title: "Total Sales This Month",
      value: `₹${stats?.totalSales || 0}`,
      icon: <AttachMoney />,
      roles: ["ADMIN", "SALES_EXECUTIVE", "ACCOUNTANT"],
    },
    {
      title: "Top-Selling Products",
      value: stats?.topProduct || "N/A",
      icon: <Inventory />,
      roles: ["ADMIN", "SALES_EXECUTIVE"],
    },
    {
      title: "Pending Invoices",
      value: stats?.pendingInvoices || 0,
      icon: <ReceiptLong />,
      roles: ["ADMIN", "SALES_EXECUTIVE", "ACCOUNTANT"],
    },
    {
      title: "Total Purchases This Month",
      value: `₹${stats?.totalPurchases || 0}`,
      icon: <ShoppingCart />,
      roles: ["ADMIN", "PURCHASE_MANAGER", "ACCOUNTANT"],
    },
    {
      title: "Low Stock Alerts",
      value: `${stats?.lowStockCount || 0} Items`,
      icon: <WarningAmber />,
      roles: ["ADMIN", "INVENTORY_MANAGER"],
    },
    {
      title: "Recent GRNs",
      value: stats?.recentGrnCount || 0,
      icon: <LocalShipping />,
      roles: ["ADMIN", "INVENTORY_MANAGER", "PURCHASE_MANAGER"],
    },
  ];

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress sx={{ color: "#F2867A" }} />
    </Box>
  );

  return (
    <Box sx={{ p: 3, bgcolor: "#FFF7F5", minHeight: "100%" }}>
      <Typography
        variant="h4"
        sx={{
          color: "#3D2B28",
          fontWeight: "bold",
          mb: 1,
        }}
      >
        ERP Dashboard
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          mb: 4,
          bgcolor: '#FDEDEA',
          color: "#EF6F62",
          p: 1.2,
          px: 2,
          display: 'inline-block',
          borderRadius: '10px',
          fontWeight: 500
        }}
      >
        Logged in as: <strong>{rawRole}</strong>
      </Typography>

      <Grid container spacing={3}>
        {allWidgets
          .filter(widget => widget.roles.includes(userRole))
          .map((widget, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  border: "1px solid #F3DAD5",
                  borderLeft: "5px solid #F2867A",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    boxShadow: "0 12px 24px rgba(242,134,122,.15)",
                  },

                  "&:hover .dashboardIcon": {
                    bgcolor: "#F2867A",
                    color: "#fff",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    gap: 1,
                  }}
                >


                  <Box className="dashboardIcon"
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      bgcolor: "#FFF2EF",
                      color: "#F2867A",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      transition: "0.3s",

                      "& svg": {
                        fontSize: 20,
                      },
                    }}
                  >
                    {widget.icon}
                  </Box>
                  <Typography variant="subtitle2" sx={{ color: "#9C9491", fontWeight: 600 }}>
                    {widget.title}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="800" sx={{ mt: 1, letterSpacing: "-0.5px", color: "#3D2B28" }}>
                  {widget.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
      </Grid>

      {/* Workspace Quick Actions */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h4"
          sx={{
            color: "#3D2B28",
            fontWeight: "bold",
            mb: 2.5,
          }}
        >
          My Workspace
        </Typography>
        <Grid container spacing={2.5}>
          {(userRole === "SALES_EXECUTIVE" || userRole === "ADMIN") && (
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  background: "linear-gradient(135deg, #FDEDEA 0%, #FBD9D2 100%)",
                  cursor: 'pointer',
                  borderRadius: "14px",
                  border: "1px solid #F7C4BA",
                  transition: "all 0.25s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 24px rgba(242, 134, 122, 0.15)" }
                }}
                onClick={() => window.location.href = '/sales-orders'}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#D9574A",
                      fontWeight: "bold",
                      mb: 1,
                    }}
                  >
                    Sales Management
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#EF6F62",
                      fontWeight: 500,
                      opacity: 1,
                    }}
                  >Create & Manage Sales Orders</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {(userRole === "INVENTORY_MANAGER" || userRole === "ADMIN" || userRole === "PURCHASE_MANAGER") && (
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
                  cursor: 'pointer',
                  borderRadius: "14px",
                  border: "1px solid #A7F3D0",
                  transition: "all 0.25s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 24px rgba(16, 185, 129, 0.15)" }
                }}
                onClick={() => window.location.href = '/grn'}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#065F46",
                      fontWeight: "bold",
                      mb: 1,
                    }}
                  >
                    Inventory & GRN
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#047857", opacity: 1, fontWeight: 500 }}>
                    Manage Inventory & Stock Receipts</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {(userRole === "ACCOUNTANT" || userRole === "ADMIN") && (
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
                  cursor: 'pointer',
                  borderRadius: "14px",
                  border: "1px solid #FDE68A",
                  transition: "all 0.25s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 24px rgba(245, 158, 11, 0.15)" }
                }}
                onClick={() => window.location.href = '/reports'}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{
                    color: "#92400E", fontWeight: "bold",
                    mb: 1,
                  }}>Financial Reports</Typography>
                  <Typography variant="body2" sx={{ color: "#B45309", opacity: 1, fontWeight: 500 }}>
                    View Reports & Business Analytics</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;