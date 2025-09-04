import { accountAPI } from './api';

export const authService = {
  // Fazer login
  async login(cpf, password) {
    const response = await accountAPI.post('/login', {
      cpf: cpf.replace(/\D/g, ''), // Remove formatação do CPF
      password
    });
    return response.data;
  },

  // Registrar nova conta
  async register(userData) {
    const response = await accountAPI.post('/register', {
      cpf: userData.cpf.replace(/\D/g, ''), // Remove formatação do CPF
      name: userData.name,
      password: userData.password
    });
    return response.data;
  },

  // Definir token de autenticação
  setAuthToken(token) {
    if (token) {
      accountAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete accountAPI.defaults.headers.common['Authorization'];
    }
  },

  // Remover token de autenticação
  removeAuthToken() {
    delete accountAPI.defaults.headers.common['Authorization'];
  },

  // Verificar se o token é válido
  async validateToken() {
    try {
      const response = await accountAPI.get('/balance');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
};
