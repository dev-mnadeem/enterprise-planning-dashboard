import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { RouterLink } from 'src/routes/components';
import { useQuery } from 'src/api';

// One cell of the figures strip at the top of the overview. Each cell fetches
// its own figure so a role only triggers requests for entities it may view.
export function LedgerCell({ label, endpoint, select, caption, to }) {
  const { data, loading, error } = useQuery(endpoint);
  const figure = data ? select(data) : null;

  return (
    <Box sx={{ p: 3, minWidth: 0 }}>
      <Typography
        variant="overline"
        component="h2"
        sx={{ color: 'text.secondary', letterSpacing: '0.08em' }}
      >
        {label}
      </Typography>
      {loading && !data ? (
        <Skeleton variant="text" width={80} height={56} />
      ) : (
        <Typography variant="h3" component="p" sx={{ fontVariantNumeric: 'tabular-nums' }}>
          {error ? '--' : figure?.value}
        </Typography>
      )}
      <Typography variant="body2" sx={{ color: 'text.secondary', minHeight: 22 }}>
        {error ? 'Unavailable right now' : (figure?.caption ?? caption)}
      </Typography>
      <Link
        component={RouterLink}
        href={to}
        variant="subtitle2"
        sx={{ mt: 1, display: 'inline-block' }}
      >
        {`Open ${label.toLowerCase()}`}
      </Link>
    </Box>
  );
}

LedgerCell.propTypes = {
  label: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired,
  select: PropTypes.func.isRequired,
  caption: PropTypes.string,
  to: PropTypes.string.isRequired,
};

export default function LedgerStrip({ children }) {
  return (
    <Card
      component="section"
      aria-label="Key figures"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        '& > *': {
          borderColor: 'divider',
          borderStyle: 'solid',
          borderWidth: 0,
          borderBottomWidth: { xs: 1, lg: 0 },
          borderRightWidth: { lg: 1 },
        },
        '& > *:last-of-type': { borderWidth: 0 },
      }}
    >
      {children}
    </Card>
  );
}

LedgerStrip.propTypes = {
  children: PropTypes.node,
};
