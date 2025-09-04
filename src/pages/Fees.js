import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Info, TrendingUp, Clock } from 'lucide-react';
import { feeService } from '../services/feeService';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-hot-toast';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [calculatorAmount, setCalculatorAmount] = useState('');
  const [calculatedFee, setCalculatedFee] = useState(null);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setIsLoading(true);
    try {
      const response = await feeService.getFees();
      setFees(response.data || []);
    } catch (error) {
      toast.error('Erro ao carregar taxas');
      console.error('Error fetching fees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateFee = async () => {
    if (!calculatorAmount || parseFloat(calculatorAmount) <= 0) {
      toast.error('Digite um valor válido');
      return;
    }

    try {
      const response = await feeService.calculateFee({
        amount: parseFloat(calculatorAmount),
        type: 'transfer'
      });
      setCalculatedFee(response.data);
    } catch (error) {
      toast.error('Erro ao calcular taxa');
      console.error('Error calculating fee:', error);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const numericValue = parseFloat(value) / 100;
    setCalculatorAmount(numericValue || '');
    setCalculatedFee(null);
  };

  const feeTypes = [
    {
      id: 'transfer',
      name: 'Transferência',
      description: 'Taxa cobrada em transferências entre contas',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'withdrawal',
      name: 'Saque',
      description: 'Taxa cobrada em saques em caixas eletrônicos',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'maintenance',
      name: 'Manutenção',
      description: 'Taxa mensal de manutenção da conta',
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Taxas e Tarifas</h1>
        <p className="text-gray-600">Consulte as taxas aplicadas em suas transações</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Tabela de Taxas</h2>
            </div>
            <div className="p-6">
              {fees.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Nenhuma taxa configurada</p>
                  <p className="text-sm text-gray-400 mt-1">
                    As taxas aparecerão aqui quando forem configuradas
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feeTypes.map((feeType) => {
                    const fee = fees.find(f => f.type === feeType.id) || {};
                    return (
                      <div key={feeType.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${feeType.color}`}>
                            {feeType.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{feeType.name}</h3>
                            <p className="text-sm text-gray-500">{feeType.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {fee.percentage ? `${fee.percentage}%` : fee.fixedAmount ? formatCurrency(fee.fixedAmount) : 'Gratuito'}
                          </p>
                          {fee.minAmount && (
                            <p className="text-sm text-gray-500">
                              Mín: {formatCurrency(fee.minAmount)}
                            </p>
                          )}
                          {fee.maxAmount && (
                            <p className="text-sm text-gray-500">
                              Máx: {formatCurrency(fee.maxAmount)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Informações Importantes</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• As taxas são cobradas automaticamente no momento da transação</li>
                  <li>• Transferências entre contas BankMore podem ter taxas diferenciadas</li>
                  <li>• Consulte sempre o valor da taxa antes de confirmar a operação</li>
                  <li>• Algumas operações podem ser isentas de taxa dependendo do seu plano</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Calculadora de Taxa</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Valor da Transação
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">R$</span>
                  <input
                    id="amount"
                    type="text"
                    value={calculatorAmount ? formatCurrency(calculatorAmount).replace('R$ ', '') : ''}
                    onChange={handleAmountChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <button
                onClick={calculateFee}
                disabled={!calculatorAmount}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Calcular Taxa
              </button>

              {calculatedFee && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Valor da transação:</span>
                    <span className="font-medium">{formatCurrency(calculatedFee.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taxa:</span>
                    <span className="font-medium text-red-600">{formatCurrency(calculatedFee.fee)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium text-gray-900">Total a ser debitado:</span>
                    <span className="font-bold text-gray-900">{formatCurrency(calculatedFee.total)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dicas para Economizar</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-sm text-gray-600">
                  Agrupe suas transferências para reduzir o número de operações
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-sm text-gray-600">
                  Verifique se há horários com taxas reduzidas
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-sm text-gray-600">
                  Considere planos premium para isenção de algumas taxas
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-sm text-gray-600">
                  Use transferências programadas para operações recorrentes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fees;
