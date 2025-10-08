'use server'
import axios from 'axios';
import { cookies } from 'next/headers';
import { getTokenCookie } from '../controller/cookiesController';

// Cria o axios para fazer as requisições para api
// Para ver requisições veja os servies
export async function createApiWithAuth():Promise<any>{
  const token = await getTokenCookie()

  return axios.create({

    baseURL: 'https://gerstor-estufa.vercel.app',

    headers: {
      'Content-Type': 'application/json',
      'Authorization': token || '',
    },
    validateStatus: () => true
  });
}


export async function createApiWithoutAuth():Promise<any>{

  return axios.create({

    baseURL: 'https://gerstor-estufa.vercel.app',

    headers: {
      'Content-Type': 'application/json',

    },
    validateStatus: () => true
  });
}