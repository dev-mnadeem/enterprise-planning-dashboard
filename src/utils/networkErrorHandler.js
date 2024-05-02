const isErrorWithMessage = (error) => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  );
};

const toErrorWithMessage = (maybeError) => {
  if (isErrorWithMessage(maybeError)) {
    return maybeError;
  }

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
};

export const getErrorMessage = (error) => {
  return toErrorWithMessage(error).message;
};

const handle4xxResponse = (response) => {
  if (response?.data?.message) {
    return response.data.message;
  } else {
    if (response?.data?.error && response?.data?.error[0]) {
      if (response?.data?.error[0]?.constraints?.isLength) {
        return response?.data?.error[0]?.constraints?.isLength;
      } else {
        return response?.data?.error[0]?.constraints?.isInt;
      }
    }
  }
};

const handleNetworkResponse = (response) => {
  if (response) {
    if (response?.status === 400 || 401) {
      return handle4xxResponse(response);
    } else if (response?.status === 500) {
      return response?.data?.message;
    }
  }
};

export const networkErrorHandler = (error) => {
  const response = error?.response;
  let message = error.message || ' Something went wrong';
  try {
    const mess = handleNetworkResponse(response);
    if (mess) {
      message = mess;
    }
  } catch (err) {
    message = getErrorMessage(err);
  }
  return message;
};
