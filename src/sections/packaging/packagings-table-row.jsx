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

export default function PackagingsTableRow({
  id,
  name,
  weight_limit,
  weight_type,
  width,
  height,
  depth,
  onDeletePackaging,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const { user } = useAppSelector((state) => state.userReducer);
  const { REMOVE, UPDATE, VIEW } = PERMISSION_TYPE;
  const { PACKAGING } = PERMISSION_ENTITIES;

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const handleDelete = (name) => {
    if (!id) return;

    handleCloseMenu();
    const confirmed = window.confirm(`Are you sure to Delete "${name}" Packaging?`);
    if (confirmed) {
      toast.success('Packaging deleted successfully!');
      onDeletePackaging(id);
    }
  };

  const handleView = () => {
    handleCloseMenu();
    navigate(`${ROUTES.PACKAGINGS}/${id}?action=view`);
  };

  const handleEdit = () => {
    handleCloseMenu();
    navigate(`${ROUTES.PACKAGINGS}/${id}`);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>{name}</TableCell>
        <TableCell>{`${weight_limit}${weight_type}`}</TableCell>
        <TableCell>{width}</TableCell>
        <TableCell>{height}</TableCell>
        <TableCell>{depth || ' -- '}</TableCell>
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
        {checkCurrentUserPermission(user?.permissions, PACKAGING, VIEW) && (
          <MenuItem onClick={handleView}>
            <Iconify icon="eva:eye-outline" sx={{ mr: 2 }} />
            View
          </MenuItem>
        )}

        {checkCurrentUserPermission(user?.permissions, PACKAGING, UPDATE) && (
          <MenuItem onClick={handleEdit}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
        )}

        {checkCurrentUserPermission(user?.permissions, PACKAGING, REMOVE) && (
          <MenuItem onClick={() => handleDelete(name)} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        )}
      </Popover>
    </>
  );
}
