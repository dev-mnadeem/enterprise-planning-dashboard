import { Box, InputAdornment } from '@mui/material';
import { InputField } from '..';

export default function NumberField(props) {
  return (
    <Box display="flex" alignItems="center" className="w-full">
      <InputField
        {...props}
        type="number"
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <Box
                display="flex"
                alignItems="center"
                style={{ backgroundColor: '#f0f0f0', padding: '0 10px' }}
              >
                {props?.unit || ''}
              </Box>
            </InputAdornment>
          ),
          style: { textAlign: 'center' },
        }}
        variant="outlined"
        inputProps={{
          min: 0,
          max: props?.max,
          step: props?.step || 0.01,
          style: { textAlign: 'center' },
        }}
      />
    </Box>
  );
}
