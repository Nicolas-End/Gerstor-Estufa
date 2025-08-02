'use server'
import axios from 'axios';
import { cookies } from 'next/headers';

export async function createApiWithAuth():Promise<any>{
  const cookiesStore = await cookies()
  const token = await cookiesStore.get('token_from_user')?.value;

  return axios.create({
    baseURL: 'http://127.0.0.1:5000',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token || '',
    },
    validateStatus: () => true
  });
}
