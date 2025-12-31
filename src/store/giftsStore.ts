import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import {
  Gift,
  GiftFormData,
  GiftFilters,
  GiftSortOptions,
  GiftStatus,
  GiftPriority,
  GiftCategory,
  GiftReaction,
  Currency,
  StatusHistory,
} from '@/types';

interface GiftsState {
  gifts: Gift[];
  isLoading: boolean;
  error: string | null;
  filters: GiftFilters;
  sortOptions: GiftSortOptions;
}

interface GiftsActions {
  // CRUD operations
  addGift: (data: GiftFormData) => Gift;
  updateGift: (id: string, data: Partial<GiftFormData>) => void;
  deleteGift: (id: string) => void;
  getGift: (id: string) => Gift | undefined;

  // Status management
  updateGiftStatus: (id: string, status: GiftStatus, notes?: string) => void;
  setHidingSpot: (id: string, hidingSpot: string) => void;
  markAsGiven: (id: string, dateGiven?: string, reaction?: GiftReaction) => void;
  setReaction: (id: string, reaction: GiftReaction) => void;

  // Filtering and sorting
  setFilters: (filters: GiftFilters) => void;
  setSortOptions: (options: GiftSortOptions) => void;
  clearFilters: () => void;

  // Computed getters
  getFilteredGifts: () => Gift[];
  getGiftsByPerson: (personId: string) => Gift[];
  getGiftsByOccasion: (occasionId: string) => Gift[];
  getGiftsByStatus: (status: GiftStatus) => Gift[];
  getGiftsHistory: (personId: string) => Gift[];
  getTotalSpentForPerson: (personId: string) => number;

  // State management
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Bulk operations
  importGifts: (gifts: Gift[]) => void;
  deleteGiftsForPerson: (personId: string) => void;
}

const initialState: GiftsState = {
  gifts: [],
  isLoading: false,
  error: null,
  filters: {},
  sortOptions: { field: 'createdAt', direction: 'desc' },
};

