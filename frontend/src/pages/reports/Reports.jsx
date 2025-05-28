import { useState } from 'react';
import {
  Box,
  Typography,
  Paper
} from '@mui/material';

function Reports() {
  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Reports
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>
          Reporting interface coming soon...
        </Typography>
      </Paper>
    </Box>
  );
}

export default Reports;