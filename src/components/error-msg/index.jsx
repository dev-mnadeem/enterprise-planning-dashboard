import React from 'react';
import { Box, Typography } from '@mui/material';

const ErrorMsg = (props) => {
  return (
    <Box sx={{ marginTop: '4px' }}>
      <Typography variant="body2" fontWeight={400} color="red">
        <>{props.error}</>
      </Typography>
    </Box>
  );
};

export default ErrorMsg;
