import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Person,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar({ handleDrawerToggle }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  useEffect(() => {
    if (user?.id) {
     fetch(`https://erpsystem-project-production.up.railway.app/api/profile/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.profileImage) {
            setProfileImage(
              `https://erpsystem-project-production.up.railway.app/uploads/${data.profileImage}`
            );
          }
        })
        .catch(err => console.log(err));
    }
  }, [user]);

  const username = user?.username || "Guest";
  const role = user?.role || "User";

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/login", { replace: true });
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "linear-gradient(90deg, #F2867A 0%, #EF6F62 100%)",
        boxShadow: "0 2px 12px rgba(15, 23, 42, 0.12)"
      }}
    >
      <Toolbar sx={{ minHeight: 68 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: 2,
            borderRadius: "10px",
            "&:hover": { bgcolor: "rgba(255,255,255,0.12)" }
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 0.2 }}
        >
          ERP Management System
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={role}
            size="small"
            sx={{
              color: "white",
              borderColor: "rgba(255,255,255,0.5)",
              bgcolor: "rgba(255,255,255,0.1)",
              fontWeight: 600,
              letterSpacing: 0.3
            }}
            variant="outlined"
          />

          <Typography variant="body1" sx={{ display: { xs: "none", md: "block" }, opacity: 0.9 }}>
            Welcome, {username}
          </Typography>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{
              "&:hover": { bgcolor: "rgba(255,255,255,0.12)" }
            }}
          >
            <Avatar
              src={profileImage}
              sx={{
                width: 34,
                height: 34,
                bgcolor: "#ffffff",
                color: "#EF6F62",
                fontWeight: 700,
                fontSize: "0.95rem",
                border: "2px solid rgba(255,255,255,0.4)"
              }}
            >
              {!profileImage && username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1,
                borderRadius: "12px",
                minWidth: 180,
                boxShadow: "0 12px 32px rgba(15, 23, 42, 0.16)"
              }
            }}
          >
            <MenuItem onClick={handleProfile} sx={{ py: 1.2, borderRadius: "8px", mx: 0.5 }}>
              <Person sx={{ mr: 1.5, fontSize: 20, color: "#F2867A" }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ py: 1.2, borderRadius: "8px", mx: 0.5 }}>
              <Logout sx={{ mr: 1.5, fontSize: 20, color: "#EF4444" }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;