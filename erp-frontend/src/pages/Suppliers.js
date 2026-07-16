import { useState, useEffect, useCallback } from "react";
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Box, IconButton, Alert, CircularProgress
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import API from "../services/api";
import AddIcon from "@mui/icons-material/Add";

const schema = yup.object({
  name: yup.string().required("Supplier name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
});

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get("/api/suppliers");
      setSuppliers(response.data);
      setError("");
    } catch (err) {
      setError(`Error: ${err.response?.status === 403 ? "Access Denied (Role Issue)" : "Failed to load suppliers"}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleOpen = (supplier = null) => {
    setEditingSupplier(supplier);
    if (supplier) {
      reset(supplier);
    } else {
      reset({ name: "", email: "", phone: "", address: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSupplier(null);
    setError("");
  };

  const onSubmit = async (data) => {
    try {
      if (editingSupplier) {
        await API.put(`/api/suppliers/${editingSupplier.id}`, data);
        setSuccess("Supplier updated successfully");
      } else {
        await API.post("/api/suppliers", data);
        setSuccess("Supplier created successfully");
      }
      fetchSuppliers();
      setTimeout(() => handleClose(), 1500);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save supplier. Check backend permissions.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await API.delete(`/api/suppliers/${id}`);
        setSuccess("Supplier deleted successfully");
        fetchSuppliers();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Failed to delete supplier.");
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#2C3E50",
          }}
        >
          Suppliers
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: "#F2867A",
            color: "#fff",
            borderRadius: "10px",
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 6px 16px rgba(242,134,122,0.4)",
            "&:hover": {
              bgcolor: "#E57A6E",
            },
          }}
        >
          Add Supplier
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: "10px" }}>{success}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" my={5}><CircularProgress sx={{ color: "#F2867A" }} /></Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "14px", border: "1px solid #F3DAD5", overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ background: "linear-gradient(90deg, #F2867A 0%, #EF6F62 100%)" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Email</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Phone</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Address</TableCell>
                <TableCell align="center" sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((s) => (
                <TableRow key={s.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                  <TableCell sx={{ fontWeight: 500, color: "#2A1714" }}>{s.name}</TableCell>
                  <TableCell sx={{ color: "#7A6D67" }}>{s.email}</TableCell>
                  <TableCell sx={{ color: "#7A6D67" }}>{s.phone}</TableCell>
                  <TableCell sx={{ color: "#7A6D67" }}>{s.address}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleOpen(s)}
                      sx={{ color: "#F2867A", "&:hover": { bgcolor: "#FDEDEA" } }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(s.id)}
                      sx={{ color: "#EF4444", "&:hover": { bgcolor: "#FEF2F2" } }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ background: "linear-gradient(90deg, #F2867A 0%, #EF6F62 100%)", color: "white", fontWeight: 700 }}>
          {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              fullWidth label="Supplier Name" margin="normal" {...register("name")}
              error={!!errors.name} helperText={errors.name?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth label="Email" margin="normal" {...register("email")}
              error={!!errors.email} helperText={errors.email?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth label="Phone" margin="normal" {...register("phone")}
              error={!!errors.phone} helperText={errors.phone?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth label="Address" margin="normal" multiline rows={2} {...register("address")}
              error={!!errors.address} helperText={errors.address?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose} color="inherit" sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            sx={{
              bgcolor: "#F2867A",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              "&:hover": { bgcolor: "#EF6F62" }
            }}
          >
            {editingSupplier ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Suppliers;