import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { DepenseType, DepenseSumType, RecupType } from "../typescript/DataType";
import { depenseService } from "../_services";
import { foncError } from "./fonctionPerso";
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

// Produit
export function useFetchDepense(slug: string) {
    const navigate = useNavigate();
    
    const [unDepense, setUnDepense] = useState<DepenseType>({
        libelle: '',
        user_id: '',
        somme: 0,
        date: '',
      });
  
    const { data: us, isLoading, isError, error } = useQuery({
      queryKey: ["entreDepense", slug],
      queryFn: () =>
        depenseService.getDepense(slug).then((res) => {
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
        setUnDepense(us);
      }
    }, [us]);
  
    return { unDepense, setUnDepense, isLoading, isError };
}
  
export function useFetchAllDepense(slug: string) {
    const navigate = useNavigate();
    
    const [entres, setDepense] = useState<RecupType[]>([]);

    const {data: us, isLoading, isError, error} = useQuery({
      queryKey: ["produit", slug],
      queryFn: () =>
        depenseService.allDepense(slug).then((res) => {
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
            setDepense(us);
        }
      }, [us]);

    return { entres, setDepense, isLoading, isError };
}

// Pour recuperertous les entrers d'une Entreprise
export function useGetAllDepense() {
    const navigate = useNavigate();
    
    const [depensesEntreprise, setDepense] = useState<DepenseType[]>([]);

    const {data: us, isLoading, isError, error} = useQuery({
      queryKey: ["depenses"],
      queryFn: () =>
        depenseService.getAllDepense().then((res) => {
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
            setDepense(us);
        }
      }, [us]);

    return { depensesEntreprise, setDepense, isLoading, isError };
}

export function useGetAllBudget(slug: string) {
    const navigate = useNavigate();
    
    const [budgetsEntreprise, setBudget] = useState<DepenseType[]>([]);

    const {data: us, isLoading, isError, error} = useQuery({
      queryKey: ["depenses", slug],
      queryFn: () =>
        depenseService.getAllBudget(slug).then((res) => {
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
            setBudget(us);
        }
      }, [us]);

    return { budgetsEntreprise, setBudget, isLoading, isError };
}

export function useGetSumDepense() {
  const navigate = useNavigate();
  
  const [depensesSum, setSum] = useState<DepenseSumType[]>([]);

  const {data: us, isLoading, isError, error} = useQuery({
    queryKey: ["depens"],
    queryFn: () =>
      depenseService.getSumDepense().then((res) => {
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
          setSum(us);
      }
    }, [us]);

  return { depensesSum, setSum, isLoading, isError };
}

export function useCreateDepense() {
    const navigate = useNavigate();
    const useQ = useQueryClient();
    
    const ajout = useMutation({
      mutationFn: (data: DepenseType) => {
        return depenseService.addDepense(data)
        .then((res) => {
          if (res.data.etat===false) {
            if(res.data.message !== "requette invalide"){
              toast.error(res.data.message);
            }
          } else {
            useQ.invalidateQueries({ queryKey: ["depenses"] });
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
  
    const ajoutDepense = (post: DepenseType) => {
      ajout.mutate(post);
    };

    return { ajoutDepense }
}

export function useUpdateDepense() {
    const navigate = useNavigate();
    const useQ = useQueryClient();

    const modif = useMutation({
      mutationFn: (data: DepenseType) => {
        return depenseService
          .updateDepense(data)
          .then((res) => {
            if (res.data.etat === true) {
              toast.success("Modification reuissi");
              useQ.invalidateQueries({ queryKey: ["depenses"] });
              navigate(-1);
            } else {
              toast.error(res.data.message);
            }
          })
          .catch((err) => console.log(err));
      },
      onError: (error) => {
        if (!handleAuthError(error, navigate)) {
          foncError(error);
        }
      },
    });

    const updateDepense = (chap: DepenseType) => {
      modif.mutate(chap);
    };

    return {updateDepense}
}

export function useDeleteDepense() {
    const navigate = useNavigate();
    const useQ = useQueryClient();
    
    const del = useMutation({
      mutationFn: (post: DepenseType) => {
        return depenseService.deleteDepense(post).then((res) => {
          if (res.data.etat !== true) {
            toast.error(res.data.message);
          }
        });
      },
      onError: (error: any) => {
        if (!handleAuthError(error, navigate)) {
          const message = error?.response?.data?.message || error.message || "Une erreur est survenue";
          toast.error(message);
        }
      },
      onSuccess: () => {
        useQ.invalidateQueries({ queryKey: ["depenses"] });
        navigate(-1);
        toast.success("Supprimée avec succès");
      },
    });

    const deleteDepense = (post: DepenseType) => {
      del.mutate(post);
    };

    return {deleteDepense}
}
