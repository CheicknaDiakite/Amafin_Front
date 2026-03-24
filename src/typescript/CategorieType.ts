// export type ReponseCategorie = {
//     id: number;
//     libelle: string;
//     slug: string;
//     sous_categorie_count: number;
// }
export type CategorieType = {
    uuid?: string;
    user_id?: string;
    image?: File | undefined | null ;
    libelle: string;
    slug: string;
    sous_categorie_count: number;
}
type CateType = {
    etat: boolean;
    message: string;
    donnee: CategorieType
    
}
export interface ReponseCategorie {
    // Ajoutez ici les propriétés de la réponse selon votre API
    data: CateType
}

export type SlugType = {
    slug?: string | undefined;
    all?: string;
    uuid?: string;
    user_id?: number;
}

export type CateBouType = {
    id:number;
    libelle:string;
    sous_categorie_count:number;
    length: number;
} & SlugType