import PropTypes from 'prop-types';
import { Box, Container, Typography } from '@mui/material';

export const OrderCard = ({ data, label }) => {
  return (
    <Box className="border border-solid border-slate-300 rounded-xl p-4 h-full hover:bg-white">
      <Typography className="uppercase my-1" variant="h6">
        {label}
      </Typography>

      {data.map((item) => {
        return (
          <Container className="flex flex-row gap-12 p-0">
            {item.label && (
              <Typography className="body1 w-full max-w-36 font-bold">{item.label}:</Typography>
            )}
            <Typography variant="body2">{item.value}</Typography>
          </Container>
        );
      })}
    </Box>
  );
};

OrderCard.prototype = {
  label: PropTypes.string,
  data: PropTypes.arrayOf({ label: PropTypes.string, value: PropTypes.string }),
};
