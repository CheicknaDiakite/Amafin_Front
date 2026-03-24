import { FormType } from "./FormType";
export type TypeSlug = {
    all?: string | undefined;
    user_id?: string | null | undefined;
    client_id?: string;
  }
export type DataType = {
    user_id: string;
    libelle?: string;
    entreprise_id?: string;
    admin_id?: string;
}
export type DataSlugType = {
    user_id: string;
    all?: string;
    slug?: string;
}

export type InfoSortieType = {

}

export type InfoSousType = {
    libelle: string;
    client?: string;
    date?: string;
    pu: number;
    pu_achat?: number;
    qte: number;
    prix_total: number;
    sortie: InfoSousType;
    // stock: InfoSousType;
}

export type EntreRecupType = {
    user_id: number;
    libelle: string;
    qte: number;
    pu: number;
    categorie_slug: string;
}

export type SortieType = {
    user_id: string;
    client_id?: string;
    entreprise_id?: string;
    categorie_libelle?: string;
    qte: number;
    pu: number;
    is_prix?: boolean;
    entre_id?: string;
}

export type SousType = {
    categorie_slug: string;
} & DataType

export type EntreType = {
    qte: number;
    pu: number;
    pu_achat?: number;
    facture?: File | undefined | null ;
    date?: string;
    ref?: string;
    entreprise_id?: string;
    is_sortie?: boolean;
    is_prix?: boolean;
    entre_id?: number;
} & SousType

export type DepenseType = {
    id?: number;
    libelle: string;
    uuid?: string;
    date: string;
    slug?: string;
    somme?: number;
    somme_dep?: number;
    facture?: File | undefined | null ;
    boutique_id?: number;
    user_id?: string;
    entreprise_id?: string;
    /** Objectif financier (obligatoire à la création côté API) */
    objectif_id?: number | null;
    objectif_nom?: string | null;
}

export type DepenseSumType = {
    mois: string;
    total: number;
}

export type TypeAll = {
    all: string;
}
export type SlugType = {
    slug?: string | undefined;
    all?: string;
    user_id?: string;
}

export type CateBouType = {
    id:number;
    libelle:string;
    uuid:string;
    sous_categorie_count:number;
    length: number;
    image?: File | undefined | null ;
} & SlugType


export type TypeEntreprise = {
    adresse: string;
    ref?: string;
    libelle?: string;
    coordonne:string;
    email:string;
    uuid?:string;
    id:string;
    image:File | unknown;
    licence_active?:boolean;
    licence_code:string;
    licence_date_expiration:string;
    licence_type:string;
    nom:string;
    numero:number;
    user_id?: string;
    pays?: string;
}

type StockMonth = {
    libelle: string;
    somme_qte: number;
}
type StokcWeekType = {
    month: string;
    count: number;
    details: StockMonth[]
}
type Detail = {
    id: number;
    qte: number;
    pu: number;
    prix_total: number;
    created_at: string; // ou Date si converti avant utilisation
  };
  
  // Type pour les détails organisés par mois
  type DetailsParMois = {
    [mois: string]: Detail[]; // Une clé dynamique représentant un mois (e.g., "December 2024")
  };
  
export type StockType = {
    somme_entrer_pu: number;
    somme_entrer_qte: number;
    somme_sortie_pu: number;
    somme_sortie_qte: number;
    nombre_entrer: number;
    nombre_sortie: number;
    count_sortie_par_mois?: StokcWeekType[]
    count_entrer_par_mois?: StokcWeekType[]
    sorties_par_mois?: StokcWeekType[]
    details_sortie_par_mois?: DetailsParMois
    details_entrer_par_mois?: DetailsParMois
}

export type SortieUserType = {
    user_id?: string;
    total_nombre_vente: Array<{
        created_by__id: number | null;
        created_by__username: string | null;
        total: number;
    }>;
    total_par_utilisateur: Array<{
        username: string | null;
        total_qte: number;
    }>;
    mensuel_par_utilisateur: Array<{
        month: string;
        details: Array<{
            username: string | null;
            total_qte: number;
        }>;
    }>;
}


export type RecupType = {
    all?: string;
    nom?: string;
    adresse?: string;
    coordonne?: string;
    numero?: number;
    uuid?: string;
    client?: string;
    label?: string;
    id?: string;
    ref?: string;
    user_id?: number;
    slug?: string;
    libelle?: string;
    categorie_libelle?: string;
    is_sortie?: boolean;
    prix_total?: number;
    pu?: number;
    pu_achat?: number;
    qte?: number;
    categorie_slug?: string;
    clientName?: string,
    clientAddress?: string,
    clientCoordonne?: string,
    invoiceDate?: string,
    dueDate?: string,
    date?: string,
    username?: string,
    last_name?: string,
    first_name?: string,
    notes?: string,
    is_prix?: boolean,
    image?: File | undefined | null ;
    code_barre?: File | undefined | null ;
    invoiceNumber?: number,
    all_inventaire?: number,
    post?: TypeEntreprise;

} 

export type CategoriesProps = {
    categories: RecupType[];
  }

export type DonneType = {
    onClick?: ({username, password}: FormType) => void;
}

export interface RouteParams extends Record<string, string>  {
    slug: string;
  }