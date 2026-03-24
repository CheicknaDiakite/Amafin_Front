// // src/api/objectif.ts
// import { apiClient } from "./apiClient";

// export interface Objectif {
//   id: number;
//   nom: string;
//   montant_cible: number;
//   montant_atteint: number;
//   date_limite: string;
// }

// export const getObjectifs = async (): Promise<Objectif[]> => {
//   const res = await apiClient.get("objectifs/");
//   return res.data;
// };

// export const createObjectif = async (data: Omit<Objectif, "id" | "montant_atteint">) => {
//   const res = await apiClient.post("objectifs/", data);
//   return res.data;
// };
import { apiClient } from './apiClient';

export interface Objectif {
  id?: number;
  uuid?: string;
  nom: string;
  montant_cible: number;
  montant_atteint?: number;
  total_depenses?: number;
  montant_net?: number;
  date_limite?: string;
  compte_associe?: number | null;
}

export const getObjectifs = async (): Promise<Objectif[]> => {
  const res = await apiClient.get('objectif-financier/');
  return res.data;
};

export const createObjectif = async (data: {nom: string, montant_cible: number, date_limite: any, compte_associe: any}) => {
  const res = await apiClient.post('objectif-financier/', data);
  console.log('Creating objectif with data:', res);
  
  return res.data;
};

export const updateObjectif = async (id: number, data: Partial<Objectif>) => {
  const res = await apiClient.patch(`objectif-financier/${id}/`, data);
  return res.data as Objectif;
};

export const deleteObjectif = async (id: number | string) => {
  const res = await apiClient.delete(`objectif-financier/${id}/`);
  return res.data;
};
