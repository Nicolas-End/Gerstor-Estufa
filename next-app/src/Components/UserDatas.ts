import { redirect } from 'next/navigation'



export function acess_data_user(email:string,usercode:string,userremember:boolean):void{    
    if (userremember){
        localStorage.setItem('email',email)
        localStorage.setItem('userCode',usercode)
        localStorage.setItem('userRemember','true')
        
    }
    else{
        sessionStorage.setItem('email',email)
        sessionStorage.setItem('userCode',usercode)
        sessionStorage.setItem('userRemember','false')
    }
    

}