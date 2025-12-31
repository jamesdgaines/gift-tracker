import React, { useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { usePeopleStore, useGiftsStore, useOccasionsStore } from '@/store';
import {
  Card,
  Avatar,
  Badge,
  Button,
  ProgressBar,
  EmptyState,
} from '@/components/common';
import { TEST_IDS } from '@/constants/testIDs';
import { RELATIONSHIPS, getCategoryLabel, GIFT_STATUSES, getCategoryColor } from '@/constants/categories';
import { Gift, GiftStatus, RelationshipCategory } from '@/types';
import type { RootStackScreenProps } from '@/navigation/types';

type ScreenProps = RootStackScreenProps<'PersonDetail'>;

interface GiftCardProps {
  gift: Gift;
  onPress: () => void;
}

const GiftCard: React.FC<GiftCardProps> = ({ gift, onPress }) => {
  const theme = useTheme();
  const statusLabel = getCategoryLabel(GIFT_STATUSES, gift.status);
  const statusColor = getCategoryColor(GIFT_STATUSES, gift.status);

  return (
    <Card
      testID={TEST_IDS.PERSON_DETAIL.GIFT_CARD(gift.id)}
      onPress={onPress}
      style={styles.giftCard}
    >
      <View style={styles.giftCardContent}>
        <View style={styles.giftInfo}>
          <Text
            style={[
              styles.giftName,
              { color: theme.colors.text, fontSize: theme.fontSize.md },
            ]}
            numberOfLines={1}
          >
            {gift.name}
          </Text>
          <View style={styles.giftMeta}>
            <Badge
              label={statusLabel}
              size="sm"
              backgroundColor={statusColor + '20'}
              color={statusColor}
            />
            {gift.price !== undefined && (
              <Text
                style={[
                  styles.giftPrice,
                  { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
                ]}
              >
                ${gift.price.toFixed(2)}
              </Text>
            )}
          </View>
        </View>
        <Text style={{ color: theme.colors.textTertiary, fontSize: 20 }}>›</Text>
      </View>
    </Card>
  );
};

export const PersonDetailScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ScreenProps['navigation']>();
  const route = useRoute<ScreenProps['route']>();
  const { personId } = route.params;

  // Store hooks
  const person = usePeopleStore((state) => state.getPerson(personId));
  const gifts = useGiftsStore((state) => state.getGiftsByPerson(personId));
  const giftsHistory = useGiftsStore((state) => state.getGiftsHistory(personId));
  const totalSpent = useGiftsStore((state) => state.getTotalSpentForPerson(personId));
  const occasions = useOccasionsStore((state) => state.getOccasionsByPerson(personId));

  // Calculate budget progress
  const budgetProgress = useMemo(() => {
    if (!person?.budgetAmount) return null;
    const percent = (totalSpent / person.budgetAmount) * 100;
    return {
      spent: totalSpent,
      budget: person.budgetAmount,
      percent: Math.min(percent, 100),
      isOver: percent > 100,
    };
  }, [person?.budgetAmount, totalSpent]);

  const relationshipLabel =
    person?.relationship === RelationshipCategory.OTHER
      ? person?.customRelationship || 'Other'
      : person ? getCategoryLabel(RELATIONSHIPS, person.relationship) : '';

  const handleEditPerson = useCallback(() => {
    navigation.navigate('PersonForm', { personId });
  }, [navigation, personId]);

  const handleAddGift = useCallback(() => {
    navigation.navigate('GiftForm', { personId });
  }, [navigation, personId]);

  const handleGiftPress = useCallback(
    (giftId: string) => {
      navigation.navigate('GiftDetail', { giftId, personId });
    },
    [navigation, personId]
  );

  const handleViewHistory = useCallback(() => {
    navigation.navigate('GiftHistory', { personId });
  }, [navigation, personId]);

  if (!person) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          title="Person Not Found"
          description="This person may have been deleted."
          actionButton={{
            title: 'Go Back',
            onPress: () => navigation.goBack(),
          }}
        />
      </View>
    );
  }

  const renderGift = ({ item }: { item: Gift }) => (
    <GiftCard gift={item} onPress={() => handleGiftPress(item.id)} />
  );

  const renderGiftsEmpty = () => (
    <EmptyState
      testID={`${TEST_IDS.PERSON_DETAIL.SCREEN}-emptyGifts`}
      title="No Gift Ideas Yet"
      description="Start adding gift ideas for this person."
      actionButton={{
        title: 'Add Gift Idea',
        onPress: handleAddGift,
      }}
    />
  );

  return (
    <ScrollView
      testID={TEST_IDS.PERSON_DETAIL.SCREEN}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <View style={styles.headerContent}>
          <Avatar
            testID={TEST_IDS.PERSON_DETAIL.PHOTO}
            uri={person.photoUri}
            name={person.name}
            size="xxl"
          />
          <Text
            testID={TEST_IDS.PERSON_DETAIL.NAME_TEXT}
            style={[
              styles.personName,
              { color: theme.colors.text, fontSize: theme.fontSize.xxl },
            ]}
          >
            {person.name}
          </Text>
          <Badge
            testID={TEST_IDS.PERSON_DETAIL.RELATIONSHIP_BADGE}
            label={relationshipLabel}
            variant="primary"
          />
          <TouchableOpacity
            testID={TEST_IDS.PERSON_DETAIL.EDIT_BUTTON}
            onPress={handleEditPerson}
            style={styles.editButton}
          >
            <Text style={{ color: theme.colors.primary }}>Edit</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Budget Section */}
      {budgetProgress && (
        <Card style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text, fontSize: theme.fontSize.lg },
            ]}
          >
            Budget
          </Text>
          <ProgressBar
            testID={TEST_IDS.PERSON_DETAIL.BUDGET_PROGRESS}
            progress={budgetProgress.percent}
            showPercentage
            label={`$${budgetProgress.spent.toFixed(0)} of $${budgetProgress.budget.toFixed(0)}`}
            autoVariant
            thresholds={{ warning: 75, error: 100 }}
          />
        </Card>
      )}

      {/* Quick Info */}
      {(person.notes || Object.values(person.sizes).some(Boolean)) && (
        <Card style={styles.section} testID={TEST_IDS.PERSON_DETAIL.NOTES_SECTION}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text, fontSize: theme.fontSize.lg },
            ]}
          >
            Quick Info
          </Text>
          {Object.entries(person.sizes).some(([_, v]) => v) && (
            <View style={styles.sizesContainer}>
              {person.sizes.shirt && (
                <Badge label={`Shirt: ${person.sizes.shirt}`} variant="default" style={styles.sizeBadge} />
              )}
              {person.sizes.pants && (
                <Badge label={`Pants: ${person.sizes.pants}`} variant="default" style={styles.sizeBadge} />
              )}
              {person.sizes.shoe && (
                <Badge label={`Shoe: ${person.sizes.shoe}`} variant="default" style={styles.sizeBadge} />
              )}
              {person.sizes.ring && (
                <Badge label={`Ring: ${person.sizes.ring}`} variant="default" style={styles.sizeBadge} />
              )}
            </View>
          )}
          {person.notes && (
            <Text
              style={[
                styles.notes,
                { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
              ]}
            >
              {person.notes}
            </Text>
          )}
        </Card>
      )}

      {/* Gift Ideas Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text, fontSize: theme.fontSize.lg },
            ]}
          >
            Gift Ideas ({gifts.length})
          </Text>
          <Button
            testID={TEST_IDS.PERSON_DETAIL.ADD_GIFT_BUTTON}
            title="+ Add"
            onPress={handleAddGift}
            variant="ghost"
            size="sm"
          />
        </View>

        {gifts.length > 0 ? (
          <FlatList
            testID={TEST_IDS.PERSON_DETAIL.GIFT_LIST}
            data={gifts}
            renderItem={renderGift}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.giftSeparator} />}
          />
        ) : (
          renderGiftsEmpty()
        )}
      </View>

      {/* History Link */}
      {giftsHistory.length > 0 && (
        <Card style={styles.section} onPress={handleViewHistory}>
          <View style={styles.historyCard}>
            <Text
              style={[
                styles.historyText,
                { color: theme.colors.text, fontSize: theme.fontSize.md },
              ]}
            >
              View Gift History
            </Text>
            <Badge label={`${giftsHistory.length} gifts given`} variant="success" />
          </View>
        </Card>
      )}

      {/* Bottom spacing */}
      <View style={{ height: insets.bottom + 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    padding: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  personName: {
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  editButton: {
    marginTop: 16,
    padding: 8,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  sizeBadge: {
    marginRight: 8,
    marginBottom: 8,
  },
  notes: {
    lineHeight: 20,
  },
  giftCard: {
    padding: 12,
  },
  giftCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftInfo: {
    flex: 1,
  },
  giftName: {
    fontWeight: '500',
    marginBottom: 4,
  },
  giftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftPrice: {
    marginLeft: 8,
  },
  giftSeparator: {
    height: 8,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyText: {
    fontWeight: '500',
  },
});

export default PersonDetailScreen;
