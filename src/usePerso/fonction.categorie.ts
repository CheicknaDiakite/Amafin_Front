import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CategorieFormType, SousCategorieFormType } from "../typescript/FormType";
import { useNavigate } from "react-router-dom";
import { CateBouType, DataType, InfoSousType, RecupType, SlugType } from "../typescript/DataType";
import { categorieService, souscategorieService } from "../_services";
import { foncError } from "./fonctionPerso";
import { CategorieType } from "../typescript/CategorieType";
import { accountService } from "../_services/account.service";

// Fonction utilitaire pour gérer les erreurs d'authentification
const handleAuthError = (error: any, navigate: any) => {
  if (error?.response?.status === 401) {
    // Token expiré et refresh échoué
    accountService.logout();
    navigate('/login');
    toast.error("Session expirée. Veuillez vous reconnecter.");
    return true;
  }
  return false;
};

export function useFetchCategorie(slug: string) {
    const navigate = useNavigate();
    
    const [unCategorie, setUnCategorie] = useState<CategorieType>({
      uuid: '',
      libelle: '',
      slug: '',
      sous_categorie_count: 0,
      });
  
    const { data: us, isLoading, isError, error } = useQuery({
      queryKey: ["entreRecup", slug],
      queryFn: () =>
        categorieService.getCategorie(slug).then((res) => {
          if (res.data.etat === true) {
            return res.data.donnee;
          } else {
            toast.error(res.data.message);
            throw new Error(res.data.message);
          }
        }),
    });

    // Gestion des erreurs d'auth
    useEffect(() => {
      if (error && (error as any)?.response?.status === 401) {
        handleAuthError(error, navigate);
      }
    }, [error, navigate]);
  
    useEffect(() => {
      if (us) {
        setUnCategorie(us);
      }
    }, [us]);
  
    return { unCategorie, setUnCategorie, isLoading, isError };
}
  
export function useCategoriesEntreprise() {
    const navigate = useNavigate();
    
    const [cateEntreprises, setCateEntreprise] = useState<CateBouType[]>([]);
  
    const { data: us, isLoading, isError, error } = useQuery({
      queryKey: ["enRecup"],
      queryFn: async () => {
        const res = await categorieService.categoriesEntreprise();
          if (res.data.etat === true) {
            const donnees = res.data.donnee as unknown as CateBouType[];
            return donnees || [];
          } else {
            toast.error(res.data.message);
            // throw new Error(res.data.message);
          }
        },
    });

    // Gestion des erreurs d'auth
    useEffect(() => {
      if (error && (error as any)?.response?.status === 401) {
        handleAuthError(error, navigate);
      }
    }, [error, navigate]);
  
    useEffect(() => {
      if (us) {
        setCateEntreprise(us);
      }
    }, [us]);
  
    return { cateEntreprises, isLoading, isError };
}

export function useCreateCategorie() {
    const navigate = useNavigate();
    const useQ = useQueryClient();
    
    const ajout = useMutation({
      mutationFn: (data: CategorieFormType) => {
        return categorieService.addCategorie(data)
        .then((res) => {
          if (res.data.etat===false) {
            if(res.data.message !== "requette invalide"){
              toast.error(res.data.message);
            }
          } else {
            useQ.invalidateQueries({ queryKey: ["enRecup"] });
            toast.success("C'est ajouter avec succès");
          }
      })
      },
      onError: (error: any) => {
        if (!handleAuthError(error, navigate)) {
          const message = error?.response?.data?.message || error.message || "Une erreur est survenue";
          toast.error(message);
        }
      },
    });
  
    const ajoutCategorie = (post: CategorieFormType) => {
      ajout.mutate(post);
    };

    return { ajoutCategorie }
}

