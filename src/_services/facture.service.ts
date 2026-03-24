import { EntreType } from "../typescript/DataType";
import { FacSorType } from "../typescript/fac";
import Axios from "./caller.service";

/**
 * Récupératoin de la liste des utilisateurs
 */
const allFacEntre = async (slug: string) => {
    try {
        const response = await Axios.post('entreprise/facture/entre/get', slug,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}
/**
 * Récupération d'un utilisateur
 */
const getFacEntre = async (slug: string) => {
    try {
        const response = await Axios.get(`entreprise/facture/entre/get/${slug}`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}
const getAllFacEntre = async (slug: string, uuid: string) => {
    try {
        const response = await Axios.get(`entreprise/facture/entre/get_facEntersEntreprise_entreprise/${uuid}`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}
/**
 * Ajout d'un Entrer
 */
const addFacEntre = async (data: FacSorType) => {
    try {
        const response = await Axios.post('entreprise/facture/entre/add',
            data,{                         
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
/**
 * Mise à jour d'un utilisateur
 */
const updateFacEntre = async (nom: FacSorType) => {
    try {
        const response = await Axios.post('entreprise/facture/entre/set',
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
/**
 * Suppression d'un utilsateur
 */
const deleteFacEntre = async (categorie: FacSorType) => {
    try {
        const response = await Axios.post(`entreprise/facture/entre/del`, categorie,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

// Décaraltion des esrvices pour import
export const facEntrerService = {
    allFacEntre, getFacEntre, addFacEntre, updateFacEntre, deleteFacEntre, getAllFacEntre
}

/**
 * Récupératoin de la liste des utilisateurs
 */
const allFacSortie = async (slug: string) => {
    try {
        const response = await Axios.post('entreprise/facture/sortie/get', slug,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}
/**
 * Récupération d'un utilisateur
 */
const getFacSortie = async (slug: string) => {
    try {
        const response = await Axios.get(`entreprise/facture/sortie/get/${slug}`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}
const getAllFacSortie = async (slug: string, uuid: string) => {
    try {
        const response = await Axios.get(`entreprise/facture/sortie/get_facSortiesEntreprise_entreprise/${uuid}`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}
/**
 * Ajout d'un Entrer
 */
const addFacSortie = async (data: FacSorType) => {
    try {
        const response = await Axios.post('entreprise/facture/sortie/add',
            data,{                         
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
/**
 * Mise à jour d'un utilisateur
 */
const updateFacSortie = async (nom: EntreType) => {
    try {
        const response = await Axios.post('entreprise/facture/sortie/set',
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
/**
 * Suppression d'un utilsateur
 */
const deleteFacSortie = async (categorie: EntreType) => {
    try {
        const response = await Axios.post(`entreprise/facture/sortie/del`, categorie,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

// Décaraltion des esrvices pour import
export const facSortieService = {
    allFacSortie, getFacSortie, addFacSortie, updateFacSortie, deleteFacSortie, getAllFacSortie
}
