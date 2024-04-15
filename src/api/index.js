import { useEffect, useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { networkErrorHandler } from 'src/utils/networkErrorHandler';
import { store } from 'src/state/store';
import { useAppDispatch } from 'src/state/hooks';
import { requestFinished, requestStarted } from 'src/state/reducers/loadingReducer';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const interceptedAxios = axios.create();
const nonIntercepted = axios.create();
const _headers = {
  'Content-Type': 'application/json',
};

// Access tokens expire on the API side; there is no refresh call yet, so an
// expired token surfaces as a 401 and the user signs in again.
interceptedAxios.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().userReducer.userSession?.token;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const useMutation = (endpoint, intercepted = true, headers = {}) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState();
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const mutate = async (variables, method = 'post', requestParams = '') => {
    try {
      dispatch(requestStarted());
      setLoading(true);
      setError(undefined);
      const requestMethod = method.toLowerCase();
      const client = intercepted ? interceptedAxios : nonIntercepted;
      const url = `/${endpoint}/${requestParams}`;
      const config = { headers: { ..._headers, ...headers } };
      // axios.delete takes (url, config); passing the body first silently dropped the headers.
      const response =
        requestMethod === 'delete' || requestMethod === 'get'
          ? await client[requestMethod](url, { ...config, data: variables })
          : await client[requestMethod](url, variables, config);
      setData(response?.data);
      return response?.data;
    } catch (err) {
      let formattedErr;
      if (isAxiosError(err)) {
        formattedErr = err.response?.data?.Message || err.response?.data?.errors?.[0]?.message;
      }
      setError(formattedErr || networkErrorHandler(err) || 'Something went wrong!');
      return undefined;
    } finally {
      dispatch(requestFinished());
      setLoading(false);
    }
  };
  return [mutate, { data, loading, error }];
};

export const useQuery = (endpoint, params, options = { headers: {} }) => {
  const dispatch = useAppDispatch();
  const { headers } = options;
  const [data, setData] = useState(undefined);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const query = async () => {
    try {
      dispatch(requestStarted());
      setLoading(true);
      setError(undefined);
      const response = await interceptedAxios.get(`/${endpoint}`, {
        params,
        headers: { ..._headers, ...headers },
      });

      setData(response?.data);
      return response?.data;
    } catch (err) {
      setError(networkErrorHandler(err));
      return undefined;
    } finally {
      dispatch(requestFinished());
      setLoading(false);
    }
  };

  useEffect(() => {
    query();
    // Fetch once per endpoint; callers use refetch() after a write.
  }, [endpoint]);

  return { data, loading, error, refetch: query };
};

// For endpoints that page on the server and answer { pageInfo, results }.
// `page` is zero-based to match MUI's TablePagination; the API counts from 1.
export const usePagedQuery = (endpoint, { page, rowsPerPage, search }) => {
  const params = new URLSearchParams({ pageNumber: page + 1, pageSize: rowsPerPage });
  if (search) params.set('search', search);
  const { data, loading, error, refetch } = useQuery(`${endpoint}?${params}`);

  return {
    rows: data?.results || [],
    total: data?.pageInfo?.totalResults || 0,
    // Only the first load blanks the screen; later pages keep the table mounted
    // so the search box doesn't lose focus while a request is in flight.
    initialLoading: loading && !data,
    error,
    refetch,
  };
};

export const useLazyQuery = (endpoint, options) => {
  const dispatch = useAppDispatch();
  const headers = options?.headers || {};
  const [error, setError] = useState();
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const lazyQuery = async (params = {}, requestParams = '') => {
    try {
      dispatch(requestStarted());
      setLoading(true);
      setError(undefined);
      const response = await interceptedAxios.get(`/${endpoint}/${requestParams}`, {
        params,
        headers: { ..._headers, ...headers },
      });

      setData(response?.data);
      return response?.data;
    } catch (err) {
      setError(networkErrorHandler(err));
      return undefined;
    } finally {
      dispatch(requestFinished());
      setLoading(false);
    }
  };

  return [lazyQuery, { data, loading, error }];
};

export { interceptedAxios, nonIntercepted };
