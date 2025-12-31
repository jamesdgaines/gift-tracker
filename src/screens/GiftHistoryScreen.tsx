import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/theme';
import { useGiftsStore, usePeopleStore, useOccasionsStore } from '@/store';
import { Card, Badge, EmptyState } from '@/components/common';
import { TEST_IDS } from '@/constants/testIDs';
import { GIFT_CATEGORIES } from '@/constants/categories';
import { Gift, GiftStatus, Currency } from '@/types';
import type { RootStackScreenProps } from '@/navigation/types';

type ScreenProps = RootStackScreenProps<'GiftHistory'>;

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
  [Currency.CAD]: 'C$',
  [Currency.AUD]: 'A$',
  [Currency.JPY]: '¥',
};

interface GiftHistoryCardProps {
  gift: Gift;
  occasionName?: string;
  onPress: () => void;
}

const GiftHistoryCard: React.FC<GiftHistoryCardProps> = ({
  gift,
  occasionName,
  onPress,
}) => {
  const theme = useTheme();
  const categoryInfo = GIFT_CATEGORIES.find((c) => c.value === gift.category);

  const formattedDate = gift.dateGiven
    ? new Date(gift.dateGiven).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date';

  return (
    <TouchableOpacity
      testID={TEST_IDS.GIFT_HISTORY.GIFT_CARD(gift.id)}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={[styles.giftName, { color: theme.colors.text }]}>
              {gift.name}
            </Text>
            {occasionName && (
              <Text style={[styles.occasionName, { color: theme.colors.textSecondary }]}>
                {occasionName}
              </Text>
            )}
          </View>
          {categoryInfo && (
            <Badge label={categoryInfo.label} backgroundColor={categoryInfo.color} size="sm" />
          )}
        </View>

        <View style={styles.cardDetails}>
          <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
            Given on {formattedDate}
          </Text>
          {gift.price !== undefined && (
            <Text style={[styles.priceText, { color: theme.colors.text }]}>
              {CURRENCY_SYMBOLS[gift.currency]}
              {gift.price.toFixed(2)}
            </Text>
          )}
        </View>

        {gift.notes && (
          <Text
            style={[styles.notes, { color: theme.colors.textSecondary }]}
            numberOfLines={2}
          >
            {gift.notes}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );
};

export const GiftHistoryScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ScreenProps['navigation']>();
  const route = useRoute<ScreenProps['route']>();
  const { personId } = route.params;

  const getGiftsByPerson = useGiftsStore((state) => state.getGiftsByPerson);
  const getPerson = usePeopleStore((state) => state.getPerson);
  const getOccasion = useOccasionsStore((state) => state.getOccasion);

  const person = getPerson(personId);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Get all given or returned gifts for this person
  const historyGifts = useMemo(() => {
    const allGifts = getGiftsByPerson(personId);
    return allGifts.filter(
      (gift) =>
        gift.status === GiftStatus.GIVEN || gift.status === GiftStatus.RETURNED
    );
  }, [getGiftsByPerson, personId]);

  // Group by year
  const giftsByYear = useMemo(() => {
    const grouped: Record<number, Gift[]> = {};
    historyGifts.forEach((gift) => {
      const year = gift.dateGiven
        ? new Date(gift.dateGiven).getFullYear()
        : new Date(gift.updatedAt).getFullYear();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(gift);
    });
    return grouped;
  }, [historyGifts]);

  const years = useMemo(() => {
    return Object.keys(giftsByYear)
      .map(Number)
      .sort((a, b) => b - a);
  }, [giftsByYear]);

  const filteredGifts = useMemo(() => {
    if (selectedYear === null) {
      return historyGifts.sort((a, b) => {
        const dateA = a.dateGiven || a.updatedAt;
        const dateB = b.dateGiven || b.updatedAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    }
    return (giftsByYear[selectedYear] || []).sort((a, b) => {
      const dateA = a.dateGiven || a.updatedAt;
      const dateB = b.dateGiven || b.updatedAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }, [selectedYear, historyGifts, giftsByYear]);

  // Calculate total spent
  const totalSpent = useMemo(() => {
    return filteredGifts.reduce((sum, gift) => sum + (gift.price || 0), 0);
  }, [filteredGifts]);

  const handleGiftPress = useCallback(
    (gift: Gift) => {
      navigation.navigate('GiftDetail', { giftId: gift.id, personId: gift.personId });
    },
    [navigation]
  );

  const renderGift = useCallback(
    ({ item }: { item: Gift }) => {
      const occasion = item.occasionId ? getOccasion(item.occasionId) : undefined;
      return (
        <GiftHistoryCard
          gift={item}
          occasionName={occasion?.name}
          onPress={() => handleGiftPress(item)}
        />
      );
    },
    [getOccasion, handleGiftPress]
  );

  const renderEmptyState = useCallback(() => {
    return (
      <EmptyState
        testID={TEST_IDS.GIFT_HISTORY.EMPTY_STATE}
        title="No Gift History"
        description={`You haven't given any gifts to ${person?.name || 'this person'} yet. Once you mark gifts as given, they'll appear here.`}
      />
    );
  }, [person?.name]);

  return (
    <View
      testID={TEST_IDS.GIFT_HISTORY.SCREEN}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Year Filter */}
      {years.length > 0 && (
        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[null, ...years]}
            keyExtractor={(item) => (item === null ? 'all' : item.toString())}
            renderItem={({ item }) => (
              <TouchableOpacity
                testID={`giftHistory-yearFilter-${item || 'all'}`}
                onPress={() => setSelectedYear(item)}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      selectedYear === item
                        ? theme.colors.primary
                        : theme.colors.backgroundSecondary,
                    borderColor:
                      selectedYear === item
                        ? theme.colors.primary
                        : theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    {
                      color:
                        selectedYear === item
                          ? '#FFFFFF'
                          : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {item === null ? 'All' : item}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.filterList}
          />
        </View>
      )}

      {/* Summary */}
      {filteredGifts.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              {filteredGifts.length} {filteredGifts.length === 1 ? 'gift' : 'gifts'}
            </Text>
            <Text style={[styles.summaryTotal, { color: theme.colors.text }]}>
              Total: ${totalSpent.toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      {/* Gift List */}
      <FlatList
        testID={TEST_IDS.GIFT_HISTORY.GIFT_LIST}
        data={filteredGifts}
        renderItem={renderGift}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          filteredGifts.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    marginBottom: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  giftName: {
    fontSize: 16,
    fontWeight: '600',
  },
  occasionName: {
    fontSize: 13,
    marginTop: 2,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    fontSize: 13,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '600',
  },
  notes: {
    fontSize: 13,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default GiftHistoryScreen;
