// src/api/compte.ts
import { apiClient } from "./apiClient";

export interface Compte {
  id: number;
  nom: string;
  solde: number;
  devise: string;
}

export const getComptes = async (): Promise<Compte[]> => {
  const res = await apiClient.get("comptes/");
  return res.data;
};

export const createCompte = async (data: { nom: string; solde: number; devise: string; }) => {
  const res = await apiClient.post("comptes/", data);
  return res.data;
};

export const updateCompte = async (id: number ,data: { nom: string; solde: number; devise?: string; }) => {
  
  const res = await apiClient.patch(`comptes/${id}/`, data);
  return res.data;
};

export const deleteCompte = async (data: number | string) => {
  const res = await apiClient.delete(`comptes/${data}/`);
  return res.data;
};
