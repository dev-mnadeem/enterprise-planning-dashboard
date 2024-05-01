import { useFormikContext } from 'formik';
import { Box, Typography, TextField } from '@mui/material';

export const InputField = (props) => {
  const context = useFormikContext();

  return (
    <Box>
      <Box className="flex justify-between items-center">
        <Typography>{props.title}</Typography>
      </Box>

      <TextField fullWidth {...props} />
    </Box>
  );
};
