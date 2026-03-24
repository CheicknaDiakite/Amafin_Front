import { useEffect, useState } from "react";
import { accountService, userService } from "../_services/account.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FormType, FormValueType } from "../typescript/FormType";
import { useNavigate } from "react-router-dom";

import { DataType, RecupType, SortieUserType, StockType, TypeEntreprise, TypeSlug } from "../typescript/DataType";
import { foncError } from "./fonctionPerso";
import { AvisType, ClienType, UnUserType, UserType, UtilisateurType } from "../typescript/UserType";
import { entrepriseService } from "../_services/entreprise.service";
import { EntrepriseType, HistoriqueType } from "../typescript/Account";
import { FormClienType } from "../typescript/ClienType";

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

// Avis

export function useAddAvis() {
    
  const useQ = useQueryClient();

  const ajoutAvis = useMutation({
      mutationFn: (post: AvisType) => {
        return userService.avisCreate(post)
        .then((res) => {
          if (res.data.etat===false) {
            if(res.data.message !== "requette invalide"){
              toast.error(res.data.message);
            }
          } else {
            useQ.invalidateQueries({ queryKey: ["AvisGet"] });
            toast.success("Votre avis a ete envoyer.");
          }
      })
      },
    });

    const createAvis = (post: AvisType) => {

      ajoutAvis.mutate(post);
    };

  return { createAvis }
}

export function useAvisGet() {
    
  const useQ = useQueryClient();

  const avisGet = useMutation({
      mutationFn: (post: string) => {
        return userService.avisGet(post)
        .then((res) => {
          if (res.data.etat===false) {
            if(res.data.message !== "requette invalide"){
              toast.error(res.data.message);
            }
          } else {
            useQ.invalidateQueries({ queryKey: ["AvisGet"] });
            toast.success("Inscription réussie");
          }
      })
      },
    });

    const getAvis = (post: string) => {
      avisGet.mutate(post);
    };

  return { getAvis }
}

export function useDeleteAvis() {
  // const navigate = useNavigate();
  const useQ = useQueryClient();
  
  const del = useMutation({
    mutationFn: (post: FormClienType) => {
      return userService.avisDelete(post).then((res) => {
        if (res.data.etat !== true) {
          toast.error(res.data.message);
        } else {
          useQ.invalidateQueries({ queryKey: ["AvisGet"] });
          // navigate(-1);
          toast.success("Supprimée avec succès");
        }
      });
    },
    onError: (error) => {
      foncError(error);
    },
  });

  const deleteAvis = (post: FormClienType) => {
    del.mutate(post);
    // console.log("delete ..",post)
  };

  return {deleteAvis}
}

// Pour l'utilisateur
export function useFetchUser() {
  
    const [unUser, setUnUser] = useState<UtilisateurType>({
      avatar:'',
      email:'',
      uuid:'',
      first_name:'',
      role: 0,
      last_name:'',
      user_id: '',
      numero:0,
      username:'',
    });
  
    const { data: us, isLoading, isError } = useQuery({
      queryKey: ["User",],
      queryFn: () =>
        userService.userUnGet().then((res) => {
          if (res.data.etat === true) {
            return res.data.donnee as UnUserType;
          } else {
            throw new Error("Les identifiants sont incorrects");
          }
        }),
    });
  
    useEffect(() => {
      if (us) {
        setUnUser(us);
      }
    }, [us]);

    return { us ,unUser, setUnUser, isLoading, isError };
  }

export function useFetchUnUser(slug: string) {
  
    const [unUser, setUnUser] = useState<UtilisateurType>({
      avatar:'',
      email:'',
      uuid:'',
      first_name:'',
      role: 0,
      last_name:'',
      user_id: '',
      numero:0,
      username:'',
    });
  
    const { data: us, isLoading, isError } = useQuery({
      queryKey: ["User", slug],
      queryFn: () =>
        userService.unUser(slug).then((res) => {
          if (res.data.etat === true) {
            return res.data.donnee as UnUserType;
          } else {
            throw new Error("Les identifiants sont incorrects");
          }
        }),
    });
  
    useEffect(() => {
      if (us) {
        setUnUser(us);
      }
    }, [us]);

    return { us ,unUser, setUnUser, isLoading, isError };
  }

  