export function useUpdateCategorie() {
    const navigate = useNavigate();
    const useQ = useQueryClient();

    const modif = useMutation({
      mutationFn: (data: CategorieType) => {
        return categorieService
          .updateCategorie(data)
          .then((res) => {
            if (res.data.etat === true) {
              toast.success("Modification réussie");
              useQ.invalidateQueries({ queryKey: ["enRecup"] });
              useQ.invalidateQueries({ queryKey: ["entreRecup"] });
            } else {
              toast.error(res.data.message);
            }
            return res;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      onError: (error) => {
        if (!handleAuthError(error, navigate)) {
          foncError(error);
        }
      },
    });

    const updateCategorie = (chap: CategorieType, options?: any) => {
      modif.mutate(chap, options);
    };

    return { updateCategorie };
}

export function useDeleteCategorie() {
    const navigate = useNavigate();
    const useQ = useQueryClient();
    
    const del = useMutation({
      mutationFn: (post: CategorieType) => {
        return categorieService.deleteCategorie(post).then((res) => {
          if (res.data.etat !== true) {
            toast.error(res.data.message);
          } else {
            useQ.invalidateQueries({ queryKey: ["enRecup"] });
            toast.success("Supprimée avec succès");
          }
          return res;
        });
      },
      onError: (error: any) => {
        if (!handleAuthError(error, navigate)) {
          const message = error?.response?.data?.message || error.message || "Une erreur est survenue";
          toast.error(message);
        }
      }
    });

    const deleteCategorie = (post: CategorieType, options?: any) => {
      del.mutate(post, options);
    };

    return { deleteCategorie };
}

// SOUS_CATEGORIE

export function useFetchSousCate(slug: string) {
  const navigate = useNavigate();
  
  const [unSousCate, setUnSousCate] = useState<SousCategorieFormType>({
      libelle: '',
      user_id: '',
      categorie_slug: '',
    });

  const { data: us, isLoading, isError, error } = useQuery({
    queryKey: ["sortieRecup", slug],
    queryFn: () =>
        souscategorieService.getSousCategorie(slug).then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          throw new Error(res.data.message || "Erreur lors de la récupération");
        }
      }),
  });

  // Gestion des erreurs d'auth
  useEffect(() => {
    if (error && (error as any)?.response?.status === 401) {
      handleAuthError(error, navigate);
    }
  }, [error, navigate]);

  useEffect(() => {
    if (us) {
      setUnSousCate(us);
    }
  }, [us]);

  return { unSousCate, setUnSousCate,  isLoading, isError };
}

export function useAllGetSousCate(slug: string) {
  const navigate = useNavigate();
  
  const [getSousCates, setSousCate] = useState<RecupType[]>([]);
  
  const {data: us, isLoading, isError, error} = useQuery({
    queryKey: ["SouCategorie", slug],
    queryFn: () =>
        souscategorieService.getAllSousCategorie(slug).then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          throw new Error(res.data.message || "Erreur lors de la récupération");
        }
      }),
  });

  // Gestion des erreurs d'auth
  useEffect(() => {
    if (error && (error as any)?.response?.status === 401) {
      handleAuthError(error, navigate);
    }
  }, [error, navigate]);

  useEffect(() => {
      if (us) {
        setSousCate(us);
      }
    }, [us]);

  return { getSousCates, setSousCate, isLoading, isError };
}

export function useFetchAllSousCate() {
  const navigate = useNavigate();
  
  const [souscategories, setSousCate] = useState<RecupType[]>([]);
  
  const {data: us, isLoading, isError, error} = useQuery({
    queryKey: ["SouCategorie"],
    queryFn: () =>
        souscategorieService.getSousCategoriesUser().then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          throw new Error(res.data.message || "Erreur lors de la récupération");
        }
      }),
  });

  // Gestion des erreurs d'auth
  useEffect(() => {
    if (error && (error as any)?.response?.status === 401) {
      handleAuthError(error, navigate);
    }
  }, [error, navigate]);

  useEffect(() => {
      if (us) {
          setSousCate(us);
      }
    }, [us]);

  return { souscategories, setSousCate, isLoading, isError };
}

