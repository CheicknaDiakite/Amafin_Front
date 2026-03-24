export type FormType = {
  username: string;
  password: string;
  passwordConfirm?: string;
};

type TypeForn = {
  user_id: string;
  pu_achat?: number;
  uuid?: string;
  client_id?: string;
  libelle: string;
  image?:File | unknown;
}
type TypeNumForn = {
  pu: number;
  qte: number;
}
export type CategorieFormType = {
  entreprise_id: string;
} & TypeForn;

export type SousCategorieFormType = {
  categorie_slug: string;
} & TypeForn;

export type EntreFormType = {
  cumuler_quantite?: boolean;
  is_sortie?: boolean;
  is_prix?: boolean;
  date: string;
  categorie_slug?: string;
} & TypeForn & TypeNumForn;

export type FormValueType = {
  email?: string;
  libelle?: string;
  numero?: string;
  pays?: string;
  email_user?: string;
  entreprise_id?: string;
  user_id?: string;
  first_name: string;
  last_name: string;
} & FormType
