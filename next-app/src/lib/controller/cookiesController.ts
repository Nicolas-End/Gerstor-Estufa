'use server'
import { cookies } from "next/headers"


export const addCookies = async (token: string, role: string): Promise<boolean> => {

    try {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);
        const cookiesStore = await cookies()
        // Criação dos cookeis que guarda os dados do usuario 
        cookiesStore.set('token_from_user', token, { httpOnly: true ,expires: expirationDate})
        cookiesStore.set('role_from_user', role, { httpOnly: true ,expires: expirationDate})

        return true
    } catch (error) {
        throw error
    }
}
export const deleteCookies = async (): Promise<boolean> => {
    try {
        const cookiesStore = await cookies()
        const cookiesNames = cookiesStore.getAll().map(cookie => cookie.name)

        cookiesNames.forEach(name => {
            cookiesStore.delete(name);;
        });

        return true
    } catch (error) {
        throw (error)
    }
}

export const getRoleCookie = async (): Promise<string> => {
    try {
        const cookiesStore = await cookies()
        const cookiesRole = cookiesStore.get("role_from_user")?.value

        return cookiesRole || ''
    } catch (error) {
        console.log("Erro Cookies: ", error)
        throw (error)
    }
}