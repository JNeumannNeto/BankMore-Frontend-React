import axios from 'axios';

// URLs base das APIs
const API_URLS = {
  ACCOUNT: process.env.REACT_APP_ACCOUNT_API_URL || 'http://localhost:5001',
  TRANSFER: process.env.REACT_APP_TRANSFER_API_URL || 'http://localhost:5002',
  FEE: process.env.REACT_APP_FEE_API_URL || 'http://localhost:5003'
};

// Instâncias do Axios para cada API
const accountAPI = axios.create({
  baseURL: `${API_URLS.ACCOUNT}/api/account`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const transferAPI = axios.create({
  baseURL: `${API_URLS.TRANSFER}/api/transfer`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const feeAPI = axios.create({
  baseURL: `${API_URLS.FEE}/api/fee`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
const addAuthInterceptor = (apiInstance) => {
  apiInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para tratar respostas
  apiInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Adicionar interceptors a todas as instâncias
addAuthInterceptor(accountAPI);
addAuthInterceptor(transferAPI);
addAuthInterceptor(feeAPI);

export { accountAPI, transferAPI, feeAPI };
export default { accountAPI, transferAPI, feeAPI };
