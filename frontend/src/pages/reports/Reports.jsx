import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Stack,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Download as DownloadIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Reports() {
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState('last7days');
  const [loading, setLoading] = useState(false);

  const mockData = {
    stockMovement: [
      { name: 'Mon', inbound: 400, outbound: 240 },
      { name: 'Tue', inbound: 300, outbound: 139 },
      { name: 'Wed', inbound: 200, outbound: 980 },
      { name: 'Thu', inbound: 278, outbound: 390 },
      { name: 'Fri', inbound: 189, outbound: 480 },
    ],
    stockDistribution: [
      { name: 'Electronics', value: 400 },
      { name: 'Clothing', value: 300 },
      { name: 'Food', value: 300 },
      { name: 'Others', value: 200 },
    ],
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Inventory Reports
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            select
            size="small"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="last7days">Last 7 Days</MenuItem>
            <MenuItem value="last30days">Last 30 Days</MenuItem>
            <MenuItem value="custom">Custom Range</MenuItem>
          </TextField>
          <IconButton>
            <DownloadIcon />
          </IconButton>
          <IconButton>
            <PrintIcon />
          </IconButton>
          <IconButton>
            <EmailIcon />
          </IconButton>
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Stock Value
              </Typography>
              <Typography variant="h4">$124,500</Typography>
              <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 1 }} />
                +8.4%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h4">23</Typography>
              <Typography color="error.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingDown sx={{ mr: 1 }} />
                5 Critical
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Stock Turnover Rate
              </Typography>
              <Typography variant="h4">4.2</Typography>
              <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 1 }} />
                Healthy
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Orders
              </Typography>
              <Typography variant="h4">12</Typography>
              <Typography color="warning.main">
                2 Delayed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Stock Movement" />
          <Tab label="Stock Distribution" />
          <Tab label="Adjustments History" />
          <Tab label="Low Stock Alert" />
        </Tabs>
        
        {loading ? (
          <Box sx={{ p: 3 }}>
            <LinearProgress />
          </Box>
        ) : (
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <ResponsiveContainer width="100%\" height={400}>
                <BarChart data={mockData.stockMovement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="inbound" fill="#8884d8" name="Inbound" />
                  <Bar dataKey="outbound" fill="#82ca9d" name="Outbound" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeTab === 1 && (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={mockData.stockDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockData.stockDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}

            {activeTab === 2 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>SKU</TableCell>
                       <TableCell>Quantity</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>2025-01-15</TableCell>
                      <TableCell>
                        <Chip label="Increase" color="success" size="small" />
                      </TableCell>
                      <TableCell>SKU-001</TableCell>
                      <TableCell>+50</TableCell>
                      <TableCell>Purchase Order Receipt</TableCell>
                      <TableCell>
                        <Chip label="Completed" color="success" size="small" />
                      </TableCell>
                    </TableRow>
                    {/* Add more rows as needed */}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {activeTab === 3 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>SKU</TableCell>
                      <TableCell>Current Stock</TableCell>
                      <TableCell>Minimum Stock</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action Required</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>SKU-001</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>20</TableCell>
                      <TableCell>
                        <Chip label="Critical" color="error" size="small" />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="contained">
                          Create PO
                        </Button>
                      </TableCell>
                    </TableRow>
                    {/* Add more rows as needed */}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Reports;