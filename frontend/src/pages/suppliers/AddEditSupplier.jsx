import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Autocomplete
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const validationSchema = yup.object({
  name: yup.string().required('Supplier name is required'),
  contactPerson: yup.string().required('Contact person is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.object({
    street: yup.string().required('Street address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().required('ZIP code is required'),
    country: yup.string().required('Country is required'),
  }),
  taxId: yup.string(),
  paymentTerms: yup.string().required('Payment terms are required'),
  leadTime: yup.number().min(1, 'Lead time must be at least 1 day').required('Lead time is required'),
  status: yup.string().required('Status is required'),
});

// Sample categories for demonstration
const sampleCategories = [
  'Electronics',
  'Office Supplies',
  'Furniture',
  'Raw Materials',
  'Packaging',
  'Tools',
  'Safety Equipment',
  'Cleaning Supplies'
];

function AddEditSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEdit = Boolean(id);

  const formik = useFormik({
    initialValues: {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      taxId: '',
      paymentTerms: '',
      leadTime: '',
      status: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (isEdit) {
          await axios.put(`/api/suppliers/${id}`, values);
          alert('Supplier updated!');
        } else {
          await axios.post('/api/suppliers', values);
          alert('Supplier created!');
        }
        navigate('/suppliers');
      } catch (err) {
        setError(err.response?.data?.message || 'Submission failed');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isEdit) {
      setInitialLoading(true);
      axios.get(`/api/suppliers/${id}`)
        .then(res => formik.setValues(res.data))
        .catch(() => setError('Failed to load supplier'))
        .finally(() => setInitialLoading(false));
    }
    // eslint-disable-next-line
  }, [id]);

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          {isEdit ? 'Edit Supplier' : 'Add New Supplier'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {isEdit 
            ? 'Update the details of an existing supplier.' 
            : 'Create a new supplier record in your inventory system.'}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error\" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Supplier Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="contactPerson"
                name="contactPerson"
                label="Contact Person"
                value={formik.values.contactPerson}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.contactPerson && Boolean(formik.errors.contactPerson)}
                helperText={formik.touched.contactPerson && formik.errors.contactPerson}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone Number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Divider />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mt: 2 }}>
                Address
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address.street"
                name="address.street"
                label="Street Address"
                value={formik.values.address.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address?.street && Boolean(formik.errors.address?.street)}
                helperText={formik.touched.address?.street && formik.errors.address?.street}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="address.city"
                name="address.city"
                label="City"
                value={formik.values.address.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
                helperText={formik.touched.address?.city && formik.errors.address?.city}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="address.state"
                name="address.state"
                label="State"
                value={formik.values.address.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address?.state && Boolean(formik.errors.address?.state)}
                helperText={formik.touched.address?.state && formik.errors.address?.state}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="address.zipCode"
                name="address.zipCode"
                label="ZIP Code"
                value={formik.values.address.zipCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address?.zipCode && Boolean(formik.errors.address?.zipCode)}
                helperText={formik.touched.address?.zipCode && formik.errors.address?.zipCode}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="address.country"
                name="address.country"
                label="Country"
                value={formik.values.address.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address?.country && Boolean(formik.errors.address?.country)}
                helperText={formik.touched.address?.country && formik.errors.address?.country}
              />
            </Grid>

            {/* Business Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Divider />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mt: 2 }}>
                Business Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="taxId"
                name="taxId"
                label="Tax ID"
                value={formik.values.taxId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.taxId && Boolean(formik.errors.taxId)}
                helperText={formik.touched.taxId && formik.errors.taxId}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="payment-terms-label">Payment Terms</InputLabel>
                <Select
                  labelId="payment-terms-label"
                  id="paymentTerms"
                  name="paymentTerms"
                  value={formik.values.paymentTerms}
                  onChange={formik.handleChange}
                  label="Payment Terms"
                >
                  <MenuItem value="Net 30">Net 30</MenuItem>
                  <MenuItem value="Net 45">Net 45</MenuItem>
                  <MenuItem value="Net 60">Net 60</MenuItem>
                  <MenuItem value="Immediate">Immediate</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="leadTime"
                name="leadTime"
                label="Lead Time (days)"
                type="number"
                value={formik.values.leadTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.leadTime && Boolean(formik.errors.leadTime)}
                helperText={formik.touched.leadTime && formik.errors.leadTime}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="categories"
                options={sampleCategories}
                value={formik.values.categories}
                onChange={(event, newValue) => {
                  formik.setFieldValue('categories', newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Supply Categories"
                    placeholder="Select categories"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Additional Notes"
                multiline
                rows={4}
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>

            {/* Form Actions */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate('/suppliers')}
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  {loading ? 'Saving...' : `${isEdit ? 'Update' : 'Create'} Supplier`}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddEditSupplier;