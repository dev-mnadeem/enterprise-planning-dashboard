import { useState } from 'react';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import { Button, Chip, IconButton, MenuItem, Popover, TableCell, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'src/constants';

export default function OrderTableRow({ id, source, destination, customer, status, orderNumber }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCancel = (id) => {
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
        <MenuItem onClick={handleEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleCancel(id)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:close-square-outline" sx={{ mr: 2 }} />
          Cancel
        </MenuItem>
      </Popover>
    </>
  );
}
