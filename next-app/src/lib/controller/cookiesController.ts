'use server'
import { cookies } from "next/headers"

export const deleteCookies = async():Promise<boolean> =>{
    try{
        const cookiesStore = await cookies()
        const cookiesNames = cookiesStore.getAll().map(cookie => cookie.name)

        cookiesNames.forEach(name => {
            cookiesStore.delete(name);;
        });

        return true
    }catch(error){
        throw(error)
    }
}