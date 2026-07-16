import React, { useState, useEffect } from "react";
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Box, IconButton, Alert,
  MenuItem, Chip, Collapse, Grid, Card, CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, ExpandMore, ExpandLess, Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import API from "../services/api";

const schema = yup.object({
  poNumber: yup.string().required("PO number is required"),
  receivedDate: yup.date().required("Received date is required"),
  receivedBy: yup.string().required("Received by is required"),
  status: yup.string().required("Status is required"),
});

function GRN() {
  const [grns, setGrns] = useState([]);

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingGrn, setEditingGrn] = useState(null);
  const [expandedGrn, setExpandedGrn] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [receivedItems, setReceivedItems] = useState([]);
  const [selectedPO, setSelectedPO] = useState("");
  const [receivedQuantity, setReceivedQuantity] = useState("");

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [grnsRes, posRes] = await Promise.all([
        API.get("/api/grns"),
        API.get("/api/purchase-orders"),
      ]);

      console.log("Purchase Orders:", posRes.data);
      setGrns(grnsRes.data || []);
      setPurchaseOrders(posRes.data || []);
    } catch (err) {
      setError("Failed to fetch data. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (grn = null) => {
    setEditingGrn(grn);
    setReceivedItems(grn?.items || []);
    if (grn) {
      reset({
        poNumber: grn.poNumber,
        receivedDate: grn.receivedDate?.split('T')[0] || '',
        receivedBy: grn.receivedBy,
        status: grn.status,
      });
    } else {
      reset({
        poNumber: "",
        receivedDate: new Date().toISOString().split('T')[0],
        receivedBy: "",
        status: "Pending",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingGrn(null);
    setReceivedItems([]);
    setSelectedPO("");
    setReceivedQuantity("");
    setError("");
  };

  // Fix: Comparison using double equals (==) to handle string vs number
  const addReceivedItem = () => {
    if (!selectedPO || !receivedQuantity) {
      setError("Pehle PO select karein aur quantity daalein!");
      return;
    }

    const po = purchaseOrders.find(p => p.id == selectedPO);
    if (!po) return;

    const newItem = {
      id: Date.now(),
      poId: po.id,
      poNumber: `PO-${po.id}`,
      receivedQuantity: parseInt(receivedQuantity),
      status: "Received",
    };

    setReceivedItems([...receivedItems, newItem]);
    // Set main PO field to reflect the reference
    if (receivedItems.length === 0) setValue("poNumber", newItem.poNumber);

    setSelectedPO("");
    setReceivedQuantity("");
    setError("");
  };

  const removeReceivedItem = (itemId) => {
    setReceivedItems(receivedItems.filter(item => item.id !== itemId));
  };

  const onSubmit = async (data) => {
    if (receivedItems.length === 0) {
      setError("Kam se kam ek item list mein add karein!");
      return;
    }

    try {
      const grnData = {
        ...data,
        items: receivedItems.map(item => `${item.poNumber}|${item.receivedQuantity}|${item.status}`),
      };

      if (editingGrn) {
        await API.put(`/api/grns/${editingGrn.id}`, grnData);
        setSuccess("GRN updated successfully");
      } else {
        await API.post("/api/grns", grnData);
        setSuccess("GRN created successfully");
      }

      fetchInitialData();
      setTimeout(handleClose, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save GRN");
    }
  };

  const handleDelete = async (id) => {
    // Confirm if ID  is null
    if (!id) {
      setError("Invalid ID: Delete fail");
      return;
    }

    if (window.confirm("Kya aap ise delete karna chahte hain?")) {
      try {
        await API.delete(`/api/grns/${id}`);
        setSuccess("GRN successfully delete ho gaya!");
        fetchInitialData();
      } catch (err) {
        console.error("Delete Error:", err);
        setError("Backend se delete fail ho gaya. Console dekhein.");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "warning";
      case "approved": return "success";
      case "rejected": return "error";
      default: return "info";
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress sx={{ color: "#F2867A" }} />
    </Box>
  );

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
          Goods Receipt Note (GRN)
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
          Create GRN
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }} onClose={() => setError("")}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: "10px" }} onClose={() => setSuccess("")}>{success}</Alert>}

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "14px", border: "1px solid #F3DAD5", overflowX: "auto" }}>
        <Table sx={{ minWidth: 1100 }}>
          <TableHead sx={{ background: "linear-gradient(90deg, #F2867A 0%, #EF6F62 100%)" }}>
            <TableRow>
              <TableCell sx={{
                borderBottom: "none",
                width: "50px"
              }} />
              <TableCell sx={{ color: "white", fontWeight: 700, borderBottom: "none" }}>GRN ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700, borderBottom: "none" }}>PO Number</TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: 700,
                  borderBottom: "none",
                  minWidth: "170px",
                  whiteSpace: "nowrap"
                }}
              >
                Received Date
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700, borderBottom: "none" }}>Received By</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700, borderBottom: "none" }}>Status</TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: 700, borderBottom: "none" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grns.map((grn) => (
              <React.Fragment key={grn.id}>
                <TableRow hover>
                  <TableCell>
                    <IconButton size="small" onClick={() => setExpandedGrn(expandedGrn === grn.id ? null : grn.id)}>
                      {expandedGrn === grn.id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#2A1714" }}>#{grn.id}</TableCell>
                  <TableCell sx={{ color: "#7A6D67" }}>{grn.poNumber}</TableCell>
                  <TableCell
                    sx={{
                      color: "#7A6D67",
                      width: "150px",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {new Date(grn.receivedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ color: "#7A6D67" }}>{grn.receivedBy}</TableCell>
                  <TableCell><Chip label={grn.status} color={getStatusColor(grn.status)} size="small" sx={{ fontWeight: 600, borderRadius: "6px" }} /></TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleOpen(grn)} sx={{ color: "#F2867A", "&:hover": { bgcolor: "#FDEDEA" } }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(grn.id)}
                      sx={{ color: "#EF4444", "&:hover": { bgcolor: "#FEF2F2" } }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={expandedGrn === grn.id} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2, p: 2.5, bgcolor: "#FFF7F5", borderRadius: "10px", border: "1px solid #F3DAD5" }}>
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: "#5C4F4A" }}>
                          Items Detail
                        </Typography>
                        {grn.items?.map((item, index) => (
                          <Typography key={index} variant="body2" sx={{ color: "#7A6D67", py: 0.3 }}>
                            • {item.replace(/\|/g, ' — Qty: ')}
                          </Typography>
                        ))}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
            {grns.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: "#BBAFA9" }}>No GRNs found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ background: "linear-gradient(90deg, #F2867A 0%, #EF6F62 100%)", color: "white", fontWeight: 700 }}>
          {editingGrn ? "Edit GRN" : "Create New GRN"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="PO Reference"
                {...register("poNumber")}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="date"
                {...register("receivedDate")}
                label="Received Date"
                InputLabelProps={{ shrink: true }}
                sx={{ "& .MuiInputLabel-root": { backgroundColor: "#fff", px: 0.5 } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Received By"
                {...register("receivedBy")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select fullWidth label="Status" {...register("status")} defaultValue="Pending" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" fontWeight={700} sx={{ color: "#F2867A" }}>Add Received Items</Typography>
            </Grid>

            {/* Dropdown Fix: Full width and clear label */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                value={selectedPO}
                onChange={(e) => setSelectedPO(e.target.value)}
                label="Select Purchase Order"
                SelectProps={{
                  displayEmpty: true
                }}
              >
                <MenuItem value="">
                  Select Purchase Order
                </MenuItem>

                {purchaseOrders.map((po) => (
                  <MenuItem key={po.id} value={po.id}>
                    PO-{po.id} ({po.supplierName})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth type="number" label="Quantity" value={receivedQuantity} onChange={(e) => setReceivedQuantity(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  height: '56px',
                  borderRadius: "10px",
                  bgcolor: "#10B981",
                  textTransform: "none",
                  fontWeight: 700,
                  '&:hover': { bgcolor: "#059669" }
                }}
                onClick={addReceivedItem}
              >
                Add
              </Button>
            </Grid>

            <Grid size={{ xs: 12 }}>
              {receivedItems.map((item) => (
                <Card
                  key={item.id}
                  sx={{
                    mb: 1,
                    bgcolor: '#F0FDF4',
                    borderLeft: '4px solid #10B981',
                    borderRadius: "10px",
                    boxShadow: "none",
                    border: "1px solid #DCFCE7"
                  }}
                >
                  <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight="600" sx={{ color: "#166534" }}>
                      {item.poNumber} — Quantity Received: {item.receivedQuantity}
                    </Typography>
                    <IconButton size="small" onClick={() => removeReceivedItem(item.id)} sx={{ color: "#EF4444" }}>
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                </Card>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit" sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            sx={{
              px: 4,
              borderRadius: "8px",
              bgcolor: "#F2867A",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: "#EF6F62" }
            }}
          >
            Save GRN Record
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default GRN;