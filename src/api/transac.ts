// src/api/transaction.ts

import Axios from "../_services/caller.service";


export interface Transact {
  id?: number;
  uuid?: string;
  compte_source?: number | null;
  compte_destination?: number | null;
  categorie?: number | null;
  montant: number;
  type: "revenu" | "depense" | "transfert" | string;
  description?: string;
  date_transaction?: string;
  // optional fields used across UI
  created_at?: string;
  devise?: string;
}

export const getTransacts = async (): Promise<Transact[]> => {
  const response = await Axios.get("/entreprise/transactions/");
  return response.data;
};

export const getStatis = async () => {
  const response = await Axios.get("/entreprise/categories-transactions");
  return response.data;
};

// export const createTransact = async (data: Transact) => {
//   const response = await Axios.post("/entreprise/transactions/", data);
//   return response.data;
// };

export const createTransact = async (
  data: Omit<Transact, "id" | "date_transaction">
) => {
  const res = await Axios.post("/entreprise/transactions/", data);
  // console.log("Creating transaction with data:", data);
  return res.data;
};

export const updateTransact = async (id: number, data: Partial<Transact>) => {
  const res = await Axios.put(`/entreprise/transactions/${id}/`, data);
  return res.data;
};

export const deleteTransact = async (id: number) => {
  const res = await Axios.delete(`/entreprise/transactions/${id}/`);
  return res.data;
};
