import React, { useState, useEffect, Fragment } from "react";
import {
  Container, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, IconButton, Alert, MenuItem, Chip, Collapse, Grid, Card,
  CardContent, CircularProgress, Divider
} from "@mui/material";

import { Add, Edit, Delete, ExpandMore, ExpandLess, FileDownload } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import API from "../services/api";

const schema = yup.object({
  invoiceDate: yup.string().required("Required"),
  dueDate: yup.string().required("Required"),
  status: yup.string().default("Unpaid"),
});

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [gstPercentage, setGstPercentage] = useState(18);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => { fetchInitialData(); }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [invoicesRes, ordersRes] = await Promise.all([
        API.get("/api/invoices"),
        API.get("/api/sales-orders"),
      ]);
      setInvoices(invoicesRes.data || []);
      setSalesOrders(ordersRes.data || []);
    } catch (err) { setError("Data load failed"); }
    setLoading(false);
  };

  const handleOpen = (invoice = null) => {
    setEditingInvoice(invoice);
    if (invoice) {
      setInvoiceItems([{
        customerName: invoice.customerName,
        orderAmount: invoice.amount,
        orderId: invoice.salesOrderId
      }]);
      const currentGst = invoice.amount > 0 ? (invoice.tax / invoice.amount) * 100 : 18;
      setGstPercentage(currentGst);
      reset({
        invoiceDate: invoice.date ? invoice.date.split('T')[0] : '',
        dueDate: invoice.dueDate ? invoice.dueDate.split('T')[0] : '',
        status: invoice.status || "Unpaid"
      });
    } else {
      setInvoiceItems([]);
      setGstPercentage(18);
      reset({
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "Unpaid",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingInvoice(null);
    setInvoiceItems([]);
    setSelectedOrder("");
    reset();
  };

  const calculateSubtotal = () => invoiceItems.reduce((sum, item) => sum + (item.orderAmount || 0), 0);
  const calculateGSTAmount = () => (calculateSubtotal() * gstPercentage) / 100;
  const calculateTotal = () => (calculateSubtotal() + calculateGSTAmount()).toFixed(2);

  const onSubmit = async (data) => {
    if (invoiceItems.length === 0) {
      setError("Please add an order first");
      return;
    }
    try {
      const total = parseFloat(calculateTotal());
      const invoiceData = {
        id: editingInvoice ? editingInvoice.id : null,
        customerName: invoiceItems[0]?.customerName,
        salesOrderId: invoiceItems[0]?.orderId,
        date: data.invoiceDate,
        dueDate: data.dueDate,
        amount: calculateSubtotal(),
        tax: calculateGSTAmount(),
        totalPayable: total,
        status: data.status
      };

      if (editingInvoice) {
        await API.put(`/api/invoices/${editingInvoice.id}`, invoiceData);
        setSuccess("Invoice updated successfully!");
      } else {
        await API.post("/api/invoices", invoiceData);
        setSuccess("Invoice created successfully!");
      }
      fetchInitialData();
      handleClose();
    } catch (err) {
      setError("Save failed. Check backend connection.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await API.delete(`/api/invoices/${id}`);
        setSuccess("Deleted successfully!");
        fetchInitialData();
      } catch (err) { setError("Delete failed"); }
    }
  };

  const downloadInvoice = (invoice) => {
    const content = `
INVOICE REPORT
===============================
Invoice ID: INV-${invoice.id}
Date: ${invoice.date || "N/A"}
Customer: ${invoice.customerName}
Status: ${invoice.status}

FINANCIALS
-------------------------------
Subtotal:   ₹${parseFloat(invoice.amount || 0).toFixed(2)}
GST:        ₹${parseFloat(invoice.tax || 0).toFixed(2)}
TOTAL:      ₹${parseFloat(invoice.totalPayable || 0).toFixed(2)}
===============================
    `;
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Invoice_INV-${invoice.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", mb: 3, }} > <Typography variant="h4" sx={{ color: "#3D2B28", fontWeight: "bold", m: 0, lineHeight: 1.2, }} > Invoices
      </Typography> <Button variant="contained" startIcon={<Add />} onClick={handleOpen} sx={{ bgcolor: "#F2867A", color: "#fff", borderRadius: "10px", textTransform: "none", fontWeight: 600, px: 3, py: 1, minHeight: "42px", boxShadow: "0 4px 12px rgba(242, 134, 122, 0.3)", "&:hover": { bgcolor: "#EF6F62", boxShadow: "0 6px 16px rgba(242, 134, 122, 0.4)", }, }} >
          Create Invoice
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: "10px" }} onClose={() => setSuccess("")}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }} onClose={() => setError("")}>{error}</Alert>}

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "14px", border: "1px solid #F3DAD5", overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ background: "linear-gradient(90deg, #F2867A 0%, #EF6F62 100%)" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Invoice #</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Date</TableCell>
              <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Amount</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Status</TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: 700, borderBottom: "none" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((inv) => (
              <Fragment key={inv.id}>
                <TableRow hover>
                  <TableCell sx={{ fontWeight: 600, color: "#2A1714" }}>INV-{inv.id}</TableCell>
                  <TableCell sx={{ color: "#7A6D67" }}>{inv.date || "N/A"}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "#2A1714" }}>₹{parseFloat(inv.totalPayable || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={inv.status}
                      color={inv.status === "Paid" ? "success" : "warning"}
                      size="small"
                      sx={{ fontWeight: 600, borderRadius: "6px" }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => setExpandedInvoice(expandedInvoice === inv.id ? null : inv.id)} sx={{ color: "#9C9491" }}>
                      <ExpandMore />
                    </IconButton>

                    <IconButton onClick={() => downloadInvoice(inv)} sx={{ color: "#10B981", "&:hover": { bgcolor: "#ECFDF5" } }}>
                      <FileDownload fontSize="small" />
                    </IconButton>

                    <IconButton onClick={() => handleOpen(inv)} sx={{ color: "#F2867A", "&:hover": { bgcolor: "#FDEDEA" } }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(inv.id)} sx={{ color: "#EF4444", "&:hover": { bgcolor: "#FEF2F2" } }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={expandedInvoice === inv.id} timeout="auto">
                      <Box sx={{ p: 2.5, bgcolor: '#FFF7F5', borderRadius: "10px", m: 1, border: "1px solid #F3DAD5" }}>
                        <Typography variant="subtitle2" sx={{ color: "#5C4F4A" }}><strong>Customer:</strong> {inv.customerName}</Typography>
                        <Typography variant="body2" sx={{ color: "#7A6D67" }}>Subtotal: ₹{parseFloat(inv.amount || 0).toFixed(2)}</Typography>
                        <Typography variant="body2" sx={{ color: "#7A6D67" }}>Tax (GST): ₹{parseFloat(inv.tax || 0).toFixed(2)}</Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ color: "#F2867A", mt: 0.5 }}>Total: ₹{inv.totalPayable}</Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ pb: 1, background: "linear-gradient(90deg, #F2867A 0%, #EF6F62 100%)", color: "white", fontWeight: 700 }}>
          {editingInvoice ? "Edit Invoice" : "New Invoice"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Invoice Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register("invoiceDate")}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                  "& .MuiInputLabel-root": { backgroundColor: "#fff", px: 0.5 },
                }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register("dueDate")}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                  "& .MuiInputLabel-root": { backgroundColor: "#fff", px: 0.5 },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField select fullWidth label="Select Sales Order" value={selectedOrder} onChange={(e) => setSelectedOrder(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}>
                {salesOrders.map(o => <MenuItem key={o.id} value={o.id}>SO-{o.id} ({o.customerName}) - ₹{o.totalAmount}</MenuItem>)}
              </TextField>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mt: 1,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#F2867A",
                  borderColor: "#F7C4BA",
                  "&:hover": { borderColor: "#F2867A", bgcolor: "#FDEDEA" }
                }}
                onClick={() => {
                  const order = salesOrders.find(o => o.id == selectedOrder);
                  if (order) setInvoiceItems([{ customerName: order.customerName, orderAmount: order.totalAmount, orderId: order.id }]);
                }}
              >
                Load Order Data
              </Button>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="GST (%)" type="number" value={gstPercentage} onChange={(e) => setGstPercentage(parseFloat(e.target.value))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField select fullWidth label="Status" {...register("status")} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined" sx={{ bgcolor: '#FDEDEA', borderRadius: "12px", borderColor: "#F7C4BA" }}>
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="h5" fontWeight="800" align="center" sx={{ color: "#EF6F62" }}>
                    Total: ₹{calculateTotal()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose} color="inherit" sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            sx={{
              bgcolor: "#F2867A",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "8px",
              px: 3,
              "&:hover": { bgcolor: "#EF6F62" }
            }}
          >
            Save Invoice
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Invoices;