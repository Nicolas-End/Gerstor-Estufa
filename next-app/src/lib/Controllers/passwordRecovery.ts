import axios from 'axios'

interface ApiResponse{
    'status':string,
    'message'?:string,

}

// essa função server para enviar o email de recuperação de senha para o usuario 
// utilizado na pagina de password-forget
export function SendEmailRecovery(email:string,newPassword:string): Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve) => {
      
      axios.post<ApiResponse>(
        'https://gerenciador-empresarial-1cfr.vercel.app/send-email-recuperation',
        {
            email,
            newPassword
        }, 
       
      )
        .then(response => {
        
          resolve(response.data);
        })
        .catch(error => {
          resolve({ status: 'error', message: 'Erro na requisição' });
        });
    });
  }

export function ChangePassword(token:string): Promise<ApiResponse> {
  return new Promise<ApiResponse>((resolve) => {
     
    axios.post<ApiResponse>(
      'https://gerenciador-empresarial-1cfr.vercel.app/change-password',
      { 
          token
      }, // corpo da requisição POST (vazio nesse caso)

    )
      .then(response => {
      
        resolve(response.data);
      })
      .catch(error => {
        resolve({ status: 'error', message: 'Erro na requisição' });
      });
  });
}