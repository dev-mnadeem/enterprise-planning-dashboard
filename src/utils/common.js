export const checkCurrentUserPermission = (
  permissions = [],
  requiredPermission,
  type,
  userRole = ''
) => {
  const hasPermission =
    userRole === 'admin'
      ? true
      : permissions?.some(
          (permission) =>
            permission.name === requiredPermission && _.get(permission.properties, type)
        );

  return hasPermission ?? false;
};

/** To formate permissions data for API request */
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

/** To formate permissions data for form check boxes */
export const formateInitialPermissionsData = (permissions = []) => {
  const initialCheckedPermissions = {};
  permissions?.forEach((permission) => {
    initialCheckedPermissions[permission.name] = permission.properties;
  });

  return initialCheckedPermissions || {};
};

/** To remove false permissions from a role permissions data */
export const removeFalsePermissions = (permissions) => {
  return permissions?.map((permission) => ({
    ...permission,
    properties: Object.entries(permission.properties).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {}),
  }));
};

export const sleepForTesting = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

// Function to calculate the remaining weight limit
export function calculateRemainingWeightLimit(values, index, totalLimit = 0) {
  const currentWeight = values.orderItems?.reduce((acc, item, i) => {
    if (i !== index) {
      return acc + Number(item?.weight || 0);
    }
    return acc;
  }, 0);

  const remainingLimit = totalLimit - currentWeight;

  return Math.max(remainingLimit, 0);
}
