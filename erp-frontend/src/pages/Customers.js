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

const schema = yup.object({
  name: yup.string().required("Customer name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
});

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get("/api/customers");
      setCustomers(response.data);
      setError("");
    } catch (err) {
      setError(`Error: ${err.response?.status === 403 ? "Access Denied (Role Issue)" : "Failed to fetch customers"}`);
      console.error("Backend Error:", err.response);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleOpen = (customer = null) => {
    setEditingCustomer(customer);
    if (customer) {
      reset(customer);
    } else {
      reset({ name: "", email: "", phone: "", address: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCustomer(null);
    setError("");
  };

  const onSubmit = async (data) => {
    try {
      if (editingCustomer) {
        await API.put(`/api/customers/${editingCustomer.id}`, data);
        setSuccess("Customer updated successfully");
      } else {
        await API.post("/api/customers", data);
        setSuccess("Customer created successfully");
      }
      fetchCustomers();
      setTimeout(() => handleClose(), 1500);
    } catch (err) {
      setError("Failed to save customer data");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await API.delete(`/api/customers/${id}`);
        setSuccess("Customer deleted successfully");
        fetchCustomers();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Failed to delete customer");
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
          width: "100%",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#3D2B28",
            fontWeight: "bold",
            m: 0,
            lineHeight: 1.2,
          }}
        >
          Customers
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
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
          Add Customer
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
              {customers.map((customer) => (
                <TableRow
                  key={customer.id}
                  hover
                  sx={{ "&:last-child td": { borderBottom: 0 }, transition: "background-color 0.15s" }}
                >
                  <TableCell sx={{ fontWeight: 500, color: "#2A1714" }}>{customer.name}</TableCell>
                  <TableCell sx={{ color: "#7A6D67" }}>{customer.email}</TableCell>
                  <TableCell sx={{ color: "#7A6D67" }}>{customer.phone}</TableCell>
                  <TableCell sx={{ color: "#7A6D67" }}>{customer.address}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleOpen(customer)}
                      sx={{ color: "#F2867A", "&:hover": { bgcolor: "#FDEDEA" } }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(customer.id)}
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

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ pb: 1, background: "linear-gradient(90deg, #F2867A 0%, #EF6F62 100%)", color: "white", fontWeight: 700 }}>
          {editingCustomer ? "Edit Customer" : "Add New Customer"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              fullWidth label="Customer Name" margin="normal" {...register("name")}
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
              fullWidth label="Address" margin="normal" multiline rows={3} {...register("address")}
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
            {editingCustomer ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Customers;