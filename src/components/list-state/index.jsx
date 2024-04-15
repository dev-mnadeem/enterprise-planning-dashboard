import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from 'src/utils/table';

export function ListLoading({ label }) {
  return (
    <Container>
      <Skeleton variant="text" width={240} height={48} sx={{ mb: 4 }} />
      <Card sx={{ p: 3 }} role="status" aria-live="polite">
        <span style={visuallyHidden}>{`Loading ${label}`}</span>
        <Skeleton variant="rounded" width={320} height={48} sx={{ mb: 3, maxWidth: 1 }} />
        <Stack spacing={1.5}>
          {[0, 1, 2, 3, 4].map((row) => (
            <Skeleton key={row} variant="rounded" height={40} />
          ))}
        </Stack>
      </Card>
    </Container>
  );
}

ListLoading.propTypes = {
  label: PropTypes.string.isRequired,
};

export function ListError({ label, message, onRetry }) {
  return (
    <Container>
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Try again
            </Button>
          )
        }
      >
        <Typography variant="subtitle2" component="p">
          {`Couldn't load ${label}.`}
        </Typography>
        {message && <Typography variant="body2">{message}</Typography>}
      </Alert>
    </Container>
  );
}

ListError.propTypes = {
  label: PropTypes.string.isRequired,
  message: PropTypes.string,
  onRetry: PropTypes.func,
};

export function TableEmptyState({ title, hint }) {
  return (
    <TableRow>
      <TableCell colSpan={12} sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="subtitle1">{title}</Typography>
        {hint && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {hint}
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
}

TableEmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  hint: PropTypes.string,
};