export function useFetchAllUsers(slug: TypeSlug) {
  
    const [getUser, setUser] = useState<UtilisateurType[]>([]);

    const {data: us, isLoading, isError} = useQuery({
      queryKey: ["UserGet", slug],
      queryFn: async () => {
        const res = await userService.userAll(slug);
          if (res.data.etat === true) {
            const donnees = res.data.donnee as unknown as UtilisateurType[]; // Si c'est un tableau
            return donnees || [];
          } else {
            toast.error(res.data.message);
            return [];
          }
        }
      });
        

    useEffect(() => {
        if (us) {
          setUser(us);
        }
      }, [us]);

    return { getUser, setUser, isLoading, isError };
}

export function useAllUsers(slug: string) {
    const [getUsers, setUsers] = useState([]);

    const {data: us, isLoading, isError} = useQuery({
      queryKey: ["UserGet", slug],
      queryFn: () =>
        userService.allUsers(slug).then((res) => {
          if (res.data.etat === true) {
            return res.data.donnee;
          } else {
            // toast.error("Les identifiants sont incorrects");
          }
        }),
    });

    useEffect(() => {
        if (us) {
          setUsers(us);
        }
      }, [us]);

    return { getUsers, setUsers, isLoading, isError };
}

export function useAllMesUsers(slug: string) {
    const [getMesUsers, setMesUsers] = useState([]);

    const {data: us, isLoading, isError} = useQuery({
      queryKey: ["MesUserGet", slug],
      queryFn: () =>
        userService.allMesUsers(slug).then((res) => {
          if (res.data.etat === true) {
            return res.data.donnee;
          } else {
            // toast.error("Les identifiants sont incorrects");
          }
        }),
    });

    useEffect(() => {
        if (us) {
          setMesUsers(us);
        }
      }, [us]);

    return { getMesUsers, setMesUsers, isLoading, isError };
}

export function useCreateUser() {
    const navigate = useNavigate();
    const useQ = useQueryClient();
    
    const ajout = useMutation({
      mutationFn: (post: FormValueType) => {
        return userService
          .userRegister(post)
          .then((res) => {
            if (res.data.etat === false) {
              if (res.data.message === "L'utilisateur existe déjà") {
                toast.error("Cet utilisateur existe déjà. Veuillez vous connecter.");
              } else if (res.data.message !== "requette invalide") {
                toast.error(res.data.message);
              }
            } else {
              // Met à jour les requêtes et redirige
              useQ.invalidateQueries({ queryKey: ["AddUser"] });
              toast.success('Inscription réussie ! Vérifiez votre email.');
  
              // Enregistre un indicateur dans localStorage
              localStorage.setItem("inscriptionSuccess", "true");
  
              // Redirige l'utilisateur
              navigate("/");
              window.location.reload(); // Rechargement pour déclencher les toasts
            }
          })
          .catch((error) => {
            if (error.code === "ECONNABORTED") {
              toast.error("La requête a pris trop de temps, veuillez réessayer.");
            } else {
              toast.error("Une erreur s'est produite lors de l'inscription");
            }
          });
      },
    });
  
      const create = (post: FormValueType) => {
        ajout.mutate(post);
      };

      return { create }
}

export function useUpdateUser() {
    
    const useQ = useQueryClient();

    const modif = useMutation({
      mutationFn: (post: UserType) => {
        return userService
          .userUpdate(post)
          .then((res) => {
            if (res.data.etat === true) {
              toast.success("Modification reuissi");
              useQ.invalidateQueries({ queryKey: ["User"] });
              // navigate("/admin/formation/index")
              
            } else {
              toast.error("Nom trouver");
            }
          })
          .catch((err) => console.log(err));
      },
      onError: (error) => {
       foncError(error);
      },
    });
    const updateUser = (post: UserType) => {
      modif.mutate(post);

    };

      return {updateUser}
}

