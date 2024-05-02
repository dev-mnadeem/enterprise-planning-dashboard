import moment from 'moment';
import { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { networkErrorHandler } from 'src/utils/networkErrorHandler';
import { store } from 'src/state/store';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const interceptedAxios = axios.create();
const nonIntercepted = axios.create();
const _headers = {
  'Content-Type': 'application/json',
};

interceptedAxios.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const userSession = state.userReducer.userSession;
    const accessToken = userSession?.accessToken;
    // change the token format if it is changed and also get refreshToken from redux

    if (accessToken?.length) {
      if (moment(new Date()).isBefore(moment().add(1, 'minute'))) {
        // Get updated Token here and add the updated token to the headers
        // waiting for the backend service
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } else {
      config.headers.Authorization = 'Bearer token';
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export const useMutation = (endpoint, intercepted = true, headers = {}) => {
  const [error, setError] = useState();
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const mutate = async (variables) => {
    try {
      setLoading(true);
      setError(undefined);
      const response = await (intercepted ? interceptedAxios : nonIntercepted).post(
        `/${endpoint}`,
        variables,
        {
          headers: { ..._headers, ...headers },
        }
      );
      setData(response?.data);
      return response?.data;
    } catch (err) {
      let formattedErr = err;
      const errorMessage = networkErrorHandler(err);
      if (isAxiosError(err)) {
        formattedErr = err.response?.data?.Message;
      }
      throw errorMessage || formattedErr;
    } finally {
      setLoading(false);
    }
  };
  return [mutate, { data, loading, error }];
};

export const useQuery = (endpoint, params, options = { headers: {} }) => {
  const { headers } = options;
  const [data, setData] = useState(undefined);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = async () => {
      try {
        setLoading(true);
        setError(undefined);
        const response = await interceptedAxios.get(`/${endpoint}`, {
          params,
          headers: { ..._headers, ...headers },
        });

        setData(response?.data);
        return response?.data;
      } catch (err) {
        const errorMessage = networkErrorHandler(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    query();
  }, []);

  return { data, loading, error };
};

export const useLazyQuery = (endpoint, options) => {
  const headers = options?.headers || {};
  const [error, setError] = useState();
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const lazyQuery = async (params = {}) => {
    try {
      setLoading(true);
      setError(undefined);
      const response = await interceptedAxios.get(`/${endpoint}`, {
        params: params,
        headers: { ..._headers, ...headers },
      });
      console.log(store.getState().User?.auth);
      setData(response?.data);
      !!options?.onCompleted && options?.onCompleted(response?.data);
      return response?.data;
    } catch (err) {
      const errorMessage = networkErrorHandler(err);
      Sentry.captureException(err, (scope) => {
        scope.setTransactionName(getReadableExceptionTitle(endpoint));
        return scope;
      });
      throw errorMessage || formattedErr;
    } finally {
      setLoading(false);
    }
  };

  return [lazyQuery, { data, loading, error }];
};

export { interceptedAxios, nonIntercepted };
