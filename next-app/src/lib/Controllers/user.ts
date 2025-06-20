import axios from "axios";

interface ApiResponse {
  status: string;
  message?: string;
  token?:string;
}

// Verifica se o usuario tem permissão para acessar o site
// utiliza em todas as paginas menos no login e etc
export function ValidadeUserAcess(): Promise<ApiResponse> {
  return new Promise<ApiResponse>((resolve) => {
    const token = localStorage.getItem("token_from_user");
    axios
      .post<ApiResponse>(
        "http://127.0.0.1:5000/home-acess",
        {}, // corpo da requisição POST (vazio nesse caso)
        {
          headers: {
            Authorization: token || "",
          },
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        resolve({ status: "error", message: "Erro na requisição" });
      });
  });
}

// server para adicionar uma nova empresa ao banco de dados
// utilizado no register page
export function AddNewCompany(
  email: string,
  id: string,
  password: string,
  companyName: string
): Promise<ApiResponse> {
  return new Promise<ApiResponse>((resolve) => {
    axios
      .post<ApiResponse>("http://127.0.0.1:5000/add-new-company", {
        email,
        id,
        password,
        companyName,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        resolve({ status: "error", message: "Erro na requisição" });
      });
  });
}

// server para logar o usuario na pagina de login
// utilizado na pagina de login
export function UserLoginAcess(
    /* pede as info do usuario
    e retorna uma promisse pois pode demorar */
    email: string,
  
    password: string
  ): Promise<ApiResponse> {
    /* Na resposta da api ele "return" uma resposta chamada data */
    return new Promise<ApiResponse>((resolve) => {
      //faz um posta para a receber as informações da api
      axios.post<ApiResponse>('http://127.0.0.1:5000/worker-login', {
        email,
        
        password,
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        resolve({ status: 'error', message: 'Erro na requisição' });
      });
    });
  }
  