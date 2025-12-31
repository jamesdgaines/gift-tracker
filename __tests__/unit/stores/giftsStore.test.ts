import { act, renderHook } from '@testing-library/react-native';
import { useGiftsStore } from '@/store/giftsStore';
import {
  GiftStatus,
  GiftPriority,
  GiftCategory,
  GiftSource,
  GiftReaction,
  Currency,
  GiftFormData,
} from '@/types';

// Helper to reset store between tests
const resetStore = () => {
  useGiftsStore.getState().reset();
};

const createMockGiftData = (overrides: Partial<GiftFormData> = {}): GiftFormData => ({
  personId: 'person-1',
  name: 'Test Gift',
  currency: Currency.USD,
  priority: GiftPriority.MEDIUM,
  category: GiftCategory.OTHER,
  status: GiftStatus.IDEA,
  photos: [],
  voiceNotes: [],
  notes: '',
  source: GiftSource.OTHER,
  isRegift: false,
  ...overrides,
});

describe('giftsStore', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('addGift', () => {
    it('should add a new gift with required fields', () => {
      const { result } = renderHook(() => useGiftsStore());

      const giftData = createMockGiftData({ name: 'Birthday Present' });

      act(() => {
        result.current.addGift(giftData);
      });

      expect(result.current.gifts).toHaveLength(1);
      expect(result.current.gifts[0].name).toBe('Birthday Present');
      expect(result.current.gifts[0].status).toBe(GiftStatus.IDEA);
      expect(result.current.gifts[0].statusHistory).toHaveLength(1);
    });

    it('should add a gift with all optional fields', () => {
      const { result } = renderHook(() => useGiftsStore());

      const giftData = createMockGiftData({
        name: 'Fancy Watch',
        description: 'A nice watch for the collection',
        url: 'https://example.com/watch',
        price: 250,
        priority: GiftPriority.HIGH,
        category: GiftCategory.JEWELRY,
        occasionId: 'occasion-1',
        hidingSpot: 'Closet shelf',
        status: GiftStatus.HIDDEN,
      });

      act(() => {
        result.current.addGift(giftData);
      });

      expect(result.current.gifts[0].description).toBe('A nice watch for the collection');
      expect(result.current.gifts[0].price).toBe(250);
      expect(result.current.gifts[0].url).toBe('https://example.com/watch');
    });
  });

  describe('updateGift', () => {
    it('should update an existing gift', () => {
      const { result } = renderHook(() => useGiftsStore());

      let gift: ReturnType<typeof result.current.addGift>;

      act(() => {
        gift = result.current.addGift(createMockGiftData());
      });

      act(() => {
        result.current.updateGift(gift.id, { name: 'Updated Gift Name', price: 100 });
      });

      expect(result.current.gifts[0].name).toBe('Updated Gift Name');
      expect(result.current.gifts[0].price).toBe(100);
    });
  });

  describe('deleteGift', () => {
    it('should delete a gift', () => {
      const { result } = renderHook(() => useGiftsStore());

      let gift: ReturnType<typeof result.current.addGift>;

      act(() => {
        gift = result.current.addGift(createMockGiftData());
      });

      expect(result.current.gifts).toHaveLength(1);

      act(() => {
        result.current.deleteGift(gift.id);
      });

      expect(result.current.gifts).toHaveLength(0);
    });
  });

  describe('updateGiftStatus', () => {
    it('should update gift status and add to history', () => {
      const { result } = renderHook(() => useGiftsStore());

      let gift: ReturnType<typeof result.current.addGift>;

      act(() => {
        gift = result.current.addGift(createMockGiftData({ status: GiftStatus.IDEA }));
      });

      expect(result.current.gifts[0].statusHistory).toHaveLength(1);

      act(() => {
        result.current.updateGiftStatus(gift.id, GiftStatus.PURCHASED, 'Bought on sale!');
      });

      expect(result.current.gifts[0].status).toBe(GiftStatus.PURCHASED);
      expect(result.current.gifts[0].statusHistory).toHaveLength(2);
      expect(result.current.gifts[0].statusHistory[1].notes).toBe('Bought on sale!');
    });

    it('should clear hiding spot when status changes from HIDDEN', () => {
      const { result } = renderHook(() => useGiftsStore());

      let gift: ReturnType<typeof result.current.addGift>;

      act(() => {
        gift = result.current.addGift(
          createMockGiftData({ status: GiftStatus.HIDDEN, hidingSpot: 'Under the bed' })
        );
      });

      act(() => {
        result.current.updateGiftStatus(gift.id, GiftStatus.WRAPPED);
      });

      expect(result.current.gifts[0].status).toBe(GiftStatus.WRAPPED);
      expect(result.current.gifts[0].hidingSpot).toBeUndefined();
    });
  });

  describe('setHidingSpot', () => {
    it('should set hiding spot for a gift', () => {
      const { result } = renderHook(() => useGiftsStore());

      let gift: ReturnType<typeof result.current.addGift>;

      act(() => {
        gift = result.current.addGift(createMockGiftData({ status: GiftStatus.HIDDEN }));
      });

      act(() => {
        result.current.setHidingSpot(gift.id, 'Top shelf in garage');
      });

      expect(result.current.gifts[0].hidingSpot).toBe('Top shelf in garage');
    });
  });

  describe('markAsGiven', () => {
    it('should mark gift as given with date and reaction', () => {
      const { result } = renderHook(() => useGiftsStore());

      let gift: ReturnType<typeof result.current.addGift>;

      act(() => {
        gift = result.current.addGift(createMockGiftData({ status: GiftStatus.WRAPPED }));
      });

      const givenDate = '2024-12-25T10:00:00.000Z';

      act(() => {
        result.current.markAsGiven(gift.id, givenDate, GiftReaction.LOVED_IT);
      });

      expect(result.current.gifts[0].status).toBe(GiftStatus.GIVEN);
      expect(result.current.gifts[0].dateGiven).toBe(givenDate);
      expect(result.current.gifts[0].reaction).toBe(GiftReaction.LOVED_IT);
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useGiftsStore());

      act(() => {
        result.current.addGift(
          createMockGiftData({
            name: 'Cheap Book',
            status: GiftStatus.IDEA,
            priority: GiftPriority.LOW,
            category: GiftCategory.BOOKS,
            price: 15,
          })
        );
        result.current.addGift(
          createMockGiftData({
            name: 'Nice Shirt',
            status: GiftStatus.PURCHASED,
            priority: GiftPriority.HIGH,
            category: GiftCategory.CLOTHING,
            price: 75,
          })
        );
        result.current.addGift(
          createMockGiftData({
            name: 'Expensive Watch',
            status: GiftStatus.WRAPPED,
            priority: GiftPriority.MUST_HAVE,
            category: GiftCategory.JEWELRY,
            price: 500,
          })
        );
      });
    });

    it('should filter by status', () => {
      const { result } = renderHook(() => useGiftsStore());

      act(() => {
        result.current.setFilters({ status: [GiftStatus.IDEA] });
      });

      const filtered = result.current.getFilteredGifts();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Cheap Book');
    });

    it('should filter by priority', () => {
      const { result } = renderHook(() => useGiftsStore());

      act(() => {
        result.current.setFilters({ priority: [GiftPriority.HIGH, GiftPriority.MUST_HAVE] });
      });

      const filtered = result.current.getFilteredGifts();
      expect(filtered).toHaveLength(2);
    });

    it('should filter by price range', () => {
      const { result } = renderHook(() => useGiftsStore());

      act(() => {
        result.current.setFilters({ priceMin: 50, priceMax: 200 });
      });

      const filtered = result.current.getFilteredGifts();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Nice Shirt');
    });

    it('should filter by search query', () => {
      const { result } = renderHook(() => useGiftsStore());

      act(() => {
        result.current.setFilters({ searchQuery: 'watch' });
      });

      const filtered = result.current.getFilteredGifts();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Expensive Watch');
    });
  });

  describe('sorting', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useGiftsStore());

      act(() => {
        result.current.addGift(createMockGiftData({ name: 'B Gift', price: 50 }));
        result.current.addGift(createMockGiftData({ name: 'A Gift', price: 100 }));
        result.current.addGift(createMockGiftData({ name: 'C Gift', price: 25 }));
      });
    });

    it('should sort by name ascending', () => {
      const { result } = renderHook(() => useGiftsStore());

      act(() => {
        result.current.setSortOptions({ field: 'name', direction: 'asc' });
      });

      const sorted = result.current.getFilteredGifts();
      expect(sorted[0].name).toBe('A Gift');
      expect(sorted[1].name).toBe('B Gift');
      expect(sorted[2].name).toBe('C Gift');
    });

    it('should sort by price descending', () => {
      const { result } = renderHook(() => useGiftsStore());

      act(() => {
        result.current.setSortOptions({ field: 'price', direction: 'desc' });
      });

      const sorted = result.current.getFilteredGifts();
      expect(sorted[0].price).toBe(100);
      expect(sorted[1].price).toBe(50);
      expect(sorted[2].price).toBe(25);
    });
  });

  describe('getGiftsByPerson', () => {
    it('should return gifts for a specific person (excluding given)', () => {
      const { result } = renderHook(() => useGiftsStore());

      act(() => {
        result.current.addGift(
          createMockGiftData({ personId: 'person-1', name: 'Gift 1', status: GiftStatus.IDEA })
        );
        result.current.addGift(
          createMockGiftData({ personId: 'person-1', name: 'Gift 2', status: GiftStatus.GIVEN })
        );
        result.current.addGift(
          createMockGiftData({ personId: 'person-2', name: 'Gift 3', status: GiftStatus.IDEA })
        );
      });

      const personGifts = result.current.getGiftsByPerson('person-1');
      expect(personGifts).toHaveLength(1);
      expect(personGifts[0].name).toBe('Gift 1');
    });
  });

  describe('getGiftsHistory', () => {
    it('should return given gifts for a person', () => {
      const { result } = renderHook(() => useGiftsStore());

      act(() => {
        result.current.addGift(
          createMockGiftData({
            personId: 'person-1',
            name: 'Past Gift',
            status: GiftStatus.GIVEN,
          })
        );
        result.current.addGift(
          createMockGiftData({
            personId: 'person-1',
            name: 'Current Gift',
            status: GiftStatus.IDEA,
          })
        );
      });

      const history = result.current.getGiftsHistory('person-1');
      expect(history).toHaveLength(1);
      expect(history[0].name).toBe('Past Gift');
    });
  });

  describe('getTotalSpentForPerson', () => {
    it('should calculate total spent (excluding ideas and returned)', () => {
      const { result } = renderHook(() => useGiftsStore());

      act(() => {
        result.current.addGift(
          createMockGiftData({
            personId: 'person-1',
            price: 100,
            status: GiftStatus.PURCHASED,
          })
        );
        result.current.addGift(
          createMockGiftData({
            personId: 'person-1',
            price: 50,
            status: GiftStatus.WRAPPED,
          })
        );
        result.current.addGift(
          createMockGiftData({
            personId: 'person-1',
            price: 75,
            status: GiftStatus.IDEA, // Should not count
          })
        );
        result.current.addGift(
          createMockGiftData({
            personId: 'person-1',
            price: 200,
            status: GiftStatus.RETURNED, // Should not count
          })
        );
      });

      const total = result.current.getTotalSpentForPerson('person-1');
      expect(total).toBe(150); // 100 + 50
    });
  });

  describe('deleteGiftsForPerson', () => {
    it('should delete all gifts for a person', () => {
      const { result } = renderHook(() => useGiftsStore());

      act(() => {
        result.current.addGift(createMockGiftData({ personId: 'person-1', name: 'Gift 1' }));
        result.current.addGift(createMockGiftData({ personId: 'person-1', name: 'Gift 2' }));
        result.current.addGift(createMockGiftData({ personId: 'person-2', name: 'Gift 3' }));
      });

      expect(result.current.gifts).toHaveLength(3);

      act(() => {
        result.current.deleteGiftsForPerson('person-1');
      });

      expect(result.current.gifts).toHaveLength(1);
      expect(result.current.gifts[0].name).toBe('Gift 3');
    });
  });
});