export const useGiftsStore = create<GiftsState & GiftsActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // CRUD operations
      addGift: (data: GiftFormData): Gift => {
        const now = new Date().toISOString();
        const initialStatusHistory: StatusHistory = {
          status: data.status,
          date: now,
        };

        const newGift: Gift = {
          id: uuidv4(),
          userId: '', // Will be set when user auth is implemented
          createdAt: now,
          updatedAt: now,
          personId: data.personId,
          name: data.name,
          description: data.description,
          url: data.url,
          price: data.price,
          currency: data.currency || Currency.USD,
          priority: data.priority,
          category: data.category,
          status: data.status,
          statusHistory: [initialStatusHistory],
          occasionId: data.occasionId,
          photos: data.photos,
          voiceNotes: data.voiceNotes,
          notes: data.notes,
          source: data.source,
          hidingSpot: data.hidingSpot,
          receiptUri: data.receiptUri,
          returnDeadline: data.returnDeadline,
          isRegift: data.isRegift,
        };

        set((state) => ({
          gifts: [...state.gifts, newGift],
        }));

        return newGift;
      },

      updateGift: (id: string, data: Partial<GiftFormData>): void => {
        set((state) => ({
          gifts: state.gifts.map((gift) =>
            gift.id === id
              ? {
                  ...gift,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : gift
          ),
        }));
      },

      deleteGift: (id: string): void => {
        set((state) => ({
          gifts: state.gifts.filter((gift) => gift.id !== id),
        }));
      },

      getGift: (id: string): Gift | undefined => {
        return get().gifts.find((gift) => gift.id === id);
      },

      // Status management
      updateGiftStatus: (id: string, status: GiftStatus, notes?: string): void => {
        const now = new Date().toISOString();
        const newStatusEntry: StatusHistory = {
          status,
          date: now,
          notes,
        };

        set((state) => ({
          gifts: state.gifts.map((gift) =>
            gift.id === id
              ? {
                  ...gift,
                  status,
                  statusHistory: [...gift.statusHistory, newStatusEntry],
                  updatedAt: now,
                  // Clear hiding spot if status is no longer HIDDEN
                  hidingSpot: status === GiftStatus.HIDDEN ? gift.hidingSpot : undefined,
                }
              : gift
          ),
        }));
      },

      setHidingSpot: (id: string, hidingSpot: string): void => {
        set((state) => ({
          gifts: state.gifts.map((gift) =>
            gift.id === id
              ? {
                  ...gift,
                  hidingSpot,
                  updatedAt: new Date().toISOString(),
                }
              : gift
          ),
        }));
      },

      markAsGiven: (id: string, dateGiven?: string, reaction?: GiftReaction): void => {
        const now = new Date().toISOString();
        const givenDate = dateGiven || now;

        set((state) => ({
          gifts: state.gifts.map((gift) =>
            gift.id === id
              ? {
                  ...gift,
                  status: GiftStatus.GIVEN,
                  statusHistory: [
                    ...gift.statusHistory,
                    { status: GiftStatus.GIVEN, date: now },
                  ],
                  dateGiven: givenDate,
                  reaction,
                  updatedAt: now,
                }
              : gift
          ),
        }));
      },

      setReaction: (id: string, reaction: GiftReaction): void => {
        set((state) => ({
          gifts: state.gifts.map((gift) =>
            gift.id === id
              ? {
                  ...gift,
                  reaction,
                  updatedAt: new Date().toISOString(),
                }
              : gift
          ),
        }));
      },

      // Filtering and sorting
      setFilters: (filters: GiftFilters): void => {
        set({ filters });
      },

      setSortOptions: (sortOptions: GiftSortOptions): void => {
        set({ sortOptions });
      },

      clearFilters: (): void => {
        set({ filters: {} });
      },

      getFilteredGifts: (): Gift[] => {
        const { gifts, filters, sortOptions } = get();
        let filtered = [...gifts];

        // Apply status filter
        if (filters.status && filters.status.length > 0) {
          filtered = filtered.filter((gift) => filters.status!.includes(gift.status));
        }

        // Apply priority filter
        if (filters.priority && filters.priority.length > 0) {
          filtered = filtered.filter((gift) => filters.priority!.includes(gift.priority));
        }

        // Apply category filter
        if (filters.category && filters.category.length > 0) {
          filtered = filtered.filter((gift) => filters.category!.includes(gift.category));
        }

        // Apply price range filter
        if (filters.priceMin !== undefined) {
          filtered = filtered.filter(
            (gift) => gift.price !== undefined && gift.price >= filters.priceMin!
          );
        }
        if (filters.priceMax !== undefined) {
          filtered = filtered.filter(
            (gift) => gift.price !== undefined && gift.price <= filters.priceMax!
          );
        }

        // Apply search query filter
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (gift) =>
              gift.name.toLowerCase().includes(query) ||
              gift.description?.toLowerCase().includes(query) ||
              gift.notes.toLowerCase().includes(query)
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let comparison = 0;

          switch (sortOptions.field) {
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
            case 'price':
              comparison = (a.price || 0) - (b.price || 0);
              break;
            case 'priority': {
              const priorityOrder = {
                [GiftPriority.MUST_HAVE]: 4,
                [GiftPriority.HIGH]: 3,
                [GiftPriority.MEDIUM]: 2,
                [GiftPriority.LOW]: 1,
              };
              comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
              break;
            }
            case 'createdAt':
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              break;
            case 'status': {
              const statusOrder = {
                [GiftStatus.IDEA]: 1,
                [GiftStatus.PURCHASED]: 2,
                [GiftStatus.WRAPPED]: 3,
                [GiftStatus.HIDDEN]: 4,
                [GiftStatus.GIVEN]: 5,
                [GiftStatus.RETURNED]: 6,
              };
              comparison = statusOrder[a.status] - statusOrder[b.status];
              break;
            }
          }

          return sortOptions.direction === 'asc' ? comparison : -comparison;
        });

        return filtered;
      },

      getGiftsByPerson: (personId: string): Gift[] => {
        return get().gifts.filter(
          (gift) => gift.personId === personId && gift.status !== GiftStatus.GIVEN
        );
      },

      getGiftsByOccasion: (occasionId: string): Gift[] => {
        return get().gifts.filter((gift) => gift.occasionId === occasionId);
      },

      getGiftsByStatus: (status: GiftStatus): Gift[] => {
        return get().gifts.filter((gift) => gift.status === status);
      },

      getGiftsHistory: (personId: string): Gift[] => {
        return get().gifts.filter(
          (gift) => gift.personId === personId && gift.status === GiftStatus.GIVEN
        );
      },

      getTotalSpentForPerson: (personId: string): number => {
        return get()
          .gifts.filter(
            (gift) =>
              gift.personId === personId &&
              gift.status !== GiftStatus.IDEA &&
              gift.status !== GiftStatus.RETURNED
          )
          .reduce((total, gift) => total + (gift.price || 0), 0);
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
      importGifts: (gifts: Gift[]): void => {
        set((state) => ({
          gifts: [...state.gifts, ...gifts],
        }));
      },

      deleteGiftsForPerson: (personId: string): void => {
        set((state) => ({
          gifts: state.gifts.filter((gift) => gift.personId !== personId),
        }));
      },
    }),
    {
      name: 'gift-tracker-gifts',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        gifts: state.gifts,
        sortOptions: state.sortOptions,
      }),
    }
  )
);

// Selectors
export const selectAllGifts = (state: GiftsState & GiftsActions) => state.gifts;
export const selectGiftsCount = (state: GiftsState & GiftsActions) => state.gifts.length;
export const selectIsLoading = (state: GiftsState & GiftsActions) => state.isLoading;
export const selectError = (state: GiftsState & GiftsActions) => state.error;
