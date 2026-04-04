// export type UserTypee = {
//     avatar:string,
//     user_id?: number,
//     email:string,
//     first_name:string,
//     id:number,
//     last_name:string,
//     numero:string,
//     role:number,
//     username:string,
//     boutique_id?: number
//     etat?: boolean;
//     message?: string;
// } 
export type LoginType = {
    username: string;
    password?: string;
}

export type UserType = {     
    first_name: string;
    last_name: string;
    email: string;
    user_id?: string;
} & LoginType

export type UtilisateurType = {
    id?: number;
    avatar?: string;
    entreprise_id?: string;
    email: string;
    email_user?: string;
    first_name: string;
    uuid: string;
    user_id?: string;
    pays?: string;
    role: number;
    last_name: string;
    numero: number;
    username: string;
    is_admin?: string;
    is_superuser?: boolean;
    is_sortie?: boolean;
    is_cabinet?: boolean;
    repassword?: string,
    password?: string,
    profession?: string;
  };

  export type ClienType = {
    
    email: string;
    nom: string;
    libelle?: string;
    adresse: string;
    uuid?: string;
    id?: string;
    user_id?: string;
    date?: string;
    coordonne?: string;
    entreprise_id?: string;
    role: number;
    numero: number;
    
  };
  export type AvisType = {
    libelle: string;
    description: string;
    user_id: string
  }

export type UnUserType = UtilisateurType; // ou réutilisez le même type directement

type UsType = {
    etat: boolean;
    message: string;
    donnee: UtilisateurType 
}
export interface ReponseUser {
    // Ajoutez ici les propriétés de la réponse selon votre API
    data: UsType
}

export type RegisType = {
    etat: boolean;
    message: string;
    token: string;
    id?: string;
    access?: string;
}
export interface RegisterResponse {
    // Ajoutez ici les propriétés de la réponse selon votre API
    data: RegisType
}

export interface UserResponse {
    // Ajoutez ici les propriétés de la réponse selon votre API
    data: UserType;    
}