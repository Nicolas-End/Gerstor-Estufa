'use server'
import axios from 'axios';
import { cookies } from 'next/headers';

export async function createApiWithAuth():Promise<any>{
  const cookiesStore = await cookies()
  const token = await cookiesStore.get('token_from_user')?.value;

  return axios.create({
    baseURL: 'https://gerenciador-empresarial-1cfr.vercel.app/',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token || '',
    },
    validateStatus: () => true
  });
}