export function useInfoSousCate(slug: SlugType) {
  const navigate = useNavigate();
  
  const [infos, setInfo] = useState<InfoSousType[]>([]);

  const {data: us, isLoading, isError, error} = useQuery({
    queryKey: ["info", slug],
    queryFn: () =>
        souscategorieService.getInfo(slug).then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          toast.error(res.data.message);
          // throw new Error(res.data.message);
        }
      }),
  });

  // Gestion des erreurs d'auth
  useEffect(() => {
    if (error && (error as any)?.response?.status === 401) {
      handleAuthError(error, navigate);
    }
  }, [error, navigate]);

  useEffect(() => {
      if (us) {
        setInfo(us);
      }
    }, [us]);

  return { infos, isLoading, isError };
}

export function useCateSousCate(slug: SlugType) {
  const navigate = useNavigate();
  
  const [sousCate, setSousCate] = useState<InfoSousType[]>([]);
  
  const {data: us, isLoading, isError, error} = useQuery({
    queryKey: ["info", slug],
    queryFn: () =>
        souscategorieService.allSousCategorie(slug).then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          toast.error(res.data.message);
          throw new Error(res.data.message);
        }
      }),
  });

  // Gestion des erreurs d'auth
  useEffect(() => {
    if (error && (error as any)?.response?.status === 401) {
      handleAuthError(error, navigate);
    }
  }, [error, navigate]);

  useEffect(() => {
      if (us) {
        setSousCate(us);
      }
    }, [us]);

  return { sousCate, isLoading, isError };
}

export function useCreateSousCate() {
  const navigate = useNavigate();
  const useQ = useQueryClient();
  
  const ajout = useMutation({
    mutationFn: (data: SousCategorieFormType) => {
      return souscategorieService.addSousCategorie(data)
      .then((res) => {
        if (res.data.etat===false) {
          if(res.data.message !== "requette invalide"){
            toast.error(res.data.message);
          }
        } else {
          useQ.invalidateQueries({ queryKey: ["SouCategorie"] });
          toast.success("C'est ajouter avec succès");
        }
    })
    },
    onError: (error: any) => {
      if (!handleAuthError(error, navigate)) {
        const message = error?.response?.data?.message || error.message || "Une erreur est survenue";
        toast.error(message);
      }
    },
  });

  const ajoutSousCate = (post: SousCategorieFormType) => {
    ajout.mutate(post);
  };

  return { ajoutSousCate }
}

export function useUpdateSousCate() {
  const navigate = useNavigate();
  const useQ = useQueryClient();

  const modif = useMutation({
    mutationFn: (data: SousCategorieFormType) => {
      return souscategorieService
      .updateSousCategorie(data)
        .then((res) => {
          if (res.data.etat === true) {
            toast.success("Modification réussie");
            useQ.invalidateQueries({ queryKey: ["SouCategorie"] });
          } else {
            toast.error(res.data.message);
          }
          return res;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
    onError: (error: any) => {
      if (!handleAuthError(error, navigate)) {
        const message = error?.response?.data?.message || error.message || "Une erreur est survenue";
        toast.error(message);
      }
    },
  });

  const updateSousCate = (chap: SousCategorieFormType, options?: any) => {
    modif.mutate(chap, options);
  };

  return { updateSousCate };
}

export function useDeleteSousCate() {
  const navigate = useNavigate();
  const useQ = useQueryClient();
  
  const del = useMutation({
    mutationFn: (post: DataType) => {
      return souscategorieService.deleteSousCategorie(post).then((res) => {
        if (res.data.etat !== true) {
          toast.error(res.data.message);
        } else {
          useQ.invalidateQueries({ queryKey: ["SouCategorie"] });
          toast.success("Supprimée avec succès");
        }
      });
    },
    onError: (error: any) => {
      if (!handleAuthError(error, navigate)) {
        const message = error?.response?.data?.message || error.message || "Une erreur est survenue";
        toast.error(message);
      }
    },
    
  });

  const deleteSousCate = (post: DataType, options?: any) => {
    del.mutate(post, options);
  };

  return {deleteSousCate}
}