// Formatação de CPF
export const formatCPF = (cpf) => {
  if (!cpf) return '';
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Validação de CPF
export const validateCPF = (cpf) => {
  if (!cpf) return false;
  
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

// Formatação de moeda
export const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00';
  
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numericValue);
};

// Formatação de data
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

// Formatação de data simples (apenas data)
export const formatDateOnly = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
};

// Formatação de número da conta
export const formatAccountNumber = (accountNumber) => {
  if (!accountNumber) return '';
  return accountNumber.toString().padStart(6, '0');
};

// Máscara para input de valor monetário
export const maskCurrency = (value) => {
  if (!value) return '';
  
  // Remove tudo que não é dígito
  const numericValue = value.replace(/\D/g, '');
  
  // Converte para formato de moeda
  const formattedValue = (parseInt(numericValue) / 100).toFixed(2);
  
  return formattedValue.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Converte valor formatado para número
export const parseCurrency = (value) => {
  if (!value) return 0;
  
  // Remove formatação e converte para número
  const numericValue = value
    .replace(/\./g, '') // Remove pontos de milhares
    .replace(',', '.'); // Substitui vírgula por ponto decimal
  
  return parseFloat(numericValue) || 0;
};

// Truncar texto
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalizar primeira letra
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Capitalizar cada palavra
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
