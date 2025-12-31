import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme';
import { useOccasionsStore, usePeopleStore, useGiftsStore, getDaysUntil } from '@/store';
import { Card, Badge, EmptyState } from '@/components/common';
import { TEST_IDS } from '@/constants/testIDs';
import { OCCASION_TYPES } from '@/constants/occasions';
import { Occasion, Currency } from '@/types';
import type { MainTabScreenProps } from '@/navigation/types';

type ScreenProps = MainTabScreenProps<'Occasions'>;

type FilterType = 'all' | 'upcoming' | 'past';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
  [Currency.CAD]: 'C$',
  [Currency.AUD]: 'A$',
  [Currency.JPY]: '¥',
};

interface OccasionCardProps {
  occasion: Occasion;
  personName: string;
  giftCount: number;
  onPress: () => void;
}

const OccasionCard: React.FC<OccasionCardProps> = ({
  occasion,
  personName,
  giftCount,
  onPress,
}) => {
  const theme = useTheme();
  const daysUntil = getDaysUntil(occasion.date, occasion.isRecurring);
  const typeInfo = OCCASION_TYPES.find((t) => t.value === occasion.type);

  const getCountdownColor = () => {
    if (daysUntil < 0) return theme.colors.textTertiary;
    if (daysUntil <= 7) return theme.colors.error;
    if (daysUntil <= 30) return theme.colors.warning;
    return theme.colors.success;
  };

  const getCountdownText = () => {
    if (daysUntil < 0) return `${Math.abs(daysUntil)} days ago`;
    if (daysUntil === 0) return 'Today!';
    if (daysUntil === 1) return 'Tomorrow';
    return `${daysUntil} days`;
  };

  const formattedDate = new Date(occasion.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: occasion.isRecurring ? undefined : 'numeric',
  });

  return (
    <TouchableOpacity
      testID={TEST_IDS.OCCASIONS.OCCASION_CARD(occasion.id)}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.nameRow}>
              <Text style={[styles.occasionName, { color: theme.colors.text }]}>
                {occasion.name}
              </Text>
              {occasion.isRecurring && (
                <Text style={[styles.recurringBadge, { color: theme.colors.textTertiary }]}>
                  Yearly
                </Text>
              )}
            </View>
            <Text style={[styles.personName, { color: theme.colors.textSecondary }]}>
              {personName}
            </Text>
          </View>
          <View style={styles.countdown}>
            <Text style={[styles.countdownNumber, { color: getCountdownColor() }]}>
              {getCountdownText()}
            </Text>
          </View>
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
              {formattedDate}
            </Text>
            {typeInfo && (
              <Badge label={typeInfo.label} backgroundColor={typeInfo.color} size="sm" />
            )}
          </View>

          <View style={styles.statsRow}>
            <Text style={[styles.statsText, { color: theme.colors.textSecondary }]}>
              {giftCount} {giftCount === 1 ? 'gift' : 'gifts'}
            </Text>
            {occasion.budgetAmount !== undefined && (
              <Text style={[styles.budgetText, { color: theme.colors.textSecondary }]}>
                Budget: {CURRENCY_SYMBOLS[occasion.budgetCurrency]}
                {occasion.budgetAmount.toFixed(0)}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export const OccasionsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ScreenProps['navigation']>();

  const occasions = useOccasionsStore((state) => state.occasions);
  const getUpcomingOccasions = useOccasionsStore((state) => state.getUpcomingOccasions);
  const getPastOccasions = useOccasionsStore((state) => state.getPastOccasions);
  const getPerson = usePeopleStore((state) => state.getPerson);
  const getGiftsByOccasion = useGiftsStore((state) => state.getGiftsByOccasion);

  const [filter, setFilter] = useState<FilterType>('upcoming');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredOccasions = useMemo(() => {
    switch (filter) {
      case 'upcoming':
        return getUpcomingOccasions(365); // Show up to a year ahead
      case 'past':
        return getPastOccasions();
      default:
        return [...occasions].sort((a, b) => {
          const daysA = getDaysUntil(a.date, a.isRecurring);
          const daysB = getDaysUntil(b.date, b.isRecurring);
          return daysA - daysB;
        });
    }
  }, [filter, occasions, getUpcomingOccasions, getPastOccasions]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulated refresh - in real app would sync with server
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  const handleOccasionPress = useCallback(
    (occasion: Occasion) => {
      navigation.navigate('OccasionDetail', { occasionId: occasion.id });
    },
    [navigation]
  );

  const handleAddOccasion = useCallback(() => {
    navigation.navigate('OccasionForm', {});
  }, [navigation]);

  const renderOccasion = useCallback(
    ({ item }: { item: Occasion }) => {
      const person = item.personId ? getPerson(item.personId) : undefined;
      const gifts = getGiftsByOccasion(item.id);

      return (
        <OccasionCard
          occasion={item}
          personName={person?.name || 'Unknown'}
          giftCount={gifts.length}
          onPress={() => handleOccasionPress(item)}
        />
      );
    },
    [getPerson, getGiftsByOccasion, handleOccasionPress]
  );

  const renderEmptyState = useCallback(() => {
    return (
      <EmptyState
        testID={TEST_IDS.OCCASIONS.EMPTY_STATE}
        title={filter === 'past' ? 'No Past Occasions' : 'No Upcoming Occasions'}
        description={
          filter === 'past'
            ? "You don't have any past occasions yet."
            : "You haven't added any occasions yet. Add birthdays, holidays, and other special dates to track."
        }
        actionButton={{
          title: "Add Occasion",
          onPress: handleAddOccasion,
        }}
      />
    );
  }, [filter, handleAddOccasion]);

  return (
    <View
      testID={TEST_IDS.OCCASIONS.SCREEN}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Filter Tabs */}
      <View style={[styles.filterContainer, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.filterTabs, { backgroundColor: theme.colors.backgroundSecondary }]}>
          {(['upcoming', 'all', 'past'] as FilterType[]).map((filterType) => (
            <TouchableOpacity
              key={filterType}
              testID={`occasions-filter-${filterType}`}
              onPress={() => setFilter(filterType)}
              style={[
                styles.filterTab,
                filter === filterType && {
                  backgroundColor: theme.colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterTabText,
                  {
                    color:
                      filter === filterType
                        ? '#FFFFFF'
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Summary */}
      {filteredOccasions.length > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={[styles.summaryText, { color: theme.colors.textSecondary }]}>
            {filteredOccasions.length}{' '}
            {filteredOccasions.length === 1 ? 'occasion' : 'occasions'}
          </Text>
        </View>
      )}

      {/* Occasions List */}
      <FlatList
        testID={TEST_IDS.OCCASIONS.OCCASION_LIST}
        data={filteredOccasions}
        renderItem={renderOccasion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          filteredOccasions.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity
        testID={TEST_IDS.OCCASIONS.ADD_BUTTON}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddOccasion}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  filterTabs: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  summaryText: {
    fontSize: 13,
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  occasionName: {
    fontSize: 18,
    fontWeight: '600',
  },
  recurringBadge: {
    fontSize: 12,
    marginLeft: 8,
  },
  personName: {
    fontSize: 14,
    marginTop: 2,
  },
  countdown: {
    alignItems: 'flex-end',
  },
  countdownNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statsText: {
    fontSize: 13,
  },
  budgetText: {
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 30,
  },
});

export default OccasionsScreen;
