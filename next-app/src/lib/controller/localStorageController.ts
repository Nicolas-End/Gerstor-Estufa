'use client'
export const addRole = (role: string)=> {

    try {
        localStorage.setItem('role_from_user',role)
        return true
    } catch (error) {
        throw error
    }
}

export const getRole =  () =>{
    try{    
        //so roda do navegador
        if( typeof window !== "undefined"){
            const role = localStorage.getItem("role_from_user");
            return role;
        }
        return null; //se ta no server retorna null
    } catch(error){
        console.log("Erro ao acessar localStorage", error);
        return null;
    }
}