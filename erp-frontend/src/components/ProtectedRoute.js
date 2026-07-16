import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CircularProgress, Box, Typography } from "@mui/material";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, hasAnyRole } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
        sx={{ bgcolor: "#F8FAFC" }}
      >
        <CircularProgress sx={{ color: "#4F46E5" }} thickness={4} size={44} />
        <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500, letterSpacing: 0.3 }}>
          Loading…
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default ProtectedRoute;