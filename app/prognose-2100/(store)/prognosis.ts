import { create } from 'zustand';

type Store = {
  showPrognosis: boolean;
  toggle: () => void;
};

export const usePrognosis = create<Store>((set) => ({
  showPrognosis: false,
  toggle: () => {
    set((state) => ({ showPrognosis: !state.showPrognosis }));
  }
}));

export const usePrognosisStore = () => usePrognosis((state) => state);