export function useDeleteUser() {
  const navigate = useNavigate();
  const useQ = useQueryClient();
  
  const del = useMutation({
    mutationFn: (post: UtilisateurType) => {
      return userService.userDelete(post).then((res) => {
        if (res.data.etat !== true) {
          toast.error(res.data.message);
        } else {
          useQ.invalidateQueries({ queryKey: ["EntreRecup"] });
          navigate(-1);
          toast.success("Supprimée avec succès");
        }
      });
    },
    onError: (error) => {
      foncError(error);
    },
    
  });

  const deleteUser = (post: UtilisateurType) => {
    del.mutate(post);
    // console.log("delete ..",post)
  };

  return {deleteUser}
}

export function useLoginUser() {
    const navigate = useNavigate();

    const connexion = useMutation({
        mutationFn: (post: FormType) => {
          return userService.userLogin(post)
          .then((res) => {            
            if (res.data.etat===false) {
              if(res.data.message !== "requette invalide"){
                toast.error(res.data.message);
              }
            } else {  
                           
              accountService.saveToken(res.data.id!, res.data.access)
              navigate('/')
              toast.success("Connexion réussie");
            }
        })
        },
      });
      
      const login = (post: FormType) => {
        connexion.mutate(post);
      };

      return {login}
}

export function useForgotUser() {

  const connexion = useMutation({
      mutationFn: (post: FormType) => {
        return userService.userForgot(post)
        .then((res) => {
          if (res.data.etat===false) {
            if(res.data.message !== "requette invalide"){
              toast.error(res.data.message);
            }
          } else {
            accountService.saveToken(res.data.id)
            // toast.success("Un mail vous a ete envoyer !");
            toast('Verifier votre email !', {
              icon: '👏',
            });
          }
      })
      },
    });
    
    const forgout = (post: FormType) => {
      connexion.mutate(post);
      console.log("forgot ..",post)
    };

    return {forgout}
}

export function useCreateAdminUser() {
    
    const useQ = useQueryClient();

    const ajoutAdmin = useMutation({
        mutationFn: (post: FormValueType) => {
          return userService.userAdminRegister(post)
          .then((res) => {
            if (res.data.etat===false) {
              if(res.data.message !== "requette invalide"){
                toast.error(res.data.message);
              }
            } else {
              useQ.invalidateQueries({ queryKey: ["UserGet"] });
              toast.success("Inscription réussie");
            }
        })
        },
      });
  
      const createAdmin = (post: FormValueType) => {
        ajoutAdmin.mutate(post);
      };

    return { createAdmin }
}

export function useCreateCabinetUser() {
    
    const useQ = useQueryClient();

    const ajoutAdmin = useMutation({
        mutationFn: (post: FormValueType) => {
          return userService.userCabinetRegister(post)
          .then((res) => {
            if (res.data.etat===false) {
              if(res.data.message !== "requette invalide"){
                toast.error(res.data.message);
              }
            } else {
              useQ.invalidateQueries({ queryKey: ["UserCabinetGet"] });
              toast.success("Inscription réussie");
            }
        })
        },
      });
  
      const createCabinetAdmin = (post: FormValueType) => {
        ajoutAdmin.mutate(post);
      };

    return { createCabinetAdmin }
}

// Pour les clients

export function useCreateClient() {
  
  const useQ = useQueryClient();
  
  const ajout = useMutation({
      mutationFn: (post: ClienType) => {
        
        return userService.userClient(post)
        .then((res) => {
          if (res.data.etat === false) {
            if (res.data.message === "L'utilisateur existe déjà") {
                toast.error("Cet utilisateur existe déjà. Veuillez vous connecter.");
            } else if (res.data.message !== "requette invalide") {
                toast.error(res.data.message);
            }
          } else {
            useQ.invalidateQueries({ queryKey: ["ClientGet"] });
            toast.success("Creation réussie");
    
          }
      })
      .catch((error) => {
        
        if (error.code === 'ECONNABORTED') {
            toast.error("La requête a pris trop de temps, veuillez réessayer.");
        } else {
            toast.error("Une erreur s'est produite lors de l'inscription");
        }
    });
      },
    });

    const createClient = (post: ClienType) => {
      ajout.mutate(post);
    };

    return { createClient }
}

