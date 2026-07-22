import { create } from 'zustand';
import { UnitSystem } from '../core/units';

interface AppState {
  unitSystem: UnitSystem;
  setUnitSystem: (unit: UnitSystem) => void;
  toggleUnitSystem: () => void;

  favorites: string[]; // Calculator IDs
  toggleFavorite: (calculatorId: string) => void;
  isFavorite: (calculatorId: string) => boolean;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  isPro: boolean;
  setProStatus: (status: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  unitSystem: 'US',
  setUnitSystem: (unitSystem) => set({ unitSystem }),
  toggleUnitSystem: () =>
    set((state) => ({
      unitSystem: state.unitSystem === 'US' ? 'Metric (SI)' : 'US',
    })),

  favorites: ['map', 'gcs', 'qsofa', 'meld'],
  toggleFavorite: (id) =>
    set((state) => {
      const exists = state.favorites.includes(id);
      return {
        favorites: exists
          ? state.favorites.filter((fav) => fav !== id)
          : [...state.favorites, id],
      };
    }),
  isFavorite: (id) => get().favorites.includes(id),

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  selectedCategory: 'All',
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

  isPro: false,
  setProStatus: (isPro) => set({ isPro }),
}));
