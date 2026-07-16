import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  MenuItem,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Person, Lock, Badge } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: yup.string().required("Role is required"),
});


const CORAL = "#F2867A";
const CORAL_DARK = "#EF6F62";
const CORAL_LIGHT = "#FFB4A8";

function Register() {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");

    const result = await registerUser(data);

    if (result.success) {
      setSuccess("Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError(result.error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#FBEAE7",
        p: 2,
      }}
    >
      <Container component="main" maxWidth="xs" disableGutters>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            borderRadius: "32px",
            overflow: "hidden",
            boxShadow: "0 30px 60px rgba(239, 111, 98, 0.35)",
          }}
        >
          <Box
            sx={{
              position: "relative",
              height: 190,
              background: `linear-gradient(160deg, ${CORAL_LIGHT} 0%, ${CORAL} 55%, ${CORAL_DARK} 100%)`,
              overflow: "hidden",
            }}
          >
            <Box
              component="svg"
              viewBox="0 0 400 200"
              preserveAspectRatio="xMidYMid slice"
              sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35 }}
            >
              <g fill="none" stroke="#ffffff" strokeWidth="1.4">
                <path d="M-20,30 C 60,10 100,60 180,40 S 300,10 420,50" />
                <path d="M-20,60 C 60,40 100,90 180,70 S 300,40 420,80" />
                <path d="M-20,90 C 60,70 100,120 180,100 S 300,70 420,110" />
                <path d="M-20,120 C 60,100 100,150 180,130 S 300,100 420,140" />
                <path d="M-20,150 C 60,130 100,180 180,160 S 300,130 420,170" />
                <path d="M-20,0 C 80,-20 120,30 220,10 S 340,-20 420,20" />
              </g>
            </Box>
            <Box
              component="svg"
              viewBox="0 0 400 60"
              preserveAspectRatio="none"
              sx={{ position: "absolute", bottom: -1, left: 0, width: "100%", height: 60, display: "block" }}
            >
              <path
                d="M0,32 C 80,60 130,0 210,18 C 290,36 340,10 400,26 L400,60 L0,60 Z"
                fill="#ffffff"
              />
            </Box>
          </Box>

          {/* Form area */}
          <Box sx={{ px: 4, pt: 1, pb: 4, mt: -2, position: "relative" }}>
            <Typography variant="h4" fontWeight="800" sx={{ color: "#2D2A2A", mb: 0.5 }}>
              Sign up
            </Typography>
            <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: CORAL, mb: 3 }} />

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: "10px" }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Typography variant="caption" sx={{ color: "#9C9491", fontWeight: 600, letterSpacing: 0.4 }}>
                USERNAME
              </Typography>
              <TextField
                fullWidth
                required
                id="username"
                name="username"
                autoComplete="username"
                autoFocus
                placeholder="Choose a username"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
                variant="standard"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: CORAL, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  mt: 0.5,
                  "& .MuiInput-underline:before": { borderBottomColor: "#EEE2E0" },
                  "& .MuiInput-underline:hover:before": { borderBottomColor: CORAL },
                  "& .MuiInput-underline:after": { borderBottomColor: CORAL },
                }}
              />

              <Typography variant="caption" sx={{ color: "#9C9491", fontWeight: 600, letterSpacing: 0.4 }}>
                PASSWORD
              </Typography>
              <TextField
                fullWidth
                required
                name="password"
                type="password"
                id="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                variant="standard"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: CORAL, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  mt: 0.5,
                  "& .MuiInput-underline:before": { borderBottomColor: "#EEE2E0" },
                  "& .MuiInput-underline:hover:before": { borderBottomColor: CORAL },
                  "& .MuiInput-underline:after": { borderBottomColor: CORAL },
                }}
              />

              <Typography variant="caption" sx={{ color: "#9C9491", fontWeight: 600, letterSpacing: 0.4 }}>
                ROLE
              </Typography>
              <TextField
                fullWidth
                required
                select
                name="role"
                id="role"
                {...register("role")}
                error={!!errors.role}
                helperText={errors.role?.message}
                variant="standard"
                defaultValue=""
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge sx={{ color: CORAL, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 4,
                  mt: 0.5,
                  "& .MuiInput-underline:before": { borderBottomColor: "#EEE2E0" },
                  "& .MuiInput-underline:hover:before": { borderBottomColor: CORAL },
                  "& .MuiInput-underline:after": { borderBottomColor: CORAL },
                }}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Sales Executive">Sales Executive</MenuItem>
                <MenuItem value="Purchase Manager">Purchase Manager</MenuItem>
                <MenuItem value="Inventory Manager">Inventory Manager</MenuItem>
                <MenuItem value="Accountant">Accountant</MenuItem>
              </TextField>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.4,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  background: `linear-gradient(90deg, ${CORAL} 0%, ${CORAL_DARK} 100%)`,
                  boxShadow: "0 12px 24px rgba(239, 111, 98, 0.45)",
                  "&:hover": {
                    background: `linear-gradient(90deg, ${CORAL_DARK} 0%, ${CORAL_DARK} 100%)`,
                    boxShadow: "0 14px 28px rgba(239, 111, 98, 0.55)",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign Up"}
              </Button>

              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography variant="body2" sx={{ color: "#9C9491", display: "inline" }}>
                  {"Already have an account? "}
                </Typography>
                <Link
                  href="/login"
                  variant="body2"
                  sx={{ color: CORAL_DARK, fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                >
                  Sign in
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;