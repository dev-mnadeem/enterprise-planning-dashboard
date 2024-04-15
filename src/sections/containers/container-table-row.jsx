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

const formatDimension = (value) => (value == null ? '--' : Number(value).toFixed(2));

export default function ContainerTableRow({
  id,
  trackingNumber,
  fromCountry,
  toCountry,
  volume,
  width,
  height,
  depth,
  onDeleteContainer,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const { user } = useAppSelector((state) => state.userReducer);
  const { REMOVE, UPDATE, VIEW } = PERMISSION_TYPE;
  const { CONTAINER } = PERMISSION_ENTITIES;
  const label = trackingNumber || `${fromCountry?.name} to ${toCountry?.name}`;

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDelete = () => {
    if (!id) return;

    handleCloseMenu();
    if (window.confirm(`Delete container "${label}"?`)) {
      onDeleteContainer(id);
    }
  };

  const goTo = (suffix = '') => {
    handleCloseMenu();
    navigate(`${ROUTES.CONTAINERS}/${id}${suffix}`);
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>{fromCountry?.name || '--'}</TableCell>
        <TableCell>{toCountry?.name || '--'}</TableCell>
        <TableCell>{volume == null ? '--' : `${formatDimension(volume)} cbm`}</TableCell>
        <TableCell>{formatDimension(width)}</TableCell>
        <TableCell>{formatDimension(height)}</TableCell>
        <TableCell>{formatDimension(depth)}</TableCell>
        <TableCell align="right">
          <IconButton aria-label={`Actions for ${label}`} onClick={(e) => setOpen(e.currentTarget)}>
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
        {checkCurrentUserPermission(user?.permissions, CONTAINER, VIEW) && (
          <MenuItem onClick={() => goTo('?action=view')}>
            <Iconify icon="eva:eye-outline" sx={{ mr: 2 }} />
            View
          </MenuItem>
        )}

        {checkCurrentUserPermission(user?.permissions, CONTAINER, UPDATE) && (
          <MenuItem onClick={() => goTo()}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
        )}

        {checkCurrentUserPermission(user?.permissions, CONTAINER, REMOVE) && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        )}
      </Popover>
    </>
  );
}
