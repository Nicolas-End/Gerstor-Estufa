# Gestor-Estufa 🌿

## 🎯 Visão Geral
O Gestor-Estufa é uma plataforma inovadora para gerenciamento de estufas, desenvolvida como Trabalho de Conclusão de Curso. O sistema oferece uma solução completa para empresas do setor agrícola, integrando gestão de estoque, logística, funcionários e relacionamento com clientes em uma única plataforma moderna e eficiente.

## 🔧 Tecnologias Utilizadas

### Backend
- **Principal:** Python, Flask
- **Banco de Dados:** MongoDB
- **Autenticação:** JWT, Bcrypt
- **Comunicação:** Flask-SocketIO
- **Segurança:** Python-dotenv, Cryptography
- **CORS:** Flask-CORS

### Frontend
- **Framework:** Next.js 15, React 19
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Componentes:** React Icons, FontAwesome
- **Animações:** AOS (Animate on Scroll)
- **Notificações:** React Toastify, SweetAlert2
- **Comunicação:** Axios, Socket.IO-client

## 📁 Estrutura do Projeto

### Backend (`Flask-app/`)
- `main.py`: Ponto de entrada da aplicação
- `config/`: Configurações do sistema
- `controllers/`: Lógica de negócios
  - Gestão de usuários e autenticação
  - Controle de produtos e estoque
  - Gerenciamento de entregas
  - Administração de clientes e funcionários
- `routes/`: Endpoints da API
- `socket_events.py`: Eventos em tempo real

### Frontend (`next-app/`)
- `src/app/`: Páginas e rotas da aplicação
- `src/Components/`: Componentes reutilizáveis
- `src/lib/`: Utilitários e configurações
- `public/`: Arquivos estáticos

## 🚀 Como Executar Localmente
### Backend (Flask)
1. Clone o repositório:
   ```bash
   git clone https://github.com/Nicolas-End/Gerstor-Estufa.git
   cd Gerstor-Estufa/Flask-app
   ```

2. Crie e ative um ambiente virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # ou
   .\venv\Scripts\activate  # Windows
   ```

3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure o arquivo `.env`:
   ```env
   MONGO_URI=sua_uri_mongodb
   JWT_SECRET=sua_chave_secreta
   SUPER_KEY=chave_super_admin
   FERNET_KEY=chave_criptografia
   ```

5. Execute o servidor:
   ```bash
   python main.py
   ```

### Frontend (Next.js)
1. Acesse a pasta do frontend:
   ```bash
   cd next-app
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## ✨ Funcionalidades Principais

### Gestão de Produtos
- Cadastro e atualização de produtos
- Controle de estoque
- Categorização de itens
- Histórico de movimentações

### Sistema de Entregas
- Agendamento de entregas
- Rastreamento em tempo real
- Gestão de rotas
- Histórico de entregas

### Gestão de Clientes e Funcionários
- Cadastro e gestão de perfis
- Sistema de autenticação seguro
- Recuperação de senha via email
- Níveis de acesso personalizados

### Interface e Usabilidade
- Design responsivo
- Animações suaves
- Notificações em tempo real
- Dashboard interativo

## 🌐 Deploy

### Backend
- Compatível com plataformas Python (Heroku, DigitalOcean, etc.)
- Suporte a containers Docker
- Configuração para serviços de nuvem

### Frontend
- Otimizado para deploy na Vercel
- Build estático para melhor performance
- Suporte a CDN para assets


## 👤 Autor
Nicolas Silva
-  GitHub: [@Nicolas-End](https://github.com/Nicolas-End)
Mathias
-  Github: [@ferreiar](https://github.com/ferreiar)
Luis Barcelos
-  Github: [@Luisbw8](https://github.com/Luisbw8)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!
