import { EntrepriseType } from "../typescript/Account";
import { DataType, TypeEntreprise } from "../typescript/DataType";
import Axios from "./caller.service";


/**
 * Récupératoin de la liste des utilisateurs
 */
const allEntreprise = async (post: string ) => {
    try {
        const response = await Axios.post('entreprise/get', 
            post,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

// Pour tous les utilisateurs d'un Entreprise 
const getEntrepriseUsers = async (post: string ) => {
    try {
        const response = await Axios.get(`entreprise/get_entreprise_utilisateurs/${post}`, 
            { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

// Pour tous les entreprises d'un utilisateur 
const getUserEntreprises = async () => {
    try {
        const response = await Axios.get(`entreprise/user_entreprises`, 
            { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }

}

const allUserEntreprise = async (post: string) => {
    try {
        const response = await Axios.post('entreprise/get/user', 
            post,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

/**
 * Récupération d'un utilisateur
 */
const getEntreprise = async (slug: string) => {
    
    try {
        const response = await Axios.get(`entreprise/get/${slug}`,
            { withCredentials: true });
           
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

const historiqueEntreprise = async () => {
    try {
        const response = await Axios.get(`entreprise/get_utilisateur_entreprise_historique`,
            { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

const historySuppEntreprise = async (uuid: string) => {
    try {
        const response = await Axios.get(`entreprise/get_utilisateur_entreprise_historique_supp/${uuid}`,
            { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

const stockEntreprise = async (entreprise_id: string) => {
    
    try {
        
        const response = await Axios.get(`entreprise/statistiques/${entreprise_id}`,
            { withCredentials: true });
            
        return response;
    } catch (error) {
        // console.error("Error fetching user profile:", error);
        throw error;
    }
    
    
}

const sortieUserEntreprise = async (entreprise_id: string) => {
    
    try {
        const response = await Axios.get(`entreprise/count_sortie_par_utilisateur/${entreprise_id}`,
            { withCredentials: true });
        return response;
    } catch (error) {
        // console.error("Error fetching user profile:", error);
        throw error;
    }
       
}

const stockCateSemaine = async (entreprise_id: string) => {
    
    try {
        const response = await Axios.get(`entreprise/categories-depense`,
            { withCredentials: true });
            
        return response;
    } catch (error) {
        // console.error("Error fetching user profile:", error);
        throw error;
    }
    
    
}
/**
 * Ajout d'un utilisateur
 */
const addEntreprise = async (data: EntrepriseType) => {
    try {
        const response = await Axios.post('entreprise/add',
            data,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

/**
 * Mise à jour d'un utilisateur
 */
const updateEntreprise = async (nom: TypeEntreprise) => {
    try {
        const response = await Axios.post('entreprise/set',
            nom,{                         
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}
const removeUserEntreprise = async (nom: DataType) => {
    try {
        const response = await Axios.post('entreprise/remove_user_from_entreprise',
            nom,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

/**
 * Suppression d'un utilsateur
 */
const deleteEntreprise = async (Entreprise: TypeEntreprise) => {
    try {
        const response = await Axios.post(`entreprise/del`,
            Entreprise,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

// Décaraltion des esrvices pour import
export const entrepriseService = {
    allEntreprise, getEntreprise, addEntreprise,
    updateEntreprise, deleteEntreprise, allUserEntreprise, 
    getEntrepriseUsers, getUserEntreprises, removeUserEntreprise,
    stockEntreprise, stockCateSemaine, historiqueEntreprise, historySuppEntreprise,
    sortieUserEntreprise,
}
