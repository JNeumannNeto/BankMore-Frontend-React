import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { accountService } from '../services/accountService';
import { transferService } from '../services/transferService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchDashboardData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const [balanceResponse, transactionsResponse] = await Promise.all([
        accountService.getBalance(),
        transferService.getTransactionHistory()
      ]);
      
      setBalance(balanceResponse.data.balance || 0);
      setTransactions(transactionsResponse.data.slice(0, 5) || []);
    } catch (error) {
      toast.error('Erro ao carregar dados do dashboard');
      console.error('Dashboard error:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData(false);
    toast.success('Dados atualizados');
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'sent':
      case 'transfer_out':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'received':
      case 'transfer_in':
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      default:
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'sent':
      case 'transfer_out':
        return 'text-red-600';
      case 'received':
      case 'transfer_in':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  const getTransactionSign = (type) => {
    switch (type) {
      case 'sent':
      case 'transfer_out':
        return '-';
      case 'received':
      case 'transfer_in':
        return '+';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo de volta, {user?.name}</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Saldo Atual</h2>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
          >
            {showBalance ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="text-3xl font-bold">
          {showBalance ? formatCurrency(balance) : '••••••'}
        </div>
        <p className="text-blue-100 mt-2">Conta Corrente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Receitas do Mês</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(
                  transactions
                    .filter(t => t.type === 'received' || t.type === 'transfer_in')
                    .reduce((sum, t) => sum + (t.amount || 0), 0)
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Gastos do Mês</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(
                  transactions
                    .filter(t => t.type === 'sent' || t.type === 'transfer_out')
                    .reduce((sum, t) => sum + (t.amount || 0), 0)
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ArrowUpRight className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Transações</p>
              <p className="text-xl font-semibold text-gray-900">{transactions.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Transações Recentes</h3>
        </div>
        <div className="p-6">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500">Nenhuma transação encontrada</p>
              <p className="text-sm text-gray-400 mt-1">
                Suas transações aparecerão aqui quando você começar a usar o BankMore
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.description || 
                         (transaction.type === 'sent' || transaction.type === 'transfer_out' 
                           ? `Transferência para ${transaction.toAccount || 'Conta'}`
                           : `Transferência de ${transaction.fromAccount || 'Conta'}`)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.createdAt || transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {getTransactionSign(transaction.type)}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {transaction.status || 'Concluída'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
