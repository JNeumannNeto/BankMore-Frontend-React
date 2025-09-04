import { accountAPI } from './api';
import { v4 as uuidv4 } from 'uuid';

export const accountService = {
  // Obter saldo da conta
  async getBalance() {
    const response = await accountAPI.get('/balance');
    return response.data;
  },

  // Realizar movimentação (depósito ou saque)
  async createMovement(movementData) {
    const response = await accountAPI.post('/movement', {
      requestId: uuidv4(),
      accountNumber: movementData.accountNumber,
      amount: parseFloat(movementData.amount),
      type: movementData.type // 'C' para crédito, 'D' para débito
    });
    return response.data;
  },

  // Inativar conta
  async deactivateAccount(password) {
    const response = await accountAPI.put('/deactivate', {
      password
    });
    return response.data;
  },

  // Verificar se uma conta existe
  async checkAccountExists(accountNumber) {
    const response = await accountAPI.get(`/exists/${accountNumber}`);
    return response.data;
  },

  // Obter saldo de uma conta específica (para validações)
  async getAccountBalance(accountNumber) {
    const response = await accountAPI.get(`/balance/${accountNumber}`);
    return response.data;
  },

  // Atualizar perfil do usuário
  async updateProfile(profileData) {
    const response = await accountAPI.put('/profile', profileData);
    return response.data;
  },

  // Alterar senha
  async changePassword(passwordData) {
    const response = await accountAPI.put('/change-password', passwordData);
    return response.data;
  }
};
