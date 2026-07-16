import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Chip,
  Alert,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import API from "../services/api";

const schema = yup.object({
  name: yup.string().required("Product name is required"),
  sku: yup.string().required("SKU is required"),
  category: yup.string().required("Category is required"),
  unitPrice: yup.number().positive("Unit price must be positive").required("Unit price is required"),
  currentStock: yup.number().min(0, "Current stock cannot be negative").required("Current stock is required"),
  reorderLevel: yup.number().min(0, "Reorder level cannot be negative").required("Reorder level is required"),
});

function Products() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/api/products");
      setProducts(res.data);
    } catch (error) {
      setError("Failed to fetch products");
    }
  };

  const handleOpen = (product = null) => {
    setEditingProduct(product);
    if (product) {
      reset(product);
    } else {
      reset({
        name: "",
        sku: "",
        category: "",
        unitPrice: "",
        currentStock: "",
        reorderLevel: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
    setError("");
    setSuccess("");
  };

  const onSubmit = async (data) => {
    try {
      if (editingProduct) {
        await API.put(`/api/products/${editingProduct.id}`, data);
        setSuccess("Product updated successfully");
      } else {
        await API.post("/api/products", data);
        setSuccess("Product created successfully");
      }
      fetchProducts();
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      setError("Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/api/products/${id}`);
        setSuccess("Product deleted successfully");
        fetchProducts();
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError("Failed to delete product");
      }
    }
  };

  const getStockStatus = (product) => {
    if (product.currentStock === 0) return { label: "Out of Stock", color: "error" };
    if (product.currentStock <= product.reorderLevel) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
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
          Products
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
          Add Product
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: "10px" }}>{success}</Alert>}

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "14px", border: "1px solid #F3DAD5", overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ background: "linear-gradient(90deg, #F2867A 0%, #EF6F62 100%)" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>SKU</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Category</TableCell>
              <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Unit Price</TableCell>
              <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Current Stock</TableCell>
              <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Reorder Level</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Status</TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const status = getStockStatus(product);
              return (
                <TableRow key={product.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                  <TableCell sx={{ fontWeight: 500, color: "#2A1714" }}>{product.name}</TableCell>
                  <TableCell sx={{ color: "#7A6D67" }}>{product.sku}</TableCell>
                  <TableCell sx={{ color: "#7A6D67" }}>{product.category}</TableCell>
                  <TableCell align="right" sx={{ color: "#2A1714", fontWeight: 600 }}>${product.unitPrice}</TableCell>
                  <TableCell align="right" sx={{ color: "#7A6D67" }}>{product.currentStock}</TableCell>
                  <TableCell align="right" sx={{ color: "#7A6D67" }}>{product.reorderLevel}</TableCell>
                  <TableCell>
                    <Chip label={status.label} color={status.color} size="small" sx={{ fontWeight: 600, borderRadius: "6px" }} />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleOpen(product)}
                      sx={{ color: "#F2867A", "&:hover": { bgcolor: "#FDEDEA" } }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(product.id)}
                      sx={{ color: "#EF4444", "&:hover": { bgcolor: "#FEF2F2" } }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ background: "linear-gradient(90deg, #F2867A 0%, #EF6F62 100%)", color: "white", fontWeight: 700 }}>
          {editingProduct ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Product Name"
              margin="normal"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth
              label="SKU"
              margin="normal"
              {...register("sku")}
              error={!!errors.sku}
              helperText={errors.sku?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth
              label="Category"
              margin="normal"
              {...register("category")}
              error={!!errors.category}
              helperText={errors.category?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth
              label="Unit Price"
              margin="normal"
              type="number"
              step="0.01"
              {...register("unitPrice")}
              error={!!errors.unitPrice}
              helperText={errors.unitPrice?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth
              label="Current Stock"
              margin="normal"
              type="number"
              {...register("currentStock")}
              error={!!errors.currentStock}
              helperText={errors.currentStock?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth
              label="Reorder Level"
              margin="normal"
              type="number"
              {...register("reorderLevel")}
              error={!!errors.reorderLevel}
              helperText={errors.reorderLevel?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose} sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px", color: "#9C9491" }}>
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
            {editingProduct ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Products;