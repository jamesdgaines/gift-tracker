import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import {
  Person,
  PersonFormData,
  PeopleFilters,
  PeopleSortOptions,
  RelationshipCategory,
  Currency,
} from '@/types';

interface PeopleState {
  people: Person[];
  isLoading: boolean;
  error: string | null;
  filters: PeopleFilters;
  sortOptions: PeopleSortOptions;
}

interface PeopleActions {
  // CRUD operations
  addPerson: (data: PersonFormData) => Person;
  updatePerson: (id: string, data: Partial<PersonFormData>) => void;
  deletePerson: (id: string) => void;
  getPerson: (id: string) => Person | undefined;

  // Filtering and sorting
  setFilters: (filters: PeopleFilters) => void;
  setSortOptions: (options: PeopleSortOptions) => void;
  clearFilters: () => void;

  // Computed getters
  getFilteredPeople: () => Person[];
  getPeopleByRelationship: (relationship: RelationshipCategory) => Person[];

  // State management
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Bulk operations
  importPeople: (people: Person[]) => void;
}

const initialState: PeopleState = {
  people: [],
  isLoading: false,
  error: null,
  filters: {},
  sortOptions: { field: 'name', direction: 'asc' },
};

export const usePeopleStore = create<PeopleState & PeopleActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // CRUD operations
      addPerson: (data: PersonFormData): Person => {
        const now = new Date().toISOString();
        const newPerson: Person = {
          id: uuidv4(),
          userId: '', // Will be set when user auth is implemented
          createdAt: now,
          updatedAt: now,
          name: data.name,
          photoUri: data.photoUri,
          relationship: data.relationship,
          customRelationship: data.customRelationship,
          dates: data.dates,
          notes: data.notes,
          sizes: data.sizes,
          interests: data.interests,
          allergies: data.allergies,
          budgetAmount: data.budgetAmount,
          budgetCurrency: data.budgetCurrency || Currency.USD,
        };

        set((state) => ({
          people: [...state.people, newPerson],
        }));

        return newPerson;
      },

      updatePerson: (id: string, data: Partial<PersonFormData>): void => {
        set((state) => ({
          people: state.people.map((person) =>
            person.id === id
              ? {
                  ...person,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : person
          ),
        }));
      },

      deletePerson: (id: string): void => {
        set((state) => ({
          people: state.people.filter((person) => person.id !== id),
        }));
      },

      getPerson: (id: string): Person | undefined => {
        return get().people.find((person) => person.id === id);
      },

      // Filtering and sorting
      setFilters: (filters: PeopleFilters): void => {
        set({ filters });
      },

      setSortOptions: (sortOptions: PeopleSortOptions): void => {
        set({ sortOptions });
      },

      clearFilters: (): void => {
        set({ filters: {} });
      },

      getFilteredPeople: (): Person[] => {
        const { people, filters, sortOptions } = get();
        let filtered = [...people];

        // Apply relationship filter
        if (filters.relationship && filters.relationship.length > 0) {
          filtered = filtered.filter((person) =>
            filters.relationship!.includes(person.relationship)
          );
        }

        // Apply search query filter
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (person) =>
              person.name.toLowerCase().includes(query) ||
              person.notes.toLowerCase().includes(query)
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let comparison = 0;

          switch (sortOptions.field) {
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
            case 'createdAt':
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              break;
            case 'nextOccasion':
              // TODO: Implement next occasion sorting when occasions are integrated
              comparison = a.name.localeCompare(b.name);
              break;
          }

          return sortOptions.direction === 'asc' ? comparison : -comparison;
        });

        return filtered;
      },

      getPeopleByRelationship: (relationship: RelationshipCategory): Person[] => {
        return get().people.filter((person) => person.relationship === relationship);
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
      importPeople: (people: Person[]): void => {
        set((state) => ({
          people: [...state.people, ...people],
        }));
      },
    }),
    {
      name: 'gift-tracker-people',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        people: state.people,
        sortOptions: state.sortOptions,
      }),
    }
  )
);

// Selectors for common use cases
export const selectAllPeople = (state: PeopleState & PeopleActions) => state.people;
export const selectPeopleCount = (state: PeopleState & PeopleActions) => state.people.length;
export const selectIsLoading = (state: PeopleState & PeopleActions) => state.isLoading;
export const selectError = (state: PeopleState & PeopleActions) => state.error;
