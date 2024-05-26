import { Box, InputAdornment } from '@mui/material';
import { InputField } from '..';

export default function NumberField({ title, unit }) {
  return (
    <Box display="flex" alignItems="center" className="">
      <InputField
        type="number"
        title={title}
        name="weight"
        required
        value={0}
        onChange={(value) => {
          setFieldTouched('weight', true);
          setFieldValue('weight', value);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <Box
                display="flex"
                alignItems="center"
                style={{ backgroundColor: '#f0f0f0', padding: '0 10px' }}
              >
                {unit}
              </Box>
            </InputAdornment>
          ),
          style: { textAlign: 'center' },
        }}
        variant="outlined"
        inputProps={{ min: 0, step: 0.1, style: { textAlign: 'center' } }}
      />
    </Box>
  );
}
