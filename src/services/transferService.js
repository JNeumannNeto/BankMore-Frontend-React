import { transferAPI } from './api';
import { v4 as uuidv4 } from 'uuid';

export const transferService = {
  // Realizar transferência
  async createTransfer(transferData) {
    const response = await transferAPI.post('/', {
      requestId: uuidv4(),
      destinationAccountNumber: transferData.destinationAccountNumber,
      amount: parseFloat(transferData.amount)
    });
    return response.data;
  },

  // Listar transferências da conta
  async getTransfers() {
    const response = await transferAPI.get('/list');
    return response.data;
  },

  // Obter detalhes de uma transferência específica
  async getTransferById(transferId) {
    const response = await transferAPI.get(`/${transferId}`);
    return response.data;
  }
};
