import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';

// A shipment's history comes back newest first; history[0] is its latest scan.
export const STAGES = {
  in: { label: 'Received', long: 'Received at a location', color: 'primary' },
  out: { label: 'Dispatched', long: 'Dispatched', color: 'secondary' },
};

export default function ShipmentStageChip({ scan }) {
  const stage = STAGES[scan?.status];
  if (!stage) return <Chip size="small" variant="outlined" label="Booked" />;

  return (
    <Chip
      size="small"
      color={stage.color}
      label={scan?.name ? `${stage.label} · ${scan.name}` : stage.label}
    />
  );
}

ShipmentStageChip.propTypes = {
  scan: PropTypes.shape({ status: PropTypes.string, name: PropTypes.string }),
};
