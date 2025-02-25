import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function getLocalStorage(router:AppRouterInstance){
    let email: string|null = localStorage.getItem('email')
    let id: string|null = localStorage.getItem('id')
     
    if (email && id){
        router.push('/home')
    }
    else{
        router.push('/')
    }
}