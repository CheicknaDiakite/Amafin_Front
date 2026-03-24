import { create } from "zustand";

type InitialState ={
    selectedIds: Set<number>,
    sorties: any[];
    categories: any[];
    souscategories: any[];
}

type Actions = {
    toggleId: (id: number) => void,
    reset: () => void,
    setSorties: (sorties: any[]) => void;    
    setCategories: (categories: any[]) => void;
    setSousCategories: (souscategories: any[]) => void;
    
}

const initialState: InitialState = {
    selectedIds: new Set(),
    sorties: [],
    categories: [],
    souscategories: [],
}

export const useStoreCart = create<InitialState & Actions>((set) => ({
    ...initialState,
    
    setSorties: (sorties) => set({ sorties }),
    setCategories: (categories) => set({ categories }),
    setSousCategories: (souscategories) => set({ souscategories }),
    
    toggleId(id) {
        set((state) => {
            const isAlreadySelecting = state.selectedIds.has(id);
            const newIds = new Set(state.selectedIds);

            if (isAlreadySelecting) {
                newIds.delete(id);
                return { selectedIds: newIds };
            }
            newIds.add(id);
            return { selectedIds: newIds };
        })
    },
    
    reset() {
        set(() => ({ ...initialState }));
    },
}))