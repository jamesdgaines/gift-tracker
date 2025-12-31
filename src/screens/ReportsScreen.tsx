import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/theme';
import { useGiftsStore, usePeopleStore, useOccasionsStore } from '@/store';
import { Card, ProgressBar, EmptyState } from '@/components/common';
import { TEST_IDS } from '@/constants/testIDs';
import { GIFT_CATEGORIES } from '@/constants/categories';
import { GiftStatus, Currency } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
  [Currency.CAD]: 'C$',
  [Currency.AUD]: 'A$',
  [Currency.JPY]: '¥',
};

type TimeFilter = 'all' | 'year' | 'month';

export const ReportsScreen: React.FC = () => {
  const theme = useTheme();

  const gifts = useGiftsStore((state) => state.gifts);
  const people = usePeopleStore((state) => state.people);
  const occasions = useOccasionsStore((state) => state.occasions);

  const [timeFilter, setTimeFilter] = useState<TimeFilter>('year');

  // Filter gifts by time
  const filteredGifts = useMemo(() => {
    const now = new Date();
    return gifts.filter((gift) => {
      if (timeFilter === 'all') return true;

      const giftDate = gift.dateGiven ? new Date(gift.dateGiven) : new Date(gift.createdAt);

      if (timeFilter === 'year') {
        return giftDate.getFullYear() === now.getFullYear();
      }
      if (timeFilter === 'month') {
        return (
          giftDate.getFullYear() === now.getFullYear() &&
          giftDate.getMonth() === now.getMonth()
        );
      }
      return true;
    });
  }, [gifts, timeFilter]);

  // Calculate total spent
  const totalSpent = useMemo(() => {
    return filteredGifts
      .filter((g) => g.status === GiftStatus.GIVEN || g.status === GiftStatus.PURCHASED)
      .reduce((sum, gift) => sum + (gift.price || 0), 0);
  }, [filteredGifts]);

  // Calculate spending by person
  const spendingByPerson = useMemo(() => {
    const byPerson: Record<string, { name: string; spent: number; budget: number }> = {};

    people.forEach((person) => {
      byPerson[person.id] = {
        name: person.name,
        spent: 0,
        budget: person.budgetAmount || 0,
      };
    });

    filteredGifts.forEach((gift) => {
      if (
        byPerson[gift.personId] &&
        (gift.status === GiftStatus.GIVEN || gift.status === GiftStatus.PURCHASED)
      ) {
        byPerson[gift.personId].spent += gift.price || 0;
      }
    });

    return Object.entries(byPerson)
      .map(([id, data]) => ({ id, ...data }))
      .filter((p) => p.spent > 0 || p.budget > 0)
      .sort((a, b) => b.spent - a.spent);
  }, [filteredGifts, people]);

  // Calculate spending by category
  const spendingByCategory = useMemo(() => {
    const byCategory: Record<string, number> = {};

    filteredGifts.forEach((gift) => {
      if (gift.status === GiftStatus.GIVEN || gift.status === GiftStatus.PURCHASED) {
        const category = gift.category;
        byCategory[category] = (byCategory[category] || 0) + (gift.price || 0);
      }
    });

    return Object.entries(byCategory)
      .map(([category, amount]) => {
        const info = GIFT_CATEGORIES.find((c) => c.value === category);
        return {
          category,
          label: info?.label || category,
          color: info?.color || theme.colors.textSecondary,
          amount,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [filteredGifts, theme.colors.textSecondary]);

  // Calculate status breakdown
  const statusBreakdown = useMemo(() => {
    const counts: Record<GiftStatus, number> = {
      [GiftStatus.IDEA]: 0,
      [GiftStatus.PURCHASED]: 0,
      [GiftStatus.WRAPPED]: 0,
      [GiftStatus.HIDDEN]: 0,
      [GiftStatus.GIVEN]: 0,
      [GiftStatus.RETURNED]: 0,
    };

    filteredGifts.forEach((gift) => {
      counts[gift.status]++;
    });

    return counts;
  }, [filteredGifts]);

  // Calculate upcoming occasions
  const upcomingOccasionsCount = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return occasions.filter((occ) => {
      const occDate = new Date(occ.date);
      // For recurring, check if the anniversary falls within next 30 days
      if (occ.isRecurring) {
        const thisYearOcc = new Date(now.getFullYear(), occDate.getMonth(), occDate.getDate());
        if (thisYearOcc < now) {
          thisYearOcc.setFullYear(now.getFullYear() + 1);
        }
        return thisYearOcc <= thirtyDaysFromNow;
      }
      return occDate >= now && occDate <= thirtyDaysFromNow;
    }).length;
  }, [occasions]);

  const hasData = gifts.length > 0 || people.length > 0;

  if (!hasData) {
    return (
      <View
        testID={TEST_IDS.REPORTS.SCREEN}
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <EmptyState
          testID={TEST_IDS.REPORTS.EMPTY_STATE}
          title="No Data Yet"
          description="Start adding people and gifts to see your spending reports and analytics here."
        />
      </View>
    );
  }

  return (
    <ScrollView
      testID={TEST_IDS.REPORTS.SCREEN}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Time Filter */}
      <View style={styles.filterContainer}>
        {(['month', 'year', 'all'] as TimeFilter[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            testID={`${TEST_IDS.REPORTS.TIME_FILTER}-${filter}`}
            onPress={() => setTimeFilter(filter)}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  timeFilter === filter
                    ? theme.colors.primary
                    : theme.colors.backgroundSecondary,
              },
            ]}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  color:
                    timeFilter === filter ? '#FFFFFF' : theme.colors.textSecondary,
                },
              ]}
            >
              {filter === 'month'
                ? 'This Month'
                : filter === 'year'
                ? 'This Year'
                : 'All Time'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Overview Cards */}
      <View style={styles.overviewRow}>
        <Card style={[styles.overviewCard, { flex: 1 }]}>
          <Text style={[styles.overviewValue, { color: theme.colors.text }]}>
            ${totalSpent.toFixed(0)}
          </Text>
          <Text style={[styles.overviewLabel, { color: theme.colors.textSecondary }]}>
            Total Spent
          </Text>
        </Card>
        <Card style={[styles.overviewCard, { flex: 1, marginLeft: 12 }]}>
          <Text style={[styles.overviewValue, { color: theme.colors.text }]}>
            {filteredGifts.length}
          </Text>
          <Text style={[styles.overviewLabel, { color: theme.colors.textSecondary }]}>
            Gifts
          </Text>
        </Card>
        <Card style={[styles.overviewCard, { flex: 1, marginLeft: 12 }]}>
          <Text style={[styles.overviewValue, { color: theme.colors.primary }]}>
            {upcomingOccasionsCount}
          </Text>
          <Text style={[styles.overviewLabel, { color: theme.colors.textSecondary }]}>
            Upcoming
          </Text>
        </Card>
      </View>

      {/* Gift Status Breakdown */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Gift Status
        </Text>
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <Text style={[styles.statusValue, { color: theme.colors.primary }]}>
              {statusBreakdown[GiftStatus.IDEA]}
            </Text>
            <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>
              Ideas
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={[styles.statusValue, { color: theme.colors.warning }]}>
              {statusBreakdown[GiftStatus.PURCHASED]}
            </Text>
            <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>
              Purchased
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={[styles.statusValue, { color: theme.colors.secondary }]}>
              {statusBreakdown[GiftStatus.WRAPPED] + statusBreakdown[GiftStatus.HIDDEN]}
            </Text>
            <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>
              Ready
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={[styles.statusValue, { color: theme.colors.success }]}>
              {statusBreakdown[GiftStatus.GIVEN]}
            </Text>
            <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>
              Given
            </Text>
          </View>
        </View>
      </Card>

      {/* Spending by Person */}
      {spendingByPerson.length > 0 && (
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Spending by Person
          </Text>
          {spendingByPerson.slice(0, 5).map((person) => (
            <View key={person.id} style={styles.personRow}>
              <View style={styles.personInfo}>
                <Text style={[styles.personName, { color: theme.colors.text }]}>
                  {person.name}
                </Text>
                <Text style={[styles.personSpent, { color: theme.colors.textSecondary }]}>
                  ${person.spent.toFixed(0)}
                  {person.budget > 0 && ` / $${person.budget.toFixed(0)}`}
                </Text>
              </View>
              {person.budget > 0 && (
                <ProgressBar
                  testID={TEST_IDS.REPORTS.PERSON_BUDGET(person.id)}
                  progress={(person.spent / person.budget) * 100}
                  variant={person.spent > person.budget ? 'error' : 'default'}
                  style={styles.progressBar}
                />
              )}
            </View>
          ))}
        </Card>
      )}

      {/* Spending by Category */}
      {spendingByCategory.length > 0 && (
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Spending by Category
          </Text>
          {spendingByCategory.map((cat) => {
            const percentage = totalSpent > 0 ? (cat.amount / totalSpent) * 100 : 0;
            return (
              <View key={cat.category} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                  <Text style={[styles.categoryLabel, { color: theme.colors.text }]}>
                    {cat.label}
                  </Text>
                </View>
                <View style={styles.categoryValues}>
                  <Text style={[styles.categoryAmount, { color: theme.colors.text }]}>
                    ${cat.amount.toFixed(0)}
                  </Text>
                  <Text
                    style={[styles.categoryPercent, { color: theme.colors.textSecondary }]}
                  >
                    {percentage.toFixed(0)}%
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>
      )}

      {/* Average Gift Price */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Quick Stats
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              ${filteredGifts.length > 0 ? (totalSpent / filteredGifts.length).toFixed(0) : 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Avg. Gift Price
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {people.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              People
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {occasions.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Occasions
            </Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  overviewRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  overviewCard: {
    padding: 16,
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  overviewLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statusLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  personRow: {
    marginBottom: 16,
  },
  personInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  personName: {
    fontSize: 14,
    fontWeight: '500',
  },
  personSpent: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryLabel: {
    fontSize: 14,
  },
  categoryValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  categoryPercent: {
    fontSize: 12,
    minWidth: 36,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default ReportsScreen;
