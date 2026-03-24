// src/api/transaction.ts
import { apiClient } from "./apiClient";

export interface Compte {
  id: number;
  nom: string;
  solde: number;
  utilisateur: number;
}

export interface Transaction {
  id: number;
  compte_source: number | null;
  compte_destination: number | null;
  montant: number;
  type: string;
  description?: string;
  date_transaction?: string;
}

export const getTransactions = async (): Promise<Transaction[]> => {
  const res = await apiClient.get("transactions/");
  return res.data;
};

export const createTransaction = async (
  data: Omit<Transaction, "id" | "date_transaction">
) => {
  const res = await apiClient.post("transactions/", data);
  return res.data;
};

export const getAllComptes = async (): Promise<Compte[]> => {
  const res = await apiClient.get("comptes/");
  return res.data;
};
