import { useState, useEffect, Fragment } from "react";
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
  Alert,
  MenuItem,
  Chip,
  Collapse,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, ExpandMore, ExpandLess, Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import API from "../services/api";

const schema = yup.object({
  customerName: yup.string().required("Customer name is required"),
  orderDate: yup.string().required("Order date is required"),
  status: yup.string().required("Status is required"),
});

function SalesOrders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        API.get("/api/sales-orders"),
        API.get("/api/customers"),
        API.get("/api/products"),
      ]);
      setOrders(ordersRes.data || []);
      setCustomers(customersRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      setError("Failed to fetch data");
      console.error(error);
    }
    setLoading(false);
  };

  const handleOpen = (order = null) => {
    setEditingOrder(order);
    setOrderItems(order?.products || []);
    if (order) {
      reset({
        customerName: order.customerName,
        orderDate: order.orderDate?.split('T')[0] || '',
        status: order.status,
      });
    } else {
      reset({
        customerName: "",
        orderDate: new Date().toISOString().split('T')[0],
        status: "Pending",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingOrder(null);
    setOrderItems([]);
    setSelectedProduct("");
    setSelectedQuantity("");
    setError("");
    setSuccess("");
  };

  const addProductItem = () => {
    if (!selectedProduct || !selectedQuantity) {
      setError("Please select product and enter quantity");
      return;
    }

    const product = products.find(p => p.id == selectedProduct);
    if (!product) return;

    const newItem = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: parseInt(selectedQuantity),
      unitPrice: product.unitPrice,
      totalPrice: product.unitPrice * parseInt(selectedQuantity),
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedProduct("");
    setSelectedQuantity("");
    setError("");
  };

  const removeProductItem = (itemId) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0).toFixed(2);
  };

  const onSubmit = async (data) => {
    if (orderItems.length === 0) {
      setError("Please add at least one product to the order");
      return;
    }

    try {
      const orderData = {
        ...data,
        productId: orderItems[0].productId,
        quantity: orderItems[0].quantity,
        totalAmount: parseFloat(calculateTotal())
      };

      await API.post("/api/sales-orders", orderData);

      setSuccess("Sales order created successfully");
      fetchInitialData();
      setTimeout(() => handleClose(), 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save sales order");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sales order?")) {
      try {
        await API.delete(`/api/sales-orders/${id}`);
        setSuccess("Sales order deleted successfully");
        fetchInitialData();
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError("Failed to delete sales order");
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.put(`/api/sales-orders/${id}/status`, { status: newStatus });
      setSuccess("Order status updated");
      fetchInitialData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "warning";
      case "approved": return "info";
      case "dispatched": return "primary";
      case "delivered": return "success";
      default: return "default";
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress sx={{ color: "#F2867A" }} />
      </Container>
    );
  }

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
          Sales Orders
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
          Create Order
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }} onClose={() => setError("")}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: "10px" }} onClose={() => setSuccess("")}>{success}</Alert>}

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "14px", border: "1px solid #F3DAD5", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(90deg, #F2867A 0%, #EF6F62 100%)" }}>
              <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Order ID</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Customer</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Order Date</TableCell>
              <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Total Amount</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Status</TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: "#BBAFA9" }}>No sales orders found</TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <Fragment key={order.id}>
                  <TableRow hover>
                    <TableCell sx={{ fontWeight: 600, color: "#2A1714" }}>#{order.id}</TableCell>
                    <TableCell sx={{ color: "#7A6D67" }}>{order.customerName}</TableCell>
                    <TableCell sx={{ color: "#7A6D67" }}>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: "#2A1714" }}>₹{parseFloat(order.totalAmount || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                        sx={{ fontWeight: 600, borderRadius: "6px" }}
                        onClick={() => {
                          const statuses = ["Pending", "Approved", "Dispatched"];
                          const nextStatus = statuses[(statuses.indexOf(order.status) + 1) % statuses.length];
                          handleStatusUpdate(order.id, nextStatus);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => toggleExpand(order.id)}
                        title="View details"
                        sx={{ color: "#9C9491" }}
                      >
                        {expandedOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpen(order)}
                        title="Edit"
                        sx={{ color: "#F2867A", "&:hover": { bgcolor: "#FDEDEA" } }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(order.id)}
                        title="Delete"
                        sx={{ color: "#EF4444", "&:hover": { bgcolor: "#FEF2F2" } }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={expandedOrder === order.id} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2, p: 2.5, bgcolor: "#FFF7F5", borderRadius: "10px", border: "1px solid #F3DAD5" }}>
                          <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: "#5C4F4A" }}>
                            Order Items
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ color: "#9C9491", fontWeight: 600 }}>Product</TableCell>
                                <TableCell align="right" sx={{ color: "#9C9491", fontWeight: 600 }}>Quantity</TableCell>
                                <TableCell align="right" sx={{ color: "#9C9491", fontWeight: 600 }}>Unit Price</TableCell>
                                <TableCell align="right" sx={{ color: "#9C9491", fontWeight: 600 }}>Total</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {order.products && order.products.length > 0 ? (
                                order.products.map((product, idx) => {
                                  const parts = product.split("|");
                                  return (
                                    <TableRow key={idx}>
                                      <TableCell sx={{ color: "#5C4F4A" }}>{parts[0]}</TableCell>
                                      <TableCell align="right" sx={{ color: "#5C4F4A" }}>{parts[1]}</TableCell>
                                      <TableCell align="right" sx={{ color: "#5C4F4A" }}>₹{parseFloat(parts[2]).toFixed(2)}</TableCell>
                                      <TableCell align="right" sx={{ fontWeight: 600, color: "#3D2B28" }}>₹{(parseFloat(parts[1]) * parseFloat(parts[2])).toFixed(2)}</TableCell>
                                    </TableRow>
                                  );
                                })
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4} align="center" sx={{ color: "#BBAFA9" }}>No items</TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ background: "linear-gradient(90deg, #F2867A 0%, #EF6F62 100%)", color: "white", fontWeight: 700 }}>
          {editingOrder ? "Edit Sales Order" : "Create New Sales Order"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  {...register("customerName")}
                  error={!!errors.customerName}
                  helperText={errors.customerName?.message}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Order Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register("orderDate")}
                  error={!!errors.orderDate}
                  helperText={errors.orderDate?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                    "& .MuiInputLabel-root": { backgroundColor: "#fff", px: 0.5 },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  {...register("status")}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Dispatched">Dispatched</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mt: 2, mb: 1, color: "#F2867A" }}>Add Products</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="Select Product"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} (Stock: {product.currentStock})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(e.target.value)}
                  inputProps={{ min: 1 }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  onClick={addProductItem}
                  fullWidth
                  sx={{
                    borderRadius: "10px",
                    bgcolor: "#10B981",
                    textTransform: "none",
                    fontWeight: 700,
                    py: 1.2,
                    "&:hover": { bgcolor: "#059669" }
                  }}
                >
                  Add Product to Order
                </Button>
              </Grid>

              {orderItems.length > 0 && (
                <Grid size={{ xs: 12 }}>
                  <Card elevation={0} sx={{ borderRadius: "12px", border: "1px solid #F3DAD5" }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "#3D2B28" }}>Order Items</Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ color: "#9C9491", fontWeight: 600 }}>Product</TableCell>
                            <TableCell align="right" sx={{ color: "#9C9491", fontWeight: 600 }}>Qty</TableCell>
                            <TableCell align="right" sx={{ color: "#9C9491", fontWeight: 600 }}>Price</TableCell>
                            <TableCell align="right" sx={{ color: "#9C9491", fontWeight: 600 }}>Total</TableCell>
                            <TableCell align="center" sx={{ color: "#9C9491", fontWeight: 600 }}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell sx={{ color: "#5C4F4A" }}>{item.productName}</TableCell>
                              <TableCell align="right" sx={{ color: "#5C4F4A" }}>{item.quantity}</TableCell>
                              <TableCell align="right" sx={{ color: "#5C4F4A" }}>₹{item.unitPrice.toFixed(2)}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600, color: "#3D2B28" }}>₹{item.totalPrice.toFixed(2)}</TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  onClick={() => removeProductItem(item.id)}
                                  sx={{ color: "#EF4444" }}
                                >
                                  <Close fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow sx={{ backgroundColor: "#FDEDEA" }}>
                            <TableCell colSpan={3} align="right"><strong>Total Amount:</strong></TableCell>
                            <TableCell align="right" sx={{ color: "#EF6F62", fontWeight: 800 }}>₹{calculateTotal()}</TableCell>
                            <TableCell />
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose} color="inherit" sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={orderItems.length === 0}
            sx={{
              bgcolor: "#F2867A",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "8px",
              px: 3,
              "&:hover": { bgcolor: "#EF6F62" }
            }}
          >
            {editingOrder ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SalesOrders;