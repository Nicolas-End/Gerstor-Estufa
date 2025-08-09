# Gestor-Estufa

## Visão Geral
O Gestor-Estufa é uma plataforma para gerenciamento de estufas, entregas, funcionários e clientes. O sistema é composto por um back-end em Flask (Python) e um front-end em Next.js (TypeScript), oferecendo uma solução moderna e eficiente para empresas do setor agrícola.

## Tecnologias Utilizadas
- **Back-end:** Python, Flask, Flask-CORS,Mongodb
- **Front-end:** Next.js, React, TypeScript, Tailwind CSS

## Estrutura do Projeto
- `Flask-app/`: API RESTful, autenticação, criptografia, envio de e-mails, controle de usuários, entregas, clientes e funcionários.
- `next-app/`: Interface web responsiva para gestão das operações.

## Como Executar Localmente
### Back-end (Flask)
1. Acesse a pasta `Flask-app`:
   ```bash
   cd Flask-app
   ```
2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure o arquivo `.env` com as variáveis necessárias (`SUPER_KEY`, `FERNET_KEY`).
4. Execute o servidor:
   ```bash
   python main.py
   ```

### Front-end (Next.js)
1. Acesse a pasta `next-app`:
   ```bash
   cd next-app
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Funcionalidades Principais
- Cadastro e autenticação de empresas e funcionários
- Gestão de entregas (CRUD)
- Gestão de clientes
- Recuperação de senha por e-mail
- Interface web moderna e responsiva

## Endpoints Importantes (Back-end)
Consulte a documentação detalhada em `Flask-app/README.md` para a lista completa de endpoints e exemplos de uso.

## Deploy
O projeto está preparado para deploy em ambientes como Vercel (front-end) e serviços compatíveis com Flask (back-end).


## Licença
Este projeto é open-source.
