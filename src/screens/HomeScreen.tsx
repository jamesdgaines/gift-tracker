import React, { useMemo, useCallback, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { usePeopleStore, useGiftsStore, useOccasionsStore } from '@/store';
import { Input, Card, Avatar, Badge, EmptyState, LoadingState } from '@/components/common';
import { TEST_IDS } from '@/constants/testIDs';
import { RELATIONSHIPS, getCategoryLabel } from '@/constants/categories';
import { Person, RelationshipCategory } from '@/types';
import type { MainTabScreenProps } from '@/navigation/types';

type NavigationProp = MainTabScreenProps<'Home'>['navigation'];

interface PersonCardProps {
  person: Person;
  giftsCount: number;
  nextOccasionText?: string;
  onPress: () => void;
}

const PersonCard: React.FC<PersonCardProps> = ({
  person,
  giftsCount,
  nextOccasionText,
  onPress,
}) => {
  const theme = useTheme();
  const relationshipLabel =
    person.relationship === RelationshipCategory.OTHER
      ? person.customRelationship || 'Other'
      : getCategoryLabel(RELATIONSHIPS, person.relationship);

  return (
    <Card
      testID={TEST_IDS.HOME.PERSON_CARD(person.id)}
      onPress={onPress}
      style={styles.personCard}
    >
      <View style={styles.personCardContent}>
        <Avatar
          testID={TEST_IDS.COMMON.AVATAR(person.id)}
          uri={person.photoUri}
          name={person.name}
          size="lg"
        />
        <View style={styles.personInfo}>
          <Text
            style={[
              styles.personName,
              { color: theme.colors.text, fontSize: theme.fontSize.md },
            ]}
            numberOfLines={1}
          >
            {person.name}
          </Text>
          <View style={styles.personMeta}>
            <Badge
              label={relationshipLabel}
              size="sm"
              variant="default"
              style={styles.badge}
            />
            {giftsCount > 0 && (
              <Text
                style={[
                  styles.giftsCount,
                  { color: theme.colors.textSecondary, fontSize: theme.fontSize.xs },
                ]}
              >
                {giftsCount} gift{giftsCount !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
          {nextOccasionText && (
            <Text
              style={[
                styles.occasionText,
                { color: theme.colors.textSecondary, fontSize: theme.fontSize.xs },
              ]}
            >
              {nextOccasionText}
            </Text>
          )}
        </View>
        <Text style={{ color: theme.colors.textTertiary, fontSize: 20 }}>›</Text>
      </View>
    </Card>
  );
};

export const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Store hooks
  const people = usePeopleStore((state) => state.people);
  const setFilters = usePeopleStore((state) => state.setFilters);
  const getFilteredPeople = usePeopleStore((state) => state.getFilteredPeople);
  const isLoading = usePeopleStore((state) => state.isLoading);

  const getGiftsByPerson = useGiftsStore((state) => state.getGiftsByPerson);
  const getNextOccasionForPerson = useOccasionsStore((state) => state.getNextOccasionForPerson);

  // Update filters when search query changes
  React.useEffect(() => {
    setFilters({ searchQuery: searchQuery || undefined });
  }, [searchQuery, setFilters]);

  const filteredPeople = useMemo(() => getFilteredPeople(), [getFilteredPeople, searchQuery]);

  const getNextOccasionText = useCallback(
    (personId: string): string | undefined => {
      const occasion = getNextOccasionForPerson(personId);
      if (!occasion) return undefined;

      const date = new Date(occasion.date);
      const now = new Date();
      const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return `${occasion.name} is today!`;
      if (diffDays === 1) return `${occasion.name} is tomorrow`;
      if (diffDays <= 7) return `${occasion.name} in ${diffDays} days`;
      if (diffDays <= 30) return `${occasion.name} in ${Math.ceil(diffDays / 7)} weeks`;
      return undefined;
    },
    [getNextOccasionForPerson]
  );

  const handlePersonPress = useCallback(
    (personId: string) => {
      navigation.navigate('PersonDetail', { personId });
    },
    [navigation]
  );

  const handleAddPerson = useCallback(() => {
    navigation.navigate('PersonForm', {});
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // In a real app, this would sync with Firebase
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsRefreshing(false);
  }, []);

  const renderPerson = useCallback(
    ({ item }: { item: Person }) => {
      const giftsCount = getGiftsByPerson(item.id).length;
      const nextOccasionText = getNextOccasionText(item.id);

      return (
        <PersonCard
          person={item}
          giftsCount={giftsCount}
          nextOccasionText={nextOccasionText}
          onPress={() => handlePersonPress(item.id)}
        />
      );
    },
    [getGiftsByPerson, getNextOccasionText, handlePersonPress]
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return <LoadingState testID={TEST_IDS.HOME.LOADING} message="Loading people..." />;
    }

    if (searchQuery && filteredPeople.length === 0) {
      return (
        <EmptyState
          testID={TEST_IDS.HOME.EMPTY_STATE}
          title="No Results"
          description={`No people found matching "${searchQuery}"`}
          actionButton={{
            title: 'Clear Search',
            onPress: () => setSearchQuery(''),
            variant: 'outline',
          }}
        />
      );
    }

    return (
      <EmptyState
        testID={TEST_IDS.HOME.EMPTY_STATE}
        title="No People Yet"
        description="Start by adding the people you want to track gifts for."
        actionButton={{
          title: 'Add First Person',
          onPress: handleAddPerson,
        }}
      />
    );
  }, [isLoading, searchQuery, filteredPeople.length, handleAddPerson]);

  return (
    <View
      testID={TEST_IDS.HOME.SCREEN}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Search Bar */}
      <View style={[styles.searchContainer, { paddingHorizontal: theme.spacing.md }]}>
        <Input
          testID={TEST_IDS.HOME.SEARCH_INPUT}
          placeholder="Search people..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </View>

      {/* People List */}
      <FlatList
        testID={TEST_IDS.HOME.PERSON_LIST}
        data={filteredPeople}
        renderItem={renderPerson}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          filteredPeople.length === 0 && styles.emptyListContent,
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmpty}
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
        testID={TEST_IDS.HOME.ADD_PERSON_BUTTON}
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.primary,
            bottom: insets.bottom + 16,
          },
          theme.getShadowStyle('lg'),
        ]}
        onPress={handleAddPerson}
        activeOpacity={0.8}
        accessibilityLabel="Add new person"
        accessibilityRole="button"
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchInput: {
    marginBottom: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyListContent: {
    flex: 1,
  },
  separator: {
    height: 12,
  },
  personCard: {
    padding: 12,
  },
  personCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  personName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  personMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginRight: 8,
  },
  giftsCount: {},
  occasionText: {
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 32,
  },
});

export default HomeScreen;
