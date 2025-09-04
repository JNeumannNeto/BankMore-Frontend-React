import { feeAPI } from './api';

export const feeService = {
  // Obter tarifas por número da conta
  async getFeesByAccountNumber(accountNumber) {
    const response = await feeAPI.get(`/${accountNumber}`);
    return response.data;
  },

  // Obter detalhes de uma tarifa específica
  async getFeeById(feeId) {
    const response = await feeAPI.get(`/fee/${feeId}`);
    return response.data;
  },

  // Obter minhas tarifas (conta autenticada)
  async getMyFees() {
    const response = await feeAPI.get('/my');
    return response.data;
  }
};
