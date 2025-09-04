# BankMore Frontend - React

Uma aplicação frontend moderna para o sistema bancário BankMore, desenvolvida com React 18 e tecnologias modernas.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **React Router DOM** - Roteamento para aplicações React
- **React Hook Form** - Gerenciamento de formulários performático
- **Axios** - Cliente HTTP para requisições à API
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones moderna
- **React Hot Toast** - Notificações elegantes
- **UUID** - Geração de identificadores únicos

## 📋 Funcionalidades

### Autenticação
- ✅ Login com CPF e senha
- ✅ Registro de novos usuários
- ✅ Validação de CPF brasileiro
- ✅ Gerenciamento de tokens JWT
- ✅ Logout seguro

### Dashboard
- ✅ Visualização do saldo atual
- ✅ Histórico de transações recentes
- ✅ Resumo financeiro (receitas e gastos)
- ✅ Atualização em tempo real

### Transferências
- ✅ Transferência entre contas via CPF
- ✅ Validação de saldo disponível
- ✅ Confirmação em duas etapas
- ✅ Histórico de transferências
- ✅ Status das transações

### Taxas e Tarifas
- ✅ Consulta de tabela de taxas
- ✅ Calculadora de taxas
- ✅ Informações detalhadas sobre tarifas
- ✅ Dicas para economia

### Perfil do Usuário
- ✅ Edição de dados pessoais
- ✅ Alteração de senha
- ✅ Validações de segurança
- ✅ Interface com abas

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
│   └── Layout/         # Componentes de layout
├── contexts/           # Contextos React (AuthContext)
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── utils/              # Utilitários e helpers
├── App.js              # Componente principal
├── index.js            # Ponto de entrada
└── index.css           # Estilos globais
```

### Padrões Utilizados
- **Context API** - Gerenciamento de estado global
- **Custom Hooks** - Lógica reutilizável
- **Componentes Funcionais** - Com React Hooks
- **Interceptors Axios** - Tratamento automático de autenticação
- **Protected Routes** - Rotas protegidas por autenticação

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- Backend BankMore rodando

### Instalação
```bash
# Clone o repositório
git clone <repository-url>

# Navegue até o diretório
cd BankMore-Frontend-React

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
REACT_APP_ACCOUNT_API_URL=http://localhost:5001
REACT_APP_TRANSFER_API_URL=http://localhost:5002
REACT_APP_FEE_API_URL=http://localhost:5003
```

## 🎨 Design System

### Cores Principais
- **Primária**: Blue-600 (#2563eb)
- **Secundária**: Gray-600 (#4b5563)
- **Sucesso**: Green-600 (#16a34a)
- **Erro**: Red-600 (#dc2626)
- **Aviso**: Yellow-600 (#ca8a04)

### Componentes de UI
- Formulários com validação em tempo real
- Botões com estados de loading
- Cards responsivos
- Modais e notificações
- Navegação lateral responsiva

## 🔐 Segurança

### Implementações de Segurança
- **JWT Token Management** - Armazenamento seguro de tokens
- **Interceptors** - Renovação automática de tokens
- **Validação de CPF** - Algoritmo de validação brasileiro
- **Protected Routes** - Controle de acesso às páginas
- **Sanitização** - Limpeza de dados de entrada

### Boas Práticas
- Validação client-side e server-side
- Senhas não armazenadas no frontend
- Logout automático em caso de token expirado
- Feedback visual para ações sensíveis

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- 📱 **Mobile** - 320px+
- 📱 **Tablet** - 768px+
- 💻 **Desktop** - 1024px+

### Breakpoints Tailwind
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🧪 Validações

### Validações Implementadas
- **CPF**: Algoritmo de validação brasileiro
- **Email**: Formato de email válido
- **Senha**: Mínimo 6 caracteres
- **Valores**: Formatação monetária brasileira
- **Campos obrigatórios**: Feedback visual

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm start

# Build para produção
npm run build

# Testes
npm test

# Ejetar configuração (não recomendado)
npm run eject
```

## 🐳 Docker

### Dockerfile
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  bankmore-frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_ACCOUNT_API_URL=http://localhost:5001
      - REACT_APP_TRANSFER_API_URL=http://localhost:5002
      - REACT_APP_FEE_API_URL=http://localhost:5003
```

## 📊 Performance

### Otimizações Implementadas
- **Code Splitting** - Carregamento sob demanda
- **Lazy Loading** - Componentes carregados quando necessário
- **Memoização** - React.memo para componentes
- **Debounce** - Em campos de busca e validação
- **Interceptors** - Cache de requisições

## 🔄 Integração com APIs

### Microserviços Integrados
1. **Account API** (Porta 5001)
   - Autenticação
   - Gerenciamento de contas
   - Saldo e movimentações

2. **Transfer API** (Porta 5002)
   - Transferências entre contas
   - Histórico de transações
   - Validações de transferência

3. **Fee API** (Porta 5003)
   - Consulta de taxas
   - Cálculo de tarifas
   - Configurações de fees

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Python Django (BankMore-Backend-Python)
- **Arquitetura**: Microserviços
- **Banco de Dados**: SQLite/PostgreSQL

## 📞 Suporte

Para suporte e dúvidas:
- 📧 Email: suporte@bankmore.com
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Website: https://bankmore.com

---

**BankMore** - Seu banco digital moderno e seguro 🏦
