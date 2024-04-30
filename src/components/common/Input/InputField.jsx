import { Box, Typography, TextField, TextFieldProps } from '@mui/material';

export const InputField = (props) => {
  return (
    <Box>
      <Box className="flex justify-between items-center">
        <Typography>{props.title}</Typography>
      </Box>

      <TextField fullWidth {...props} />
    </Box>
  );
};
