import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowRight, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { transferService } from '../services/transferService';
import { accountService } from '../services/accountService';
import { formatCurrency, formatCPF, validateCPF } from '../utils/formatters';
import { toast } from 'react-hot-toast';

const Transfer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [step, setStep] = useState(1);
  const [transferData, setTransferData] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm();

  const amount = watch('amount');

  useEffect(() => {
    fetchBalance();
    fetchRecentTransfers();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await accountService.getBalance();
      setBalance(response.data.balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchRecentTransfers = async () => {
    try {
      const response = await transferService.getTransactionHistory();
      setRecentTransfers(response.data.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching transfers:', error);
    }
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setValue('recipientCpf', formatted);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const numericValue = parseFloat(value) / 100;
    setValue('amount', numericValue);
  };

  const onSubmit = async (data) => {
    if (step === 1) {
      setTransferData({
        recipientCpf: data.recipientCpf.replace(/\D/g, ''),
        amount: parseFloat(data.amount),
        description: data.description || ''
      });
      setStep(2);
      return;
    }

    setIsLoading(true);
    try {
      await transferService.createTransfer({
        recipientCpf: transferData.recipientCpf,
        amount: transferData.amount,
        description: transferData.description
      });
      
      toast.success('Transferência realizada com sucesso!');
      setStep(3);
      fetchBalance();
      fetchRecentTransfers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao realizar transferência');
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTransfer = () => {
    setStep(1);
    setTransferData(null);
    reset();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-green-600 bg-green-100';
    }
  };

  if (step === 3) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Transferência Realizada!</h2>
          <p className="text-gray-600 mb-6">
            Sua transferência de {formatCurrency(transferData.amount)} foi processada com sucesso.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Destinatário:</span>
              <span className="font-medium">{formatCPF(transferData.recipientCpf)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Valor:</span>
              <span className="font-medium">{formatCurrency(transferData.amount)}</span>
            </div>
            {transferData.description && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Descrição:</span>
                <span className="font-medium">{transferData.description}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleNewTransfer}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nova Transferência
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transferências</h1>
          <p className="text-gray-600">Envie dinheiro para outras contas</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Saldo disponível</p>
          <p className="text-xl font-bold text-blue-600">{formatCurrency(balance)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} mr-3`}>
                1
              </div>
              <span className={`font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-600'}`}>
                Dados da Transferência
              </span>
              <ArrowRight className="h-4 w-4 text-gray-400 mx-3" />
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} mr-3`}>
                2
              </div>
              <span className={`font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-600'}`}>
                Confirmação
              </span>
            </div>

            {step === 1 && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="recipientCpf" className="block text-sm font-medium text-gray-700 mb-2">
                    CPF do Destinatário
                  </label>
                  <input
                    id="recipientCpf"
                    type="text"
                    {...register('recipientCpf', {
                      required: 'CPF do destinatário é obrigatório',
                      validate: (value) => validateCPF(value) || 'CPF inválido'
                    })}
                    onChange={handleCPFChange}
                    className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.recipientCpf ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                  {errors.recipientCpf && (
                    <p className="mt-1 text-sm text-red-600">{errors.recipientCpf.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Valor da Transferência
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">R$</span>
                    <input
                      id="amount"
                      type="text"
                      {...register('amount', {
                        required: 'Valor é obrigatório',
                        min: {
                          value: 0.01,
                          message: 'Valor mínimo é R$ 0,01'
                        },
                        max: {
                          value: balance,
                          message: 'Valor não pode ser maior que o saldo disponível'
                        }
                      })}
                      onChange={handleAmountChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.amount ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0,00"
                      value={amount ? formatCurrency(amount).replace('R$ ', '') : ''}
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição (Opcional)
                  </label>
                  <input
                    id="description"
                    type="text"
                    {...register('description')}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Ex: Pagamento de aluguel"
                    maxLength={100}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>Continuar</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {step === 2 && transferData && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirme os dados da transferência</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Destinatário:</span>
                      <span className="font-medium">{formatCPF(transferData.recipientCpf)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor:</span>
                      <span className="font-medium text-lg">{formatCurrency(transferData.amount)}</span>
                    </div>
                    {transferData.description && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Descrição:</span>
                        <span className="font-medium">{transferData.description}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Confirmar Transferência</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transferências Recentes</h3>
            {recentTransfers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma transferência recente</p>
            ) : (
              <div className="space-y-3">
                {recentTransfers.map((transfer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(transfer.status)}
                      <div>
                        <p className="font-medium text-sm">
                          {formatCPF(transfer.recipientCpf || transfer.toAccount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transfer.description || 'Transferência'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatCurrency(transfer.amount)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transfer.status)}`}>
                        {transfer.status === 'completed' ? 'Concluída' : 
                         transfer.status === 'pending' ? 'Pendente' : 'Falhou'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