export function useUnClient(slug: string) {
  
  const [unClient, setUnClient] = useState<FormClienType>({
    nom: '',
    adresse: '',
    numero: 0,
    email: '',
    user_id: '',
    entreprise_id: '',
    coordonne: '',
  });

  const { data: us, isLoading, isError } = useQuery({
    queryKey: ["ClientUn", slug],
    queryFn: () =>
      userService.userUnClient(slug).then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee as FormClienType;
        } else {
          throw new Error("Les identifiants sont incorrects");
        }
      }),
  });

  useEffect(() => {
    if (us) {
      setUnClient(us);
    }
  }, [us]);

  return { us ,unClient, setUnClient, isLoading, isError };
}

export function useUpdateClient() {
  const navigate = useNavigate();
  const useQ = useQueryClient();

  const modif = useMutation({
      mutationFn: (post: FormClienType) => {
        return userService
          .clientUpdate(post)
          .then((res) => {
            if (res.data.etat === true) {
              toast.success("Modification reuissi");
              useQ.invalidateQueries({ queryKey: ["ClientGet"] });
              navigate(-1);
            } else {
              toast.error("Nom trouver");
            }
          })
          .catch((err) => console.log(err));
      },
      onError: (error) => {
       foncError(error);
      },
    });
    const updateClient = (post: FormClienType) => {
      modif.mutate(post);

    };

    return {updateClient}
}

export function useDeleteClient() {
  const navigate = useNavigate();
  const useQ = useQueryClient();
  
  const del = useMutation({
    mutationFn: (post: FormClienType) => {
      return userService.clientDelete(post).then((res) => {
        
        if (res.data.etat !== true) {
          toast.error(res.data.message);
        } else {
          useQ.invalidateQueries({ queryKey: ["ClientGet"] });
          navigate(-1);
          toast.success("Supprimée avec succès");
        }
      });
    },
    onError: (error) => {
      foncError(error);
    },
  });

  const deleteClient = (post: FormClienType) => {
    del.mutate(post);
    // console.log("delete ..",post)
  };

  return {deleteClient}
}


export function useAllClients(slug: string) {
  const [getClients, setClients] = useState<ClienType[]>([]);

  const {data: us, isLoading, isError} = useQuery({
    queryKey: ["ClientGet", slug],
    queryFn: () =>
      userService.allClients(slug).then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          // toast.error("Les identifiants sont incorrects");
        }
      }),
  });

  useEffect(() => {
      if (us) {
        setClients(us);
      }
    }, [us]);

  return { getClients, setClients, isLoading, isError };
}

// Fonction Pour la entreprise
// ok ok ok ok ok ok ok ok ok

export function useFetchEntreprise(slug: string | null | undefined) {
  const [unEntreprise, setUnEntreprise] = useState<TypeEntreprise>({
    adresse: '',
    coordonne:'',
    email:'',
    id:'',
    image:'',
    licence_code:'',
    licence_date_expiration:'',
    licence_type:'',
    nom:'',
    numero:0,
    });

  const { data: us, isLoading, isError } = useQuery({
    queryKey: ["User", slug],
    queryFn: () =>
      entrepriseService.getEntreprise(slug as string).then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          // throw new Error("Les identifiants sont incorrects");
          toast.error(res.data.message);
        }
      }),
    // n'exécute pas la requête si slug est null/undefined/empty
    enabled: !!slug,
  });

  useEffect(() => {
    if (us) {
      setUnEntreprise(us);
    }
  }, [us]);

  return { unEntreprise, setUnEntreprise, isLoading, isError };
}

export function useHistoriqueEntreprise() {
  const [historique, setHistorique] = useState<EntrepriseType[]>([]);

  const { data: us, isLoading, isError } = useQuery({
    queryKey: ["History"],
    queryFn: () =>
      entrepriseService.historiqueEntreprise().then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          // throw new Error("Les identifiants sont incorrects");
          toast.error(res.data.message);
        }
      }),
  });

  useEffect(() => {
    if (us) {
      setHistorique(us);
    }
  }, [us]);

  return { historique, setHistorique, isLoading, isError };
}

