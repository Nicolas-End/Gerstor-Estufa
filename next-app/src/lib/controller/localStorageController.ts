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
        const role = localStorage.getItem('role_from_user')
        return role
    }catch(error){
        throw error
    }
}