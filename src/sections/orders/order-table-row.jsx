import { useState } from 'react';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import { IconButton, MenuItem, Popover, TableCell, TableRow } from '@mui/material';

export default function OrderTableRow({
  id,
  to,
  from,
  toUser,
  status,
  fromUser,
  orderNumber,
  trackingNumber,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleDelte = (id) => {
    handleCloseMenu();
  };

  const handleEdit = () => {
    handleCloseMenu();
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>{id}</TableCell>
        <TableCell>{orderNumber}</TableCell>
        <TableCell>{trackingNumber}</TableCell>
        <TableCell>{from}</TableCell>
        <TableCell>{to}</TableCell>
        <TableCell>{fromUser}</TableCell>
        <TableCell>{toUser}</TableCell>
        <TableCell>{status}</TableCell>
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
        <MenuItem onClick={handleEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelte(id)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

OrderTableRow.propTypes = {
  id: PropTypes.number,
  orderNumber: PropTypes.string,
  trackingNumber: PropTypes.string,
  from: PropTypes.string,
  to: PropTypes.string,
  fromUser: PropTypes.string,
  toUser: PropTypes.string,
  status: PropTypes.string,
};
