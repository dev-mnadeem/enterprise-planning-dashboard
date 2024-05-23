import { Checkbox, FormControlLabel, FormGroup, List, ListItem } from '@mui/material';

export default function PermissionsForm({
  permissions,
  checkedPermissions,
  setCheckedPermissions,
}) {
  const handlePermissionChange = (permissionName) => (event) => {
    const isChecked = event.target.checked;
    const updatedPermissions = { ...checkedPermissions };

    if (isChecked) {
      updatedPermissions[permissionName] = {
        ...permissions.find((permission) => permission.name === permissionName).properties,
      };
    } else {
      delete updatedPermissions[permissionName];
    }

    setCheckedPermissions(updatedPermissions);
  };

  const handlePropertyChange = (permissionName, property) => (event) => {
    setCheckedPermissions({
      ...checkedPermissions,
      [permissionName]: {
        ...checkedPermissions[permissionName],
        [property]: event.target.checked,
      },
    });
  };

  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {permissions?.map((permission) => (
          <ListItem key={permission.name} dense className="flex-col	justify-start items-start">
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    (checkedPermissions[permission.name]
                      ? Object.values(checkedPermissions[permission.name]).every(Boolean)
                      : false) ?? false
                  }
                  onChange={handlePermissionChange(permission.name)}
                />
              }
              label={permission.name}
            />
            <FormGroup row className="flex-col items-start justify-start ml-4">
              {Object.keys(permission.properties).map((property) => (
                <FormControlLabel
                  key={property}
                  control={
                    <Checkbox
                      checked={
                        (checkedPermissions[permission.name]
                          ? checkedPermissions[permission.name][property]
                          : false) ?? false
                      }
                      onChange={handlePropertyChange(permission.name, property)}
                    />
                  }
                  label={property}
                />
              ))}
            </FormGroup>
          </ListItem>
        ))}
      </List>
    </>
  );
}
