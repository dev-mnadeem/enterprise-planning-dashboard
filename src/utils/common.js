export const checkCurrentUserPermission = (permissions = [], requiredPermission, type) => {
  const hasPermission = permissions.some(
    (permission) => permission.name === requiredPermission && _.get(permission.properties, type)
  );

  return hasPermission ?? false;
};

export const formattedPermissionsData = (checkedPermissions = [], permissions = []) => {
  const formattedPermissions = Object.keys(checkedPermissions)?.map((permissionName) => ({
    name: permissions?.find((permission) => permission.name === permissionName).name,
    properties: {
      add: false,
      view: false,
      update: false,
      remove: false,
      ...checkedPermissions[permissionName],
    },
  }));

  return formattedPermissions || [];
};

export const formateInitialPermissionsData = (permissions = []) => {
  const initialCheckedPermissions = {};
  permissions?.forEach((permission) => {
    initialCheckedPermissions[permission.name] = permission.properties;
  });

  return initialCheckedPermissions || {};
};

export const sleepForTesting = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
