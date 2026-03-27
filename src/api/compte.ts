// src/api/compte.ts
import Axios from "../_services/caller.service";

export interface Compte {
  id: number;
  nom: string;
  solde: number;
  devise: string;
}

export const getComptes = async (): Promise<Compte[]> => {
  const res = await Axios.get("/entreprise/comptes/");
  return res.data;
};

export const createCompte = async (data: { nom: string; solde: number; devise: string; }) => {
  const res = await Axios.post("/entreprise/comptes/", data);
  return res.data;
};

export const updateCompte = async (id: number ,data: { nom: string; solde: number; devise?: string; }) => {
  
  const res = await Axios.patch(`/entreprise/comptes/${id}/`, data);
  return res.data;
};

export const deleteCompte = async (data: number | string) => {
  const res = await Axios.delete(`/entreprise/comptes/${data}/`);
  return res.data;
};
