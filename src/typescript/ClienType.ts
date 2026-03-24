export type FormClienType = {
    nom: string;
    adresse: string;
    numero: number,
    role?: number,
    libelle?: string,
    email: string;
    user_id: string;
    entreprise_id: string;
    coordonne: string;
}

type CliType = {
    etat: boolean;
    message: string;
    donnee: FormClienType
    
}
export interface ReponseClient {
    // Ajoutez ici les propriétés de la réponse selon votre API
    data: CliType
}