import { createContext } from "react";

type StateContextType = {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    phone: string;
    setPhone: React.Dispatch<React.SetStateAction<string>>;
    bankName: string;
    setBankName: React.Dispatch<React.SetStateAction<string>>;
    bankAccount: string;
    setBankAccount: React.Dispatch<React.SetStateAction<string>>;
    website: string;
    setWebsite: React.Dispatch<React.SetStateAction<string>>;
    clientName: string;
    setClientName: React.Dispatch<React.SetStateAction<string>>;
    clientAddress: string;
    setClientAddress: React.Dispatch<React.SetStateAction<string>>;
    invoiceNumber: string;
    setInvoiceNumber: React.Dispatch<React.SetStateAction<string>>;
    invoiceDate: string;
    setInvoiceDate: React.Dispatch<React.SetStateAction<string>>;
    dueDate: string;
    setDueDate: React.Dispatch<React.SetStateAction<string>>;
    notes: string;
    setNotes: React.Dispatch<React.SetStateAction<string>>;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    quantity: string;
    setQuantity: React.Dispatch<React.SetStateAction<string>>;
    price: string;
    setPrice: React.Dispatch<React.SetStateAction<string>>;
    amount: string;
    setAmount: React.Dispatch<React.SetStateAction<string>>;
    list: any[];
    setList: React.Dispatch<React.SetStateAction<any[]>>;
    total: number;
    setTotal: React.Dispatch<React.SetStateAction<number>>;
    width: number;
    componentRef: React.RefObject<HTMLDivElement>;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showLogoutModal: boolean;
    setShowLogoutModal: React.Dispatch<React.SetStateAction<boolean>>;
    handlePrint: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    editRow: (id: string) => void;
    deleteRow: (id: string) => void;
  };
  
  export const StateContext = createContext<StateContextType | undefined>(
    undefined
  );

export type FacSorType = {
  user_id: string;
  entreprise_id?: string;
  facture?: File | null;
  libelle: string;
  ref: string;
  date: string;
}

// Définir le type pour un élément d'historique
export type Historique = {
  type: string;
  ref?: string;
  action: string;
  libelle: string;
  categorie: string;
  qte: number;
  pu: number;
  date: string;
}

// Définir le type pour une boutique
export type Boutique = {
  id?: number;
  nom: string;
  adresse: string;
  numero: number;
  email: string;
  historique?: Historique[];
}

// Définir le type pour la réponse qui contient les boutiques
export type ResponseData = {
  etat: boolean;
  message: string;
  donnee: Boutique[];
}
