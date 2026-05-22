import { create } from 'zustand';

type PrognosisStore = {
  showPrognosis: boolean;
  togglePrognosis: () => void;
};

export const usePrognosisStore = create<PrognosisStore>((set) => ({
  showPrognosis: false,
  togglePrognosis: () => set((state) => ({ showPrognosis: !state.showPrognosis })),
}));
