import { CategorieType, ReponseCategorie } from '../typescript/CategorieType';
import { DataSlugType, DataType, DepenseType, EntreType, SlugType, SortieType, TypeSlug } from '../typescript/DataType'
import { CategorieFormType, EntreFormType, SousCategorieFormType } from '../typescript/FormType';
import Axios from './caller.service'


/**
 * Récupératoin de la liste des utilisateurs
 */


const categoriesEntreprise = async (): Promise<ReponseCategorie> => {
    // const categoriesEntreprise = (post: string ) => {
    
        try {
            const response = await Axios.get(`entreprise/categorie/get_categories_utilisateur`,
                { withCredentials: true })
            console.log("hh")
            return response;
        } catch (error) {
            console.error("Error fetching entreprises:", error);
            throw error;
        }   
        
}

/**
 * Récupération d'un utilisateur
 */
const getCategorie = async (slug: string): Promise<ReponseCategorie> => {   
    try {
        const response = await Axios.get(`entreprise/categorie/${slug}`,
            { withCredentials: true });
        return response;
    } catch (error) {
            console.error("Error fetching entreprises:", error);
            throw error;
        }
    
}

/**
 * Ajout d'un utilisateur
 */
const addCategorie = async (data: CategorieFormType): Promise<ReponseCategorie> => {
    
    try {
        const response = await Axios.post('entreprise/categorie/add',
            data,{                         
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

/**
 * Mise à jour d'un utilisateur
 */
const updateCategorie = async (nom: CategorieType): Promise<ReponseCategorie> => {
    try {
        const response = await Axios.post('entreprise/categorie/set', 
            nom,{                         
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

/**
 * Suppression d'un utilsateur
 */
const deleteCategorie = async (categorie: CategorieType): Promise<ReponseCategorie> => {
    try {
        const response = await Axios.post(`entreprise/categorie/del`,
            categorie,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

// Décaraltion des esrvices pour import
export const categorieService = {
    getCategorie, addCategorie,
    updateCategorie, deleteCategorie, categoriesEntreprise
}

/**
 * Récupératoin de la liste des utilisateurs
 */
const allSousCategorie = async (post: SlugType ) => {
    try {
        const response = await Axios.post('entreprise/sous_categorie/get', 
            post,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
    
}

const getAllSousCategorie = async (slug: string) => {
    try {
        const response = await Axios.get(`entreprise/sous_categorie/get_sous_categories_par_categorie/${slug}`,
            { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

/**
 * Récupération d'un utilisateur
 */
const getSousCategorie = async (slug: string) => {
    
    try {
        const response = await Axios.get(`entreprise/sous_categorie/get/${slug}`,
            { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

const getSousCategoriesUser = async () => {
    try {
        const response = await Axios.get(`entreprise/sous_categorie/get_sous_categories_utilisateur`,
            { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

const getInfo = async (slug: SlugType) => {
    try {
        const response = await Axios.post(`entreprise/info_sous_cat/get`,
            slug,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

/**
 * Ajout d'un utilisateur
 */
const addSousCategorie = async (data: SousCategorieFormType) => {
    try {
        const response = await Axios.post('entreprise/sous_categorie/add',
            data,{                         
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

/**
 * Mise à jour d'un utilisateur
 */
const updateSousCategorie = async (nom: SousCategorieFormType) => {
    try {
        const response = await Axios.post('entreprise/sous_categorie/set',
            nom,{                         
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });
            return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

/**
 * Suppression d'un utilsateur
 */

const deleteSousCategorie = async (categorie: DataType) => {
    try {
        const response = await Axios.post(`entreprise/sous_categorie/del`,
            categorie,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

// Décaraltion des esrvices pour import
export const souscategorieService = {
    allSousCategorie, getSousCategorie, getInfo,
    addSousCategorie, updateSousCategorie, deleteSousCategorie,
    getAllSousCategorie, getSousCategoriesUser
}


/**
 * Récupératoin de la liste des utilisateurs
 */
const allEntre = async (slug: TypeSlug ) => {
    try {
        const response = await Axios.post('entreprise/entre/get',
            slug,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}
/**
 * Récupération d'un utilisateur
 */
const getEntre = async (slug: string) => {
    try {
        const response = await Axios.get(`entreprise/entre/get/${slug}`,
            { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}
const getAllEntre = async (uuid: string) => {
    try {
        const response = await Axios.get(`entreprise/entre/get_entrers_entreprise/${uuid}`,
            { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}
/**
 * Ajout d'un Entrer
 */
const addEntre = async (data: EntreFormType) => {
    try {
        const response = await Axios.post('entreprise/entre/add',
            data,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}
/**
 * Mise à jour d'un utilisateur
 */
const updateEntre = async (nom: EntreType) => {
    try {
        const response = await Axios.post('entreprise/entre/set',
            nom,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}
/**
 * Suppression d'un utilsateur
 */
const deleteEntre = async (categorie: DataType) => {
    try {
        const response = await Axios.post(`entreprise/entre/del`,
            categorie,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

// Décaraltion des esrvices pour import
export const entrerService = {
    allEntre, getEntre, addEntre, updateEntre, deleteEntre, getAllEntre
}


/**
 * Récupératoin de la liste des utilisateurs
 */
const allDepense = async (slug: string ) => {
    try {
        const response = await Axios.post('entreprise/depense/get',
            slug,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}
/**
 * Récupération d'un utilisateur
 */
const getDepense = async (slug: string) => {
    try {
        const response = await Axios.get(`entreprise/depense/get/${slug}`,
            { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}
const getAllDepense = async () => {
    
    try {
        const response = await Axios.get(`entreprise/depense/get_depenses_entreprise`,
            { withCredentials: true });
            
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}
const getAllBudget = async (uuid: string) => {
    
    try {
        const response = await Axios.get(`entreprise/depense/get_budgets_entreprise/${uuid}`,
            { withCredentials: true });
            
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}
/**
 * Ajout d'un depense
 */

const getSumDepense = async () => {
    try {
        const response = await Axios.get(`entreprise/depense/get_depenses_somme`,
            { withCredentials: true });
            
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

const addDepense = async (data: DepenseType) => {
    try {
        const response = await Axios.post('entreprise/depense/add',
            data,{                         
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
    
}
/**
 * Mise à jour d'un utilisateur
 */
const updateDepense = async (nom: DepenseType) => {
    try {
        const response = await Axios.post('entreprise/depense/set',
            nom,{                         
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}
/**
 * Suppression d'un utilsateur
 */
const deleteDepense = async (categorie: DepenseType) => {
    try {
        const response = await Axios.post(`entreprise/depense/del`,
            categorie,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

// Décaraltion des esrvices pour import
export const depenseService = {
    allDepense, getDepense, addDepense, updateDepense, deleteDepense, getAllDepense, getSumDepense, getAllBudget
}


/**
 * Récupératoin de la liste des utilisateurs
 */
const allSortie = async (post: DataSlugType ) => {
    try {
        const response = await Axios.post('entreprise/sortie/get',
            post,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

const getAllSortie = async (slug: string) => {
    try {
        const response = await Axios.get(`entreprise/sortie/get_sorties_entreprise/${slug}`,
            { withCredentials: true });
            
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}
/**
 * Récupération d'un utilisateur
 */
const getSortie = async (slug: string) => {
    try {
        const response = await Axios.get(`entreprise/sortie/get/${slug}`,
            { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}
/**
 * Ajout d'un Entrer
 */
const addSortie = async (data: SortieType) => {
    try {
        const response = await Axios.post('entreprise/sortie/add',
            data,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}
/**
 * Mise à jour d'un utilisateur
 */
const updateSortie = async (nom: SortieType) => {
    
    try {
        const response = await Axios.post('entreprise/sortie/set',
            nom,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

const updateFacSortie = async (nom: SortieType) => {
    
    try {
        const response = await Axios.post('entreprise/sortie/setFac',
            nom,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}
/**
 * Suppression d'un utilsateur
 */
const deleteSortie = async (categorie: DataType) => {
    try {
        const response = await Axios.post(`entreprise/sortie/del`,
            categorie,{ withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error fetching entreprises:", error);
        throw error;
    }
    
}

// Décaraltion des esrvices pour import
export const sortieService = {
    allSortie, getSortie, addSortie, updateSortie, deleteSortie, getAllSortie, updateFacSortie
}
