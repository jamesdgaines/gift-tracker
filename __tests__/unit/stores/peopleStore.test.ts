import { act, renderHook } from '@testing-library/react-native';
import { usePeopleStore } from '@/store/peopleStore';
import { RelationshipCategory, Currency, PersonFormData } from '@/types';

// Helper to reset store between tests
const resetStore = () => {
  usePeopleStore.getState().reset();
};

describe('peopleStore', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('addPerson', () => {
    it('should add a new person with required fields', () => {
      const { result } = renderHook(() => usePeopleStore());

      const personData: PersonFormData = {
        name: 'John Doe',
        relationship: RelationshipCategory.FRIEND,
        dates: [],
        notes: '',
        sizes: {},
        interests: [],
        allergies: [],
        budgetCurrency: Currency.USD,
      };

      let newPerson: ReturnType<typeof result.current.addPerson>;

      act(() => {
        newPerson = result.current.addPerson(personData);
      });

      expect(result.current.people).toHaveLength(1);
      expect(result.current.people[0].name).toBe('John Doe');
      expect(result.current.people[0].relationship).toBe(RelationshipCategory.FRIEND);
      expect(newPerson!.id).toBeDefined();
      expect(newPerson!.createdAt).toBeDefined();
    });

    it('should add a person with all optional fields', () => {
      const { result } = renderHook(() => usePeopleStore());

      const personData: PersonFormData = {
        name: 'Jane Smith',
        photoUri: 'file://photo.jpg',
        relationship: RelationshipCategory.FAMILY,
        dates: [{ id: '1', label: 'Birthday', date: '1990-05-15', isRecurring: true }],
        notes: 'Loves coffee',
        sizes: { shirt: 'M', pants: '32', shoe: '10' },
        interests: ['reading', 'hiking'],
        allergies: ['peanuts'],
        budgetAmount: 100,
        budgetCurrency: Currency.USD,
      };

      act(() => {
        result.current.addPerson(personData);
      });

      expect(result.current.people[0].photoUri).toBe('file://photo.jpg');
      expect(result.current.people[0].sizes.shirt).toBe('M');
      expect(result.current.people[0].interests).toContain('reading');
      expect(result.current.people[0].budgetAmount).toBe(100);
    });
  });

  describe('updatePerson', () => {
    it('should update an existing person', () => {
      const { result } = renderHook(() => usePeopleStore());

      let person: ReturnType<typeof result.current.addPerson>;

      act(() => {
        person = result.current.addPerson({
          name: 'Original Name',
          relationship: RelationshipCategory.FRIEND,
          dates: [],
          notes: '',
          sizes: {},
          interests: [],
          allergies: [],
          budgetCurrency: Currency.USD,
        });
      });

      act(() => {
        result.current.updatePerson(person!.id, { name: 'Updated Name' });
      });

      expect(result.current.people[0].name).toBe('Updated Name');
      expect(result.current.people[0].updatedAt).not.toBe(person!.createdAt);
    });

    it('should not update non-existent person', () => {
      const { result } = renderHook(() => usePeopleStore());

      act(() => {
        result.current.updatePerson('non-existent-id', { name: 'New Name' });
      });

      expect(result.current.people).toHaveLength(0);
    });
  });

  describe('deletePerson', () => {
    it('should delete a person', () => {
      const { result } = renderHook(() => usePeopleStore());

      let person: ReturnType<typeof result.current.addPerson>;

      act(() => {
        person = result.current.addPerson({
          name: 'To Delete',
          relationship: RelationshipCategory.FRIEND,
          dates: [],
          notes: '',
          sizes: {},
          interests: [],
          allergies: [],
          budgetCurrency: Currency.USD,
        });
      });

      expect(result.current.people).toHaveLength(1);

      act(() => {
        result.current.deletePerson(person!.id);
      });

      expect(result.current.people).toHaveLength(0);
    });
  });

  describe('getPerson', () => {
    it('should get a person by id', () => {
      const { result } = renderHook(() => usePeopleStore());

      let person: ReturnType<typeof result.current.addPerson>;

      act(() => {
        person = result.current.addPerson({
          name: 'Test Person',
          relationship: RelationshipCategory.FAMILY,
          dates: [],
          notes: '',
          sizes: {},
          interests: [],
          allergies: [],
          budgetCurrency: Currency.USD,
        });
      });

      const found = result.current.getPerson(person!.id);
      expect(found).toBeDefined();
      expect(found?.name).toBe('Test Person');
    });

    it('should return undefined for non-existent id', () => {
      const { result } = renderHook(() => usePeopleStore());

      const found = result.current.getPerson('non-existent');
      expect(found).toBeUndefined();
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      const { result } = renderHook(() => usePeopleStore());

      act(() => {
        result.current.addPerson({
          name: 'Alice',
          relationship: RelationshipCategory.FAMILY,
          dates: [],
          notes: 'Sister',
          sizes: {},
          interests: [],
          allergies: [],
          budgetCurrency: Currency.USD,
        });
        result.current.addPerson({
          name: 'Bob',
          relationship: RelationshipCategory.FRIEND,
          dates: [],
          notes: 'College buddy',
          sizes: {},
          interests: [],
          allergies: [],
          budgetCurrency: Currency.USD,
        });
        result.current.addPerson({
          name: 'Charlie',
          relationship: RelationshipCategory.COWORKER,
          dates: [],
          notes: '',
          sizes: {},
          interests: [],
          allergies: [],
          budgetCurrency: Currency.USD,
        });
      });
    });

    it('should filter by relationship', () => {
      const { result } = renderHook(() => usePeopleStore());

      act(() => {
        result.current.setFilters({ relationship: [RelationshipCategory.FAMILY] });
      });

      const filtered = result.current.getFilteredPeople();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Alice');
    });

    it('should filter by search query', () => {
      const { result } = renderHook(() => usePeopleStore());

      act(() => {
        result.current.setFilters({ searchQuery: 'bob' });
      });

      const filtered = result.current.getFilteredPeople();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Bob');
    });

    it('should search in notes', () => {
      const { result } = renderHook(() => usePeopleStore());

      act(() => {
        result.current.setFilters({ searchQuery: 'college' });
      });

      const filtered = result.current.getFilteredPeople();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Bob');
    });

    it('should clear filters', () => {
      const { result } = renderHook(() => usePeopleStore());

      act(() => {
        result.current.setFilters({ relationship: [RelationshipCategory.FAMILY] });
      });

      expect(result.current.getFilteredPeople()).toHaveLength(1);

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.getFilteredPeople()).toHaveLength(3);
    });
  });

  describe('sorting', () => {
    beforeEach(() => {
      const { result } = renderHook(() => usePeopleStore());

      act(() => {
        result.current.addPerson({
          name: 'Zack',
          relationship: RelationshipCategory.FRIEND,
          dates: [],
          notes: '',
          sizes: {},
          interests: [],
          allergies: [],
          budgetCurrency: Currency.USD,
        });
        result.current.addPerson({
          name: 'Alice',
          relationship: RelationshipCategory.FAMILY,
          dates: [],
          notes: '',
          sizes: {},
          interests: [],
          allergies: [],
          budgetCurrency: Currency.USD,
        });
        result.current.addPerson({
          name: 'Mike',
          relationship: RelationshipCategory.COWORKER,
          dates: [],
          notes: '',
          sizes: {},
          interests: [],
          allergies: [],
          budgetCurrency: Currency.USD,
        });
      });
    });

    it('should sort by name ascending', () => {
      const { result } = renderHook(() => usePeopleStore());

      act(() => {
        result.current.setSortOptions({ field: 'name', direction: 'asc' });
      });

      const sorted = result.current.getFilteredPeople();
      expect(sorted[0].name).toBe('Alice');
      expect(sorted[1].name).toBe('Mike');
      expect(sorted[2].name).toBe('Zack');
    });

    it('should sort by name descending', () => {
      const { result } = renderHook(() => usePeopleStore());

      act(() => {
        result.current.setSortOptions({ field: 'name', direction: 'desc' });
      });

      const sorted = result.current.getFilteredPeople();
      expect(sorted[0].name).toBe('Zack');
      expect(sorted[2].name).toBe('Alice');
    });
  });

  describe('getPeopleByRelationship', () => {
    it('should return people filtered by relationship', () => {
      const { result } = renderHook(() => usePeopleStore());

      act(() => {
        result.current.addPerson({
          name: 'Family Member 1',
          relationship: RelationshipCategory.FAMILY,
          dates: [],
          notes: '',
          sizes: {},
          interests: [],
          allergies: [],
          budgetCurrency: Currency.USD,
        });
        result.current.addPerson({
          name: 'Family Member 2',
          relationship: RelationshipCategory.FAMILY,
          dates: [],
          notes: '',
          sizes: {},
          interests: [],
          allergies: [],
          budgetCurrency: Currency.USD,
        });
        result.current.addPerson({
          name: 'Friend',
          relationship: RelationshipCategory.FRIEND,
          dates: [],
          notes: '',
          sizes: {},
          interests: [],
          allergies: [],
          budgetCurrency: Currency.USD,
        });
      });

      const familyMembers = result.current.getPeopleByRelationship(RelationshipCategory.FAMILY);
      expect(familyMembers).toHaveLength(2);
    });
  });

  describe('reset', () => {
    it('should reset store to initial state', () => {
      const { result } = renderHook(() => usePeopleStore());

      act(() => {
        result.current.addPerson({
          name: 'Test',
          relationship: RelationshipCategory.FRIEND,
          dates: [],
          notes: '',
          sizes: {},
          interests: [],
          allergies: [],
          budgetCurrency: Currency.USD,
        });
        result.current.setFilters({ searchQuery: 'test' });
      });

      expect(result.current.people).toHaveLength(1);

      act(() => {
        result.current.reset();
      });

      expect(result.current.people).toHaveLength(0);
      expect(result.current.filters).toEqual({});
    });
  });
});