export function useHistorySuppEntreprise(slug: string) {
  const [suppH, setSuppH] = useState<HistoriqueType[]>([]);

  const { data: us, isLoading, isError } = useQuery({
    queryKey: ["HistorySupp", slug],

    queryFn: () =>
      entrepriseService.historySuppEntreprise(slug).then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          // throw new Error("Les identifiants sont incorrects");
          toast.error(res.data.message);
        }
      }),
  });

  useEffect(() => {
    if (us) {
      setSuppH(us);
    }
  }, [us]);

  return { suppH, setSuppH, isLoading, isError };
}

export function useStockEntreprise(entreprise_id: string) {
  
  const [stockEntreprise, setStockEntreprise] = useState<StockType>({
    somme_entrer_pu: 0,
    somme_entrer_qte: 0,
    somme_sortie_pu: 0,
    somme_sortie_qte: 0,
    nombre_entrer: 0,
    nombre_sortie: 0,
    });

  const { data: us, isLoading, isError } = useQuery({
    queryKey: ["Stock", entreprise_id],
    queryFn: () =>
      entrepriseService.stockEntreprise(entreprise_id).then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          // throw new Error("Les identifiants sont incorrects");
          // toast.error(res.data.message);
        }
      }),
  });

  useEffect(() => {
    if (us) {
      setStockEntreprise(us);
    }
  }, [us]);

  return { stockEntreprise, setStockEntreprise, isLoading, isError };
}

export function useSortieUserEntreprise(entreprise_id: string) {
  
  const [sortiesUser, setSortiesUser] = useState<SortieUserType>({
    user_id: '',
    total_nombre_vente: [],
    total_par_utilisateur: [],
    mensuel_par_utilisateur: []
  });

  const { data: us, isLoading, isError } = useQuery({
    queryKey: ["SortiesUser", entreprise_id],
    queryFn: () =>
      entrepriseService.sortieUserEntreprise(entreprise_id).then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          // throw new Error("Les identifiants sont incorrects");
          // toast.error(res.data.message);
        }
      }),
  });

  useEffect(() => {
    if (us) {
      setSortiesUser(us);
    }
  }, [us]);

  return { sortiesUser, setSortiesUser, isLoading, isError };
}

export function useStockSemaine(entreprise_id: string) {
  
  const [stockSemaine, setStockSemaine] = useState<StockType>({
    somme_entrer_pu: 0,
    somme_entrer_qte: 0,
    somme_sortie_pu: 0,
    somme_sortie_qte: 0,
    nombre_entrer: 0,
    nombre_sortie: 0,
    });

  const { data: us, isLoading, isError } = useQuery({
    queryKey: ["StockSemaine", entreprise_id],
    queryFn: () =>
      entrepriseService.stockCateSemaine(entreprise_id).then((res) => {
        
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          // throw new Error("Les identifiants sont incorrects");
          // toast.error(res.data.message);
        }
      }),
  });

  useEffect(() => {
    if (us) {
      setStockSemaine(us);
    }
  }, [us]);

  return { stockSemaine, setStockSemaine, isLoading, isError };
}

export function useFetchAllEntreprise(slug: string) {
  const [entreprises, setEntreprise] = useState<RecupType[]>([]);

  const {data: us, isLoading, isError} = useQuery({
    queryKey: ["bouti", slug],
    queryFn: () =>
      entrepriseService.allEntreprise(slug).then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          // toast.error("Les identifiants sont incorrects");
          toast.error(res.data.message);
        }
      }),
  });

  useEffect(() => {
      if (us) {
          setEntreprise(us);
      }
    }, [us]);

  return { entreprises, setEntreprise, isLoading, isError };
}

export function useAllUserEntreprise(slug: string) {
  const [userEntreprises, setUserEntreprise] = useState<RecupType[]>([]);

  const {data: us, isLoading, isError} = useQuery({
    queryKey: ["bouti", slug],
    queryFn: () =>
      entrepriseService.allUserEntreprise(slug).then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          // toast.error("Les identifiants sont incorrects");
          toast.error(res.data.message);
        }
      }),
  });

  useEffect(() => {
      if (us) {
          setUserEntreprise(us);
      }
    }, [us]);

  return { userEntreprises, setUserEntreprise, isLoading, isError };
}

