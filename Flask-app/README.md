## Gerstor-Estufa - Flask API

API desenvolvida em Flask para gerenciamento de estufas, clientes, entregas e funcionários. Este backend faz parte do sistema Gerstor-Estufa, integrando-se a um frontend Next.js.

---

### Índice
- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Principais Rotas](#principais-rotas)
- [Estrutura de Pastas](#estrutura-de-pastas)

---

## Sobre o Projeto
Esta API permite:
- Cadastro e autenticação de empresas e funcionários
- Gerenciamento de clientes (CPF/CNPJ)
- Controle de entregas e produtos
- Recuperação de senha por e-mail
- Criptografia de dados sensíveis

---

## Tecnologias Utilizadas
- Python 3.12+
- Flask
- Flask-CORS
- python-dotenv
- cryptography
- MongoDB (via pymongo)

---

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/Nicolas-End/Gerstor-Estufa.git
   ```
2. Acesse a pasta do backend:
   ```bash
   cd Gerstor-Estufa/Flask-app
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

---

## Configuração
1. Crie um arquivo `.env` na pasta `Flask-app` com as variáveis necessárias, exemplo no `.env.example`
   

## Como Usar
Execute a API localmente:
```bash
python main.py
```
A API estará disponível em `http://localhost:5000`.

---

## Principais Rotas
| Rota                      | Método | Descrição                                 |
|---------------------------|--------|-------------------------------------------|
| `/`                       | GET    | Teste de funcionamento da API             |
| `/user-login`             | POST   | Login de usuário                          |
| `/add-new-company`        | POST   | Cadastro de nova empresa                  |
| `/get-clients`            | POST   | Lista clientes da empresa                 |
| `/add-new-client`         | POST   | Adiciona novo cliente                     |
| `/get-deliverys`          | POST   | Lista entregas da empresa                 |
| `/add-new-delivery`       | POST   | Adiciona nova entrega                     |
| `/get-functionaries`      | POST   | Lista funcionários                        |
| `/add-new-functionary`    | POST   | Adiciona novo funcionário                 |
| `/send-email-recuperation`| POST   | Envia e-mail de recuperação de senha      |

> Todas as rotas protegidas exigem o header `Authorization` com o token de autenticação.

---

## Estrutura de Pastas
```
Flask-app/
├── main.py
├── requirements.txt
├── config/
│   └── config.py
├── controllers/
│   ├── client_controller.py
│   ├── cripto_controller.py
│   ├── delivery_controller.py
│   ├── email_controller.py
│   ├── functionaries.py
│   ├── token_controller.py
│   └── user_controller.py
└── ...
```

---



