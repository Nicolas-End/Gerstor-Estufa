import { redirect } from 'next/navigation'



export function create_data_user(email:string,usercode:string,userremember:boolean):void{    
    
    localStorage.setItem('email',email)
    localStorage.setItem('userCode',usercode)
    if (userremember){
        localStorage.setItem('LoggedIn','true')
    }
    else{
        localStorage.setItem('LoggedIn','false')
    }
    redirect('/home')
}