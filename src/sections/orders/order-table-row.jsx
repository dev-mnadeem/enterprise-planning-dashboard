import { useState } from 'react';
import Iconify from 'src/components/iconify';
import { Button, Chip, IconButton, MenuItem, Popover, TableCell, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PERMISSION_ENTITIES, PERMISSION_TYPE, ROUTES } from 'src/constants';
import { checkCurrentUserPermission } from 'src/utils';
import { useAppSelector } from 'src/state/hooks';
import { CancelScheduleSend, FlightTakeoff } from '@mui/icons-material';

export default function OrderTableRow({
  id,
  source,
  destination,
  customer,
  history,
  orderNumber,
  onCancelOrder,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const { user } = useAppSelector((state) => state.userReducer);
  const { REMOVE, UPDATE } = PERMISSION_TYPE;
  const { ORDER } = PERMISSION_ENTITIES;

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCancel = (id) => {
    if (!id) return;

    handleCloseMenu();
    const confirmed = window.confirm(`Are you sure to Cancel #"${id}" Shipment?`);
    if (confirmed) {
      onCancelOrder(id);
    }
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-2}>
        <TableCell>{orderNumber}</TableCell>
        <TableCell>{source}</TableCell>
        <TableCell>{destination}</TableCell>
        <TableCell>{customer}</TableCell>
        <TableCell>
          <Chip
            label={`${history?.status?.toUpperCase() || '--'}, (${history?.name || '--'})`}
            color="success"
          />
        </TableCell>
        <TableCell>
          <Button size="small" onClick={() => navigate(`${ROUTES.ORDERS}/${id}`)}>
            View
          </Button>
        </TableCell>
        <TableCell align="right">
          <IconButton aria-label="Row actions" aria-haspopup="menu" onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        {checkCurrentUserPermission(user?.permissions, ORDER, UPDATE) && (
          <MenuItem onClick={() => navigate(`${ROUTES.ORDER_INTAKE}?orderId=${id}`)}>
            <Iconify icon="eva:layers-outline" sx={{ mr: 2 }} />
            Intake
          </MenuItem>
        )}

        {checkCurrentUserPermission(user?.permissions, ORDER, UPDATE) && (
          <MenuItem onClick={() => navigate(`${ROUTES.ORDER_DISPATCH}?orderId=${id}`)}>
            <FlightTakeoff sx={{ mr: 2 }} />
            Dispatch
          </MenuItem>
        )}

        {checkCurrentUserPermission(user?.permissions, ORDER, REMOVE) && (
          <MenuItem onClick={() => handleCancel(id)} sx={{ color: 'error.main' }}>
            <CancelScheduleSend sx={{ mr: 2 }} />
            Cancel
          </MenuItem>
        )}
      </Popover>
    </>
  );
}
