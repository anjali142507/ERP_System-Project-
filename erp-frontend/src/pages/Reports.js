import React, { useState, useEffect } from "react";
import {
  Container, Typography, Grid, Paper, Box, Button, Divider
} from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";
import { PictureAsPdf, GetApp } from "@mui/icons-material";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Reports() {
  const [reportData, setReportData] = useState({
    salesByMonth: [
      { month: "Jan", sales: 4000, purchases: 2400, profit: 1600 },
      { month: "Feb", sales: 3000, purchases: 1398, profit: 1602 },
      { month: "Mar", sales: 2000, purchases: 9800, profit: -7800 },
      { month: "Apr", sales: 2780, purchases: 3908, profit: -1128 },
      { month: "May", sales: 1890, purchases: 4800, profit: -2910 },
      { month: "Jun", sales: 2390, purchases: 3800, profit: -1410 },
    ],
    totalSales: 11780,
    totalPurchases: 17506,
    netProfit: -5726
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/reports/summary");
        if (response.data) {
          setReportData(prev => ({
            ...prev,
            ...response.data,
          }));
          setError("");
        }
      } catch (err) {
        setError("Backend not connected. Showing default data for your report file.");
      }
    };
    fetchAnalytics();
  }, []);


  const handleExportCSV = () => {
    const chartData = reportData?.salesByMonth || [];

    if (chartData.length === 0 && reportData.totalSales === 0) {
      alert("No data available to export");
      return;
    }

    // CSV Headers
    let csvContent = "Metric,Value\n";
    csvContent += `Total Sales,${reportData.totalSales}\n`;
    csvContent += `Total Purchases,${reportData.totalPurchases}\n`;
    csvContent += `Net Profit,${reportData.netProfit}\n\n`;

    if (chartData.length > 0) {
      csvContent += "Month,Sales,Purchases,Profit\n";
      chartData.forEach(row => {
        csvContent += `${row.month || ''},${row.sales || 0},${row.purchases || 0},${row.profit || 0}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ERP_Summary_Report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleGeneratePDF = () => {
    setTimeout(async () => {
      const input = document.getElementById('report-area-final');
      try {
        const canvas = await html2canvas(input, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        pdf.text("ERP Business Analytics Report", 15, 10);
        pdf.addImage(imgData, 'PNG', 0, 15, 297, (canvas.height * 297) / canvas.width);
        pdf.save(`ERP_Report.pdf`);
      } catch (e) {
        setError("PDF Export failed");
      }
    }, 500);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Box sx={{ p: 2, bgcolor: '#FFFBEB', color: '#92400E', borderRadius: '10px', mb: 2, borderLeft: '4px solid #F59E0B' }}>
          <Typography variant="body2" fontWeight={500}>{error}</Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#3D2B28",
            fontWeight: "bold",
          }}
        >
          Reports & Analytics
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={handleExportCSV}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              color: "#F2867A",
              borderColor: "#F7C4BA",
              px: 3,
              py: 1,
              minHeight: "42px",
              "&:hover": {
                borderColor: "#F2867A",
                bgcolor: "#FDEDEA",
              },
            }}
          >
            Export CSV
          </Button>

          <Button
            variant="contained"
            startIcon={<PictureAsPdf />}
            onClick={handleGeneratePDF}
            sx={{
              bgcolor: "#F2867A",
              color: "#fff",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              minHeight: "42px",
              boxShadow: "0 4px 12px rgba(242, 134, 122, 0.3)",
              "&:hover": {
                bgcolor: "#EF6F62",
                boxShadow: "0 6px 16px rgba(242, 134, 122, 0.4)",
              },
            }}
          >
            Generate PDF
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div id="report-area-final" style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '12px' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    bgcolor: '#FDEDEA',
                    borderLeft: '4px solid #F2867A',
                    borderRadius: "14px",
                    border: "1px solid #FBD9D2",
                    borderLeftWidth: "4px"
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: "#EF6F62", fontWeight: 600 }}>Total Sales</Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ color: "#3D2B28", mt: 0.5 }}>
                    ₹{reportData.totalSales.toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    bgcolor: '#FDF2F8',
                    borderLeft: '4px solid #EC4899',
                    borderRadius: "14px",
                    border: "1px solid #FCE7F3",
                    borderLeftWidth: "4px"
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: "#BE185D", fontWeight: 600 }}>Total Purchases</Typography>
                  <Typography variant="h4" fontWeight="800" sx={{ color: "#3D2B28", mt: 0.5 }}>
                    ₹{reportData.totalPurchases.toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    bgcolor: '#ECFDF5',
                    borderLeft: '4px solid #10B981',
                    borderRadius: "14px",
                    border: "1px solid #D1FAE5",
                    borderLeftWidth: "4px"
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: "#047857", fontWeight: 600 }}>Net Profit</Typography>
                  <Typography
                    variant="h4"
                    fontWeight="800"
                    sx={{ mt: 0.5, color: reportData.netProfit >= 0 ? '#059669' : '#DC2626' }}
                  >
                    ₹{reportData.netProfit.toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: "14px", border: "1px solid #F3DAD5" }}>
                  <Typography variant="h6" gutterBottom fontWeight="700" sx={{ color: "#3D2B28" }}>
                    Performance Metrics (₹)
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={reportData.salesByMonth}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3DAD5" />
                      <XAxis dataKey="month" stroke="#9C9491" />
                      <YAxis stroke="#9C9491" />
                      <Tooltip formatter={(v) => `₹${v}`} contentStyle={{ borderRadius: "10px", border: "1px solid #F3DAD5" }} />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="sales" fill="#F2867A" name="Sales" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="purchases" fill="#EC4899" name="Purchases" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="profit" fill="#F59E0B" name="Profit" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Reports;