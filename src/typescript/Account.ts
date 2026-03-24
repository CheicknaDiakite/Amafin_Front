import { ReactNode } from "react";

export type UuType = {
    uuid:string
   }
export type ABType = {
    id: number,
  }

export type Account = {
    id: number;
    username: string
}
export type HistoriqueType = {
    type: string,
    ref: string,
    actions: string,
    qte: number,
    pu: number,
    libelle: string,
    categorie: string,
    date: string,
    action?: string,
}

export type EntrepriseType = {
    nom: string,
    email: string,
    numero: number,
    adresse: string,
    user_id?: string,
    pays?: string,
    libelle?: string,
    historique?: HistoriqueType[]
}

export type  ChildrenProps = {
    children?: ReactNode;
  }

 export interface ChartState {
    chart: {
        type: string;
        height: number;
        toolbar: {
            show: boolean;
        };
    };
    plotOptions: {
        bar: {
            columnWidth: string;
            borderRadius: number; // Assurez-vous que borderRadius est inclus
        };
    };
    dataLabels: {
        enabled: boolean;
    };
    stroke: {
        show: boolean;
        width: number;
        colors: string[];
    };
    responsive: any[]; // Remplacez par un type plus spécifique si possible
}

