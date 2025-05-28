import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Pagination,
  Alert,
  Skeleton,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Archive as ArchiveIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

import SKUCard from '../../components/skus/SKUCard';
import SKUTableView from '../../components/skus/SKUTableView';
import SKUFilterDialog from '../../components/skus/SKUFilterDialog';

function SKUManagement() {
  const navigate = useNavigate();
  const [skus, setSkUs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: [],
    warehouse: [],
    minStock: '',
    maxStock: '',
    supplier: []
  });
  const [selectedSku, setSelectedSku] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchSKUs();
  }, [page, filters]);

  // This is a mock function that would normally fetch data from the API
  const fetchSKUs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/skus', {
        params: {
          page,
          limit: 12,
          search: searchTerm,
          ...filters
        }
      });
      setSkUs(response.data.skus);
      setTotalPages(response.data.pages);
      setLoading(false);
    } catch (err) {
      setError('Failed to load SKUs. Please try again later.');
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchSKUs();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setFilterDialogOpen(false);
  };

  const handleFilterReset = () => {
    setFilters({
      category: [],
      warehouse: [],
      minStock: '',
      maxStock: '',
      supplier: []
    });
    setPage(1);
    setFilterDialogOpen(false);
  };

  const handleDeleteSKU = async () => {
    if (!selectedSku) return;
    try {
      await axios.delete(`/api/skus/${selectedSku._id}`);
      toast.success(`SKU ${selectedSku.sku} deleted successfully`);
      // Remove from state using _id
      setSkUs((prevSkus) => prevSkus.filter(sku => sku._id !== selectedSku._id));
      setDeleteDialogOpen(false);
      setSelectedSku(null);
      // Optionally, re-fetch to ensure pagination is correct
      fetchSKUs();
    } catch (error) {
      toast.error('Failed to delete SKU. Please try again.');
    }
  };

  const handleMenuOpen = (event, sku) => {
    setAnchorEl(event.currentTarget);
    setSelectedSku(sku);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditSKU = () => {
    handleMenuClose();
    navigate(`/skus/edit/${selectedSku.id}`);
  };

  const handleViewSKU = () => {
    handleMenuClose();
    navigate(`/skus/${selectedSku.id}`);
  };

  const handleOpenDeleteDialog = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          SKU Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/skus/add')}
          sx={{ py: 1.2 }}
        >
          Add New SKU
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={8}>
            <TextField
              fullWidth
              placeholder="Search by SKU, name, or barcode..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FilterListIcon />}
                sx={{ flexGrow: 1 }}
                onClick={() => setFilterDialogOpen(true)}
              >
                Filters
                {Object.values(filters).some(f => 
                  Array.isArray(f) ? f.length > 0 : f !== ''
                ) && (
                  <Chip 
                    label={Object.values(filters).flat().filter(Boolean).length} 
                    size="small" 
                    color="primary" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Button>
              <Button
                variant="outlined"
                color={viewMode === 'grid' ? 'primary' : 'inherit'}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant="outlined"
                color={viewMode === 'table' ? 'primary' : 'inherit'}
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {viewMode === 'grid' ? (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {loading ? (
                // Skeleton loading
                Array(12).fill(0).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
                    <motion.div variants={itemVariants}>
                      <Card sx={{ height: '100%', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)' }}>
                        <Skeleton variant="rectangular" width="100%" height={140} />
                        <CardContent>
                          <Skeleton variant="text" width="80%" height={28} />
                          <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Skeleton variant="text" width="30%" height={24} />
                            <Skeleton variant="circular" width={32} height={32} />
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))
              ) : (
                skus.map((sku) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={sku._id}>
                    <motion.div variants={itemVariants}>
                      <SKUCard 
                        sku={sku} 
                        onEdit={() => navigate(`/skus/edit/${sku._id}`)}
                        onView={() => navigate(`/skus/${sku._id}`)}
                        onDelete={() => {
                          setSelectedSku(sku);
                          setDeleteDialogOpen(true);
                        }}
                      />
                    </motion.div>
                  </Grid>
                ))
              )}
            </Grid>
          </motion.div>
        </>
      ) : (
        <Box>
          {loading ? (
            <>
              <Skeleton variant="rectangular" width="100%" height={56} />
              {Array(5).fill(0).map((_, index) => (
                <Skeleton key={index} variant="rectangular" width="100%" height={52} sx={{ mt: 0.5 }} />
              ))}
            </>
          ) : (
            <SKUTableView
              skus={skus}
              onEdit={(id) => navigate(`/skus/edit/${id}`)}
              onView={(id) => navigate(`/skus/${id}`)}
              onDelete={(sku) => {
                setSelectedSku(sku);
                setDeleteDialogOpen(true);
              }}
            />
          )}
        </Box>
      )}

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={(e, newPage) => setPage(newPage)}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
        />
      </Box>

      {/* Filter Dialog */}
      <SKUFilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        filters={filters}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete SKU <strong>{selectedSku?.sku}</strong> - {selectedSku?.name}? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteSKU} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewSKU}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditSKU}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit SKU</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ color: 'error' }} />
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default SKUManagement;