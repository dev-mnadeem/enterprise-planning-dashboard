import { useState } from 'react';
import Popover from '@mui/material/Popover';
import Iconify from 'src/components/iconify';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useAppSelector } from 'src/state/hooks';
import { useNavigate } from 'react-router-dom';
import { PERMISSION_ENTITIES, PERMISSION_TYPE, ROUTES } from 'src/constants';
import { checkCurrentUserPermission } from 'src/utils';

export default function ContainerTableRow({
  id,
  fromCity,
  toCity,
  price,
  updatedAt,
  shipmentRoute,
  onDeletePricing,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const { user } = useAppSelector((state) => state.userReducer);
  const { REMOVE, UPDATE, VIEW } = PERMISSION_TYPE;
  const { PRICING } = PERMISSION_ENTITIES;

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const handleDelete = () => {
    if (!id) return;

    handleCloseMenu();
    const confirmed = window.confirm(
      `Are you sure to Delete "${fromCity?.name}" to "${toCity?.name}" Pricing?`
    );
    if (confirmed) {
      toast.success('Pricing deleted successfully!');
      onDeletePricing(id);
    }
  };

  const handleView = () => {
    handleCloseMenu();
    navigate(`${ROUTES.PRICING}/${id}?action=view`);
  };

  const handleEdit = () => {
    handleCloseMenu();
    navigate(`${ROUTES.PRICING}/${id}`);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>{`${fromCity?.name}, ${fromCity?.state?.country?.name}`}</TableCell>
        <TableCell>{`${toCity?.name}, ${toCity?.state?.country?.name}`}</TableCell>
        <TableCell>${price}</TableCell>
        <TableCell>{shipmentRoute?.toUpperCase()}</TableCell>
        <TableCell>{new Date(updatedAt).toLocaleString()}</TableCell>
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
        {checkCurrentUserPermission(user?.permissions, PRICING, VIEW) && (
          <MenuItem onClick={handleView}>
            <Iconify icon="eva:eye-outline" sx={{ mr: 2 }} />
            View
          </MenuItem>
        )}

        {checkCurrentUserPermission(user?.permissions, PRICING, UPDATE) && (
          <MenuItem onClick={handleEdit}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
        )}

        {checkCurrentUserPermission(user?.permissions, PRICING, REMOVE) && (
          <MenuItem onClick={() => handleDelete()} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        )}
      </Popover>
    </>
  );
}
