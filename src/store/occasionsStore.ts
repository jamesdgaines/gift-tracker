import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Occasion, OccasionFormData, OccasionType, Currency } from '@/types';

interface OccasionsState {
  occasions: Occasion[];
  isLoading: boolean;
  error: string | null;
}

interface OccasionsActions {
  // CRUD operations
  addOccasion: (data: OccasionFormData) => Occasion;
  updateOccasion: (id: string, data: Partial<OccasionFormData>) => void;
  deleteOccasion: (id: string) => void;
  getOccasion: (id: string) => Occasion | undefined;

  // Queries
  getOccasionsByPerson: (personId: string) => Occasion[];
  getUpcomingOccasions: (days?: number) => Occasion[];
  getPastOccasions: () => Occasion[];
  getOccasionsByType: (type: OccasionType) => Occasion[];
  getNextOccasionForPerson: (personId: string) => Occasion | undefined;

  // State management
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Bulk operations
  importOccasions: (occasions: Occasion[]) => void;
  deleteOccasionsForPerson: (personId: string) => void;
}

const initialState: OccasionsState = {
  occasions: [],
  isLoading: false,
  error: null,
};

/**
 * Get the next occurrence of a recurring date
 */
const getNextOccurrence = (dateStr: string, isRecurring: boolean): Date => {
  const date = new Date(dateStr);
  const now = new Date();

  if (!isRecurring) {
    return date;
  }

  // For recurring events, find the next occurrence
  const thisYear = now.getFullYear();
  const eventMonth = date.getMonth();
  const eventDay = date.getDate();

  // Create date for this year
  let nextDate = new Date(thisYear, eventMonth, eventDay);

  // If the date has passed this year, move to next year
  if (nextDate < now) {
    nextDate = new Date(thisYear + 1, eventMonth, eventDay);
  }

  return nextDate;
};

/**
 * Calculate days until an occasion
 */
const getDaysUntil = (dateStr: string, isRecurring: boolean): number => {
  const nextDate = getNextOccurrence(dateStr, isRecurring);
  const now = new Date();
  const diffTime = nextDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const useOccasionsStore = create<OccasionsState & OccasionsActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // CRUD operations
      addOccasion: (data: OccasionFormData): Occasion => {
        const now = new Date().toISOString();

        const newOccasion: Occasion = {
          id: uuidv4(),
          userId: '', // Will be set when user auth is implemented
          createdAt: now,
          updatedAt: now,
          personId: data.personId,
          name: data.name,
          type: data.type,
          date: data.date,
          isRecurring: data.isRecurring,
          reminderDays: data.reminderDays,
          budgetAmount: data.budgetAmount,
          budgetCurrency: data.budgetCurrency || Currency.USD,
          notes: data.notes,
        };

        set((state) => ({
          occasions: [...state.occasions, newOccasion],
        }));

        return newOccasion;
      },

      updateOccasion: (id: string, data: Partial<OccasionFormData>): void => {
        set((state) => ({
          occasions: state.occasions.map((occasion) =>
            occasion.id === id
              ? {
                  ...occasion,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : occasion
          ),
        }));
      },

      deleteOccasion: (id: string): void => {
        set((state) => ({
          occasions: state.occasions.filter((occasion) => occasion.id !== id),
        }));
      },

      getOccasion: (id: string): Occasion | undefined => {
        return get().occasions.find((occasion) => occasion.id === id);
      },

      // Queries
      getOccasionsByPerson: (personId: string): Occasion[] => {
        return get()
          .occasions.filter((occasion) => occasion.personId === personId)
          .sort((a, b) => {
            const daysA = getDaysUntil(a.date, a.isRecurring);
            const daysB = getDaysUntil(b.date, b.isRecurring);
            return daysA - daysB;
          });
      },

      getUpcomingOccasions: (days = 30): Occasion[] => {
        return get()
          .occasions.filter((occasion) => {
            const daysUntil = getDaysUntil(occasion.date, occasion.isRecurring);
            return daysUntil >= 0 && daysUntil <= days;
          })
          .sort((a, b) => {
            const daysA = getDaysUntil(a.date, a.isRecurring);
            const daysB = getDaysUntil(b.date, b.isRecurring);
            return daysA - daysB;
          });
      },

      getPastOccasions: (): Occasion[] => {
        return get()
          .occasions.filter((occasion) => {
            if (occasion.isRecurring) return false;
            const daysUntil = getDaysUntil(occasion.date, occasion.isRecurring);
            return daysUntil < 0;
          })
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getOccasionsByType: (type: OccasionType): Occasion[] => {
        return get().occasions.filter((occasion) => occasion.type === type);
      },

      getNextOccasionForPerson: (personId: string): Occasion | undefined => {
        const personOccasions = get().getOccasionsByPerson(personId);
        return personOccasions.length > 0 ? personOccasions[0] : undefined;
      },

      // State management
      setLoading: (isLoading: boolean): void => {
        set({ isLoading });
      },

      setError: (error: string | null): void => {
        set({ error });
      },

      reset: (): void => {
        set(initialState);
      },

      // Bulk operations
      importOccasions: (occasions: Occasion[]): void => {
        set((state) => ({
          occasions: [...state.occasions, ...occasions],
        }));
      },

      deleteOccasionsForPerson: (personId: string): void => {
        set((state) => ({
          occasions: state.occasions.filter((occasion) => occasion.personId !== personId),
        }));
      },
    }),
    {
      name: 'gift-tracker-occasions',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        occasions: state.occasions,
      }),
    }
  )
);

// Utility functions exported for use elsewhere
export { getNextOccurrence, getDaysUntil };

// Selectors
export const selectAllOccasions = (state: OccasionsState & OccasionsActions) => state.occasions;
export const selectOccasionsCount = (state: OccasionsState & OccasionsActions) =>
  state.occasions.length;
export const selectIsLoading = (state: OccasionsState & OccasionsActions) => state.isLoading;
export const selectError = (state: OccasionsState & OccasionsActions) => state.error;
