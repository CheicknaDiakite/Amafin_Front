import { FormClienType, ReponseClient } from "../typescript/ClienType"
import { TypeSlug } from "../typescript/DataType"
import { FormType, FormValueType } from "../typescript/FormType"
import { AvisType, ClienType, LoginType, RegisterResponse, ReponseUser, UserType, UtilisateurType } from "../typescript/UserType"
import Axios from "./caller.service"

const userRegister = async (post: FormValueType): Promise<RegisterResponse> => {
    try {
        const response = await Axios.post('/utilisateur/register', post)
        return response;
    } catch (error) {
        console.error("Error fetching boutiques:", error);
        throw error;
    }
}

const userClient = async (post: ClienType): Promise<RegisterResponse> => {
    try {
        const response = await Axios.post('/entreprise/client/add',
             post,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching boutiques:", error);
        throw error;
    }
}

const userAdminRegister = (data: FormValueType) => {
    return Axios.post('utilisateur/admin/inscription', data, { withCredentials: true });
}

const userCabinetRegister = (data: FormValueType) => {
    return Axios.post('utilisateur/admin/cabinet', data, { withCredentials: true });
}
const avisCreate = (data: AvisType) => {
    return Axios.post('entreprise/avis/add', data, { withCredentials: true });
}

const userLogin = async (post: LoginType): Promise<RegisterResponse> => {
    try {
        const response = await Axios.post('/utilisateur/login', post, { withCredentials: true })
        return response;
    } catch (error) {
        console.error("Error fetching boutiques:", error);
        throw error;
    }
}

const userUnGet = async () => {
    
    try {
        const response = await Axios.get(`/utilisateur/user/profil`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

const userUnClient = async (id: string) => {
    
    try {
        const response = await Axios.get(`/entreprise/client/get_un/${id}`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};


const userGet = async (post: string) => {
    try {
        const response = await Axios.post(`utilisateur/profile/get`, post,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

const avisGet = async (post: string) => {
    try {
        const response = await Axios.post(`entreprise/avis/get`, post,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

const userAll = async (data?: TypeSlug): Promise<ReponseUser> => {
    try {
        const response = await Axios.post(`utilisateur/get`, data,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

const allUsers = async (data: string) => {
    try {
        const response = await Axios.get(`utilisateur/get/${data}`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

const unUser = async (data: string) => {
    try {
        const response = await Axios.get(`utilisateur/user/${data}`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

const allMesUsers = async (data: string) => {
    try {
        const response = await Axios.get(`utilisateur/get/mes_user/${data}`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

const allClients = async (data: string) => {
    try {
        const response = await Axios.get(`entreprise/clients/${data}`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

const userUpdate = async (post: UserType): Promise<ReponseUser> => {
    try {
        const response = await Axios.post('utilisateur/profile/set', post,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

const clientUpdate = async (post: FormClienType): Promise<ReponseClient> => {
    
    try {
        const response = await Axios.post('entreprise/client/set', post,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

const userDelete = async (post: UtilisateurType): Promise<ReponseUser> => {
    try{
        const response = await Axios.post('utilisateur/profile/del', post,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

const clientDelete = async (post: FormClienType): Promise<ReponseUser> => {
    try{
        const response = await Axios.post('entreprise/client/del', post,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

const avisDelete = async (post: FormClienType): Promise<ReponseUser> => {
    try{
        const response = await Axios.post('entreprise/avis/del', post,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

const userForgot = (post: FormType) => {
    return Axios.post('utilisateur/forgot-password', post,{ withCredentials: true });
}

const userLogout = () => {
    return Axios.get('utilisateur/deconnxion')
}


export const userService = {
    userRegister, userLogin, userGet, userUpdate, userDelete,
    userAll, userLogout, userUnGet, userAdminRegister, allUsers,
    userForgot, avisDelete, avisGet, avisCreate, allMesUsers,
    allClients, userClient, userUnClient, clientUpdate, clientDelete,
    userCabinetRegister, unUser
}

const saveToken = (token: string, tok?: string) => {
    localStorage.setItem('token',token)
    localStorage.setItem('token_1',tok|| '')
}

const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('account')
    localStorage.removeItem('entreprise-uuid')
    localStorage.removeItem('token_1')
    localStorage.removeItem('errorCount'); // Réinitialiser le compteur après déconnexion
    // Force le rafraîchissement de la page
    window.location.reload();
}

const isLogged = () => {
    const token = localStorage.getItem('token')
    return !!token
}

const getToken = () => {
    return localStorage.getItem('token') || '0'
}

const getToken_1 = () => {
    return localStorage.getItem('token_1') || '0'
}

export const accountService = {
    saveToken, logout, isLogged, getToken, getToken_1
}

export const connect: string = accountService.getToken()
export const token_1: string = accountService.getToken_1()