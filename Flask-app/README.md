## Gerstor-Estufa - Flask API

API desenvolvida em Flask para gerenciamento de estufas, clientes, entregas, funcionários e caminhões. Este backend faz parte do sistema Gerstor-Estufa, integrando-se a um frontend Next.js.

---

### Índice
- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Autenticação](#autenticação)
- [Principais Rotas](#principais-rotas)
- [Tratamento de Erros](#tratamento-de-erros)
- [Segurança](#segurança)
- [Recuperação de Senha](#recuperação-de-senha)
- [Estrutura de Pastas](#estrutura-de-pastas)

---

## Sobre o Projeto
Esta API permite:
- Cadastro e autenticação de empresas e funcionários
- Gerenciamento de clientes (CPF/CNPJ)
- Controle de entregas e produtos
- Gestão de caminhões
- Recuperação de senha por e-mail
- Criptografia de dados sensíveis
- Controle de acesso baseado em tokens JWT

---

## Tecnologias Utilizadas
- Python 3.12+
- Flask
- Flask-CORS
- python-dotenv
- cryptography
- bcrypt
- pymongo
- pyjwt[crypto]

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
1. Crie um arquivo `.env` na pasta `Flask-app` com as seguintes variáveis:

```env
URI_MONGO=mongodb+srv://usuario:senha@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=nome_do_banco
COMPANY_COLLECTION=Empresas
PRODUCTS_COLLECTION=Produtos
WORKER_COLLECTION=Funcionarios
TOKEN_COLLECTION=Mudar Senha
DELIVERY_COLLECTION=Entregas
CLIENT_COLLECTION=Clientes
TRUCK_COLLECTION=Caminhões
SUPER_KEY=chave_secreta_para_JWT
FERNET_KEY=chave_fernet_para_criptografia
APP_PASSWORD=senha_de_aplicativo_do_gmail
EMAIL_SYSTEM=email_do_sistema@gmail.com
```

2. Configure corretamente as credenciais do MongoDB e do e-mail.

---

## Como Usar
Execute a API localmente:
```bash
python main.py
```
A API estará disponível em `http://localhost:5000`.

Para deploy na Vercel, utilize o arquivo `vercel.json` já configurado.

---

## Autenticação
A maioria das rotas requer autenticação via token JWT no header `Authorization`.

Para obter um token:
1. Faça login usando a rota `/user-login`
2. Utilize o token retornado no header `Authorization` para acessar rotas protegidas

---

## Principais Rotas

### Autenticação e Usuários
| Rota | Método | Descrição |
|------|--------|-----------|
| `/` | GET | Teste de funcionamento da API |
| `/user-login` | POST | Login de usuário |
| `/add-new-company` | POST | Cadastro de nova empresa |
| `/home-acess` | POST | Validação de acesso ao sistema |
| `/send-email-recuperation` | POST | Envia e-mail de recuperação de senha |
| `/change-password` | POST | Altera a senha do usuário |

### Clientes
| Rota | Método | Descrição |
|------|--------|-----------|
| `/get-clients` | POST | Lista clientes da empresa |
| `/add-new-client` | POST | Adiciona novo cliente |
| `/get-especific-client` | POST | Obtém dados de um cliente específico |

### Entregas
| Rota | Método | Descrição |
|------|--------|-----------|
| `/get-deliverys` | POST | Lista entregas da empresa |
| `/add-new-delivery` | POST | Adiciona nova entrega |
| `/get-especific-delivery` | POST | Obtém dados de uma entrega específica |
| `/edit-delivery` | POST | Edita uma entrega existente |
| `/delete-delivery` | POST | Remove uma entrega |
| `/count-deliverys` | POST | Conta o número de entregas |

### Funcionários
| Rota | Método | Descrição |
|------|--------|-----------|
| `/get-functionaries` | POST | Lista funcionários da empresa |
| `/add-new-functionary` | POST | Adiciona novo funcionário |
| `/get-functionaries-quantity` | POST | Conta o número de funcionários |

### Caminhões
| Rota | Método | Descrição |
|------|--------|-----------|
| `/get-trucks` | POST | Lista caminhões da empresa |
| `/add-new-truck` | POST | Adiciona novo caminhão |

---

## Tratamento de Erros
A API retorna códigos de status HTTP apropriados:

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida
- `401` - Não autorizado
- `409` - Conflito (usuário já existe)
- `500` - Erro interno do servidor

As respostas de erro seguem o formato:
```json
{
  "status": "error",
  "message": "Descrição do erro"
}
```

---

## Segurança
A API implementa várias camadas de segurança:

1. **Autenticação JWT**: Tokens para controle de acesso
2. **Criptografia Fernet**: Dados sensíveis são criptografados
3. **Hash de Senhas**: Senhas armazenadas com bcrypt
4. **HTTPS**: Recomendado para produção
5. **CORS**: Configuração de origens permitidas

---

## Recuperação de Senha
O sistema de recuperação de senha funciona da seguinte forma:

1. Usuário solicita recuperação via `/send-email-recuperation`
2. Um e-mail é enviado com um link único válido por 3 minutos
3. Ao acessar o link, o usuário pode definir uma nova senha
4. A nova senha é criptografada e armazenada no banco de dados

---

## Estrutura de Pastas
```
Flask-app/
├── main.py
├── requirements.txt
├── .env
├── .env.example
├── .gitignore
├── vercel.json
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
