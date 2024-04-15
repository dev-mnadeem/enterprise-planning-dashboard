import moment from 'moment';
import { useEffect, useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { networkErrorHandler } from 'src/utils/networkErrorHandler';
import { store } from 'src/state/store';
import { useAppDispatch, useAppSelector } from 'src/state/hooks';
import { setLoadingActive } from 'src/state/reducers/loadingReducer';
import { sleepForTesting } from 'src/utils';

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
    const accessToken = userSession?.token;
    // change the token format if it is changed and also get refreshToken from redux

    if (accessToken?.length) {
      if (moment(new Date()).isBefore(moment().add(1, 'minute'))) {
        // Get updated Token here and add the updated token to the headers
        // waiting for the backend service

        config.headers.Authorization = `Bearer ${accessToken}`;
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

export const useMutation = (endpoint, intercepted = true, headers = {}, params = {}) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState();
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const mutate = async (variables, method = 'post', requestParams = '') => {
    try {
      dispatch(setLoadingActive({ active: true }));
      setLoading(true);
      setError(undefined);
      // await sleepForTesting(6000);
      const requestMethod = method.toLowerCase();
      const response = await (intercepted ? interceptedAxios : nonIntercepted)[requestMethod](
        `/${endpoint}/${requestParams}`,
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
        formattedErr = err.response?.data?.Message || err.response?.data?.errors?.[0]?.message;
      }
      setError(formattedErr || errorMessage || 'Something went wrong!');
      // throw errorMessage || formattedErr;
    } finally {
      dispatch(setLoadingActive({ active: false }));
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
  const [loading, setLoading] = useState(false);

  const query = async () => {
    try {
      dispatch(setLoadingActive({ active: true }));
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
      dispatch(setLoadingActive({ active: false }));
      setLoading(false);
    }
  };
  useEffect(() => {
    query();
  }, []);

  const refetch = () => {
    query();
  };

  return { data, loading, error, refetch };
};

export const useLazyQuery = (endpoint, options) => {
  const dispatch = useAppDispatch();
  const headers = options?.headers || {};
  const [error, setError] = useState();
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const lazyQuery = async (params = {}, requestParams = '') => {
    try {
      dispatch(setLoadingActive({ active: true }));
      setLoading(true);
      setError(undefined);
      // await sleepForTesting(3000);
      const response = await interceptedAxios.get(`/${endpoint}/${requestParams}`, {
        params,
        headers: { ..._headers, ...headers },
      });

      setData(response?.data);
      return response?.data;
    } catch (err) {
      const errorMessage = networkErrorHandler(err);
      setError(errorMessage);
    } finally {
      dispatch(setLoadingActive({ active: false }));
      setLoading(false);
    }
  };

  return [lazyQuery, { data, loading, error }];
};

export { interceptedAxios, nonIntercepted };