export function useCreateEntreprise() {
  
  const useQ = useQueryClient();
  
  const ajout = useMutation({
    mutationFn: (data: EntrepriseType) => {
      return entrepriseService.addEntreprise(data)
      .then((res) => {
        if (res.data.etat===false) {
          if(res.data.message !== "requette invalide"){
            toast.error(res.data.message);
          }
        } else {
          useQ.invalidateQueries({ queryKey: ["UserEntreprises"] });
          toast.success("Creation réussie");
          
        }
    })
    },
    onError: (error) => {
      foncError(error);
    },
  });

    const ajoutEntreprise = (post: EntrepriseType) => {
      ajout.mutate(post);
    };

    return { ajoutEntreprise }
}

export function useUpdateEntreprise() {
  
  const useQ = useQueryClient();

  const modif = useMutation({
    mutationFn: (data: TypeEntreprise) => {
      return entrepriseService
        .updateEntreprise(data)
        .then((res) => {
          if (res.data.etat === true) {
            toast.success("Modification reuissi");
            useQ.invalidateQueries({ queryKey: ["EntreModif"] });
            // navigate("/admin/formation/index")
            // navigate(-1);
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    },
    onError: (error) => {
      foncError(error);
    },
  });

  const updateEntreprise = (chap: TypeEntreprise) => {
    modif.mutate(chap);
  };

  return {updateEntreprise}
}

export function useRemoveUserEntreprise() {
  
  const useQ = useQueryClient();

  const modif = useMutation({
    mutationFn: (data: DataType) => {
      return entrepriseService
        .removeUserEntreprise(data)
        .then((res) => {
          if (res.data.etat === true) {
            toast.success("Modification reuissi");
            useQ.invalidateQueries({ queryKey: ["EntreModif"] });
            
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    },
    onError: (error) => {
      foncError(error);
    },
  });

  const removeEntreprise = (chap: DataType) => {
    modif.mutate(chap);
  };

  return {removeEntreprise}
}

export function useDeleteEntreprise() {
  
  const useQ = useQueryClient();
  
  const del = useMutation({
    mutationFn: (post: TypeEntreprise) => {
      return entrepriseService.deleteEntreprise(post).then((res) => {
        if (res.data.etat !== true) {
          toast.error(res.data.message);
        }
      });
    },
    onError: (error) => {
      foncError(error);
    },
    onSuccess: () => {
      useQ.invalidateQueries({ queryKey: ["EntreRecup"] });
      // navigate(-1);
      // toast.success("Supprimée avec succès");
    },
  });

  const deleteEntreprise = (post: TypeEntreprise) => {
    del.mutate(post);
    // console.log(post);
  };

  return {deleteEntreprise}
}

// Pour tous les utilisateurs d'un Entreprise 
export function useGetEntrepriseUsers(slug: string) {
  const [entrepriseUsers, setEntrepriseUsers] = useState<RecupType[]>([]);

  const {data: us, isLoading, isError} = useQuery({
    queryKey: ["entrepriseUsers", slug],
    queryFn: () =>
      entrepriseService.getEntrepriseUsers(slug).then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          // toast.error("Les identifiants sont incorrects");
          toast.error(res.data.message);
        }
      }),
  });

  useEffect(() => {
      if (us) {
          setEntrepriseUsers(us);
      }
    }, [us]);

  return { entrepriseUsers, setEntrepriseUsers, isLoading, isError };
}

// Pour tous les Entreprises d'un utilisateur 
export function useGetUserEntreprises() {
  const [userEntreprises, setUserEntreprises] = useState<TypeEntreprise[]>([]);
  
  const {data: us, isLoading, isError} = useQuery({
    queryKey: ["UserEntreprises"],
    queryFn: () =>
      entrepriseService.getUserEntreprises().then((res) => {
        if (res.data.etat === true) {
          return res.data.donnee;
        } else {
          // toast.error("Les identifiants sont incorrects");
          toast.error(res.data.message);
        }
      }),
  });

  useEffect(() => {
      if (us) {
        setUserEntreprises(us);
      }
    }, [us]);

  return { userEntreprises, setUserEntreprises, isLoading, isError };
}

