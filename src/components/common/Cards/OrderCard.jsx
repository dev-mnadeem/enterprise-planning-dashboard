import PropTypes from 'prop-types';
import { Container, Typography } from '@mui/material';

export const OrderCard = ({ data, label }) => {
  return (
    <Container
      sx={{
        padding: '12px !important',
        border: '1px solid #e6eaed',
        borderRadius: '12px',
        height:"100%",

        "&:hover": {
            backgroundColor: "white",
          },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textTransform: 'uppercase',
          margin: '12px 0px',
        }}
      >
        {label}
      </Typography>

      {data.map((item) => {
        return (
          <Container
            sx={{
              gap: '12px',
              display: 'flex',
              flexDirection: 'row',
              padding: '0px !important',
            }}
          >
            {item.label && (
              <Typography
                variant="body1"
                sx={{
                  width: '100%',
                  maxWidth: '150px',
                  fontWeight: 500,
                }}
              >
                {item.label}:
              </Typography>
            )}
            <Typography variant="body2">{item.value}</Typography>
          </Container>
        );
      })}
    </Container>
  );
};

OrderCard.prototype = {
  label: PropTypes.string,
  data: PropTypes.arrayOf({ label: PropTypes.string, value: PropTypes.string }),
};
