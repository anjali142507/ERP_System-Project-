import React from "react";
import {
  Box, Container, Typography, Button, Grid, Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Inventory,
  ReceiptLong,
  Insights,
  ArrowForward
} from "@mui/icons-material";

const fontDisplay = "'Poppins', 'Segoe UI', sans-serif";
const fontBody = "'Inter', 'Segoe UI', sans-serif";

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Inventory Tracking",
      desc: "Real-time stock updates and warehouse management.",
      icon: <Inventory sx={{ fontSize: 32 }} />,
    },
    {
      title: "Invoice Management",
      desc: "Create and track professional GST-compliant invoices.",
      icon: <ReceiptLong sx={{ fontSize: 32 }} />,
    },
    {
      title: "Smart Analytics",
      desc: "Visualize performance with exportable PDF reports.",
      icon: <Insights sx={{ fontSize: 32 }} />,
    }
  ];

  return (
    <Box sx={{ bgcolor: "#FFF7F5", minHeight: "100vh", width: "100%", overflowX: "hidden", fontFamily: fontBody }}>
      <Box
        sx={{
          position: "relative",
          background: "linear-gradient(135deg, #F2867A 0%, #EF6F62 55%, #D9574A 100%)",
          color: "white",
          pt: 12,
          pb: { xs: 14, md: 18 },
          textAlign: "center",
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15, pointerEvents: "none" }}
        >
          <path d="M0 60 Q 360 20 720 60 T 1440 60" fill="none" stroke="white" strokeWidth="3" />
          <path d="M0 100 Q 360 60 720 100 T 1440 100" fill="none" stroke="white" strokeWidth="3" />
          <path d="M0 140 Q 360 100 720 140 T 1440 140" fill="none" stroke="white" strokeWidth="3" />
        </Box>

        <Container maxWidth="md" sx={{ position: "relative" }}>
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 3,
              opacity: 0.85,
              fontWeight: 600,
              fontFamily: fontDisplay,
              display: "block",
              mb: 1.5
            }}
          >
            All-in-one business platform
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: { xs: '2.4rem', md: '3.5rem' },
              letterSpacing: -0.5,
              mb: 2,
            }}
          >
            ERP Management System
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 5, opacity: 0.92, fontWeight: 400, fontFamily: fontBody, maxWidth: 560, mx: "auto" }}
          >
            Unified platform for Inventory, Invoicing, and Analytics.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate("/login")}
            sx={{
              bgcolor: "white",
              color: "#D9574A",
              px: 4.5,
              py: 1.5,
              borderRadius: "10px",
              fontWeight: 700,
              fontFamily: fontDisplay,
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
              "&:hover": {
                bgcolor: "#FDEDEA",
                transform: "translateY(-3px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.22)"
              },
              transition: "all 0.25s ease"
            }}
          >
            Access Dashboard
          </Button>
        </Container>

        <Box
          component="svg"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          sx={{ position: "absolute", left: 0, right: 0, bottom: -1, width: "100%", height: { xs: 60, md: 90 }, display: "block" }}
        >
          <path d="M0 40 Q 360 90 720 45 T 1440 40 V100 H0 Z" fill="#FFF7F5" />
        </Box>
      </Box>

      {/* Feature cards */}
      <Container maxWidth="lg" sx={{ mt: { xs: -6, md: -8 }, pb: 12 }}>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
          wrap="wrap"
          sx={{ width: '100%', margin: 0 }}
        >
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
              <Paper
                elevation={0}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  pt: 5,
                  pb: 4,
                  px: 4,
                  textAlign: "center",
                  borderRadius: 5,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  bgcolor: "white",
                  transition: "all 0.3s ease",
                  border: "1px solid #F3DAD5",
                  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 24px 48px rgba(242, 134, 122, 0.20)",
                    borderColor: "#F7C4BA",
                    "& .feature-icon-badge": {
                      background: "linear-gradient(135deg, #F2867A 0%, #D9574A 100%)",
                      color: "white",
                    },
                    "& .feature-wave": {
                      opacity: 0.25,
                    }
                  }
                }}
              >
                <Box
                  className="feature-wave"
                  component="svg"
                  viewBox="0 0 200 40"
                  preserveAspectRatio="none"
                  sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: 40, opacity: 0.12, transition: "opacity 0.3s ease" }}
                >
                  <path d="M0 20 Q 50 0 100 20 T 200 20 V0 H0 Z" fill="#F2867A" />
                </Box>

                <Box
                  className="feature-icon-badge"
                  sx={{
                    position: "relative",
                    color: "#F2867A",
                    mb: 2.5,
                    width: 68,
                    height: 68,
                    borderRadius: "50%",
                    bgcolor: "#FDEDEA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ fontFamily: fontDisplay, fontWeight: 700, color: "#3D2B28" }} gutterBottom>
                  {feature.title}
                </Typography>
                <Box sx={{ width: 32, height: 3, bgcolor: "#F2867A", borderRadius: 2, opacity: 0.5, mb: 1.5 }} />
                <Typography color="textSecondary" variant="body2" sx={{ fontFamily: fontBody, lineHeight: 1.7 }}>
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default LandingPage;