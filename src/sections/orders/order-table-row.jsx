import { useState } from 'react';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import { Button, Chip, IconButton, MenuItem, Popover, TableCell, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PERMISSION_ENTITIES, PERMISSION_TYPE, ROUTES } from 'src/constants';
import { checkCurrentUserPermission } from 'src/utils';
import { useAppSelector } from 'src/state/hooks';

export default function OrderTableRow({
  id,
  source,
  destination,
  customer,
  status,
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

  const handleEdit = () => {
    handleCloseMenu();
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
          <Chip label={status} color="success" />
        </TableCell>
        <Button className="mt-4" onClick={() => navigate(`${ROUTES.ORDERS}/${id}`)}>
          View
        </Button>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
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
          <MenuItem onClick={handleEdit}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
        )}

        {checkCurrentUserPermission(user?.permissions, ORDER, REMOVE) && (
          <MenuItem onClick={() => handleCancel(id)} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:close-square-outline" sx={{ mr: 2 }} />
            Cancel
          </MenuItem>
        )}
      </Popover>
    </>
  );
}
