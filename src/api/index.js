import axios from 'axios';

const BASE_URL = 'https://.......';

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(
  (config) => config,
  (err) => Promise.reject(err)
);

export * from './Admin';
export * from './BranchManager';
export * from './Customer';
export * from './Driver';
export * from './Employee';
