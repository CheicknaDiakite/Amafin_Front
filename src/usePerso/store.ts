import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import { Account } from "../typescript/Account";

export const useAccountStore = create(
    persist(
        combine(
            {
                account: undefined as undefined | null | Account,
            },
            (set) => ({
                setAccount: (account: Account | null) => set({account}),
            })
        ),
        {name: 'account'}
    )
);

type State = {
    selectedId: string | null; // ID sélectionné
    addId: (id: string) => void; // Fonction pour mettre à jour l'ID
  };
  
  export const useStoreUuid = create(
    persist<State>(
      (set) => ({
        selectedId: null,
        addId: (id) => set({ selectedId: id }), // Met à jour uniquement selectedId
      }),
      {
        name: "entreprise-uuid", // Clé utilisée dans le stockage local
        // partialize: (state) => ({ selectedId: state.selectedId }), // Persiste uniquement selectedId
      }
    )
  );