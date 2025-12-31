import React, { useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/theme';
import { useGiftsStore, usePeopleStore, useOccasionsStore } from '@/store';
import { Button, Card, Badge } from '@/components/common';
import { TEST_IDS } from '@/constants/testIDs';
import {
  GIFT_CATEGORIES,
  GIFT_PRIORITIES,
  GIFT_STATUSES,
  GIFT_SOURCES,
} from '@/constants/categories';
import { GiftStatus, Currency } from '@/types';
import type { RootStackScreenProps } from '@/navigation/types';

type ScreenProps = RootStackScreenProps<'GiftDetail'>;

const STATUS_TRANSITIONS: Record<GiftStatus, GiftStatus[]> = {
  [GiftStatus.IDEA]: [GiftStatus.PURCHASED],
  [GiftStatus.PURCHASED]: [GiftStatus.WRAPPED, GiftStatus.HIDDEN, GiftStatus.RETURNED],
  [GiftStatus.WRAPPED]: [GiftStatus.HIDDEN, GiftStatus.GIVEN],
  [GiftStatus.HIDDEN]: [GiftStatus.GIVEN],
  [GiftStatus.GIVEN]: [],
  [GiftStatus.RETURNED]: [],
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
  [Currency.CAD]: 'C$',
  [Currency.AUD]: 'A$',
  [Currency.JPY]: '¥',
};

export const GiftDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ScreenProps['navigation']>();
  const route = useRoute<ScreenProps['route']>();
  const { giftId } = route.params;

  const getGift = useGiftsStore((state) => state.getGift);
  const updateGift = useGiftsStore((state) => state.updateGift);
  const deleteGift = useGiftsStore((state) => state.deleteGift);
  const getPerson = usePeopleStore((state) => state.getPerson);
  const getOccasion = useOccasionsStore((state) => state.getOccasion);

  const gift = getGift(giftId);
  const person = gift ? getPerson(gift.personId) : undefined;
  const occasion = gift?.occasionId ? getOccasion(gift.occasionId) : undefined;

  const categoryInfo = useMemo(
    () => GIFT_CATEGORIES.find((c) => c.value === gift?.category),
    [gift?.category]
  );
  const priorityInfo = useMemo(
    () => GIFT_PRIORITIES.find((p) => p.value === gift?.priority),
    [gift?.priority]
  );
  const statusInfo = useMemo(
    () => GIFT_STATUSES.find((s) => s.value === gift?.status),
    [gift?.status]
  );
  const sourceInfo = useMemo(
    () => GIFT_SOURCES.find((s) => s.value === gift?.source),
    [gift?.source]
  );

  const availableTransitions = useMemo(() => {
    if (!gift) return [];
    return STATUS_TRANSITIONS[gift.status] || [];
  }, [gift]);

  const handleEdit = useCallback(() => {
    if (!gift) return;
    navigation.navigate('GiftForm', { personId: gift.personId, giftId: gift.id });
  }, [gift, navigation]);

  const handleDelete = useCallback(() => {
    if (!gift) return;
    Alert.alert(
      'Delete Gift',
      `Are you sure you want to delete "${gift.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteGift(gift.id);
            navigation.goBack();
          },
        },
      ]
    );
  }, [gift, deleteGift, navigation]);

  const handleStatusChange = useCallback(
    (newStatus: GiftStatus) => {
      if (!gift) return;
      updateGift(gift.id, { status: newStatus });
    },
    [gift, updateGift]
  );

  const handleOpenUrl = useCallback(async () => {
    if (!gift?.url) return;
    try {
      const canOpen = await Linking.canOpenURL(gift.url);
      if (canOpen) {
        await Linking.openURL(gift.url);
      } else {
        Alert.alert('Error', 'Unable to open this URL');
      }
    } catch {
      Alert.alert('Error', 'Failed to open URL');
    }
  }, [gift?.url]);

  if (!gift) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        testID={TEST_IDS.GIFT_DETAIL.SCREEN}
      >
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Gift not found
        </Text>
      </View>
    );
  }

  const currencySymbol = CURRENCY_SYMBOLS[gift.currency] || '$';

  return (
    <ScrollView
      testID={TEST_IDS.GIFT_DETAIL.SCREEN}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header with status */}
      <Card style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.headerInfo}>
            <Text
              testID={TEST_IDS.GIFT_DETAIL.NAME_TEXT}
              style={[styles.giftName, { color: theme.colors.text }]}
            >
              {gift.name}
            </Text>
            {person && (
              <Text style={[styles.personName, { color: theme.colors.textSecondary }]}>
                For {person.name}
              </Text>
            )}
          </View>
          {statusInfo && (
            <Badge
              testID={TEST_IDS.GIFT_DETAIL.STATUS_BADGE}
              label={statusInfo.label}
              backgroundColor={statusInfo.color}
            />
          )}
        </View>

        {gift.price !== undefined && (
          <Text
            testID={TEST_IDS.GIFT_DETAIL.PRICE_TEXT}
            style={[styles.price, { color: theme.colors.text }]}
          >
            {currencySymbol}
            {gift.price.toFixed(2)}
          </Text>
        )}
      </Card>

      {/* Status Actions */}
      {availableTransitions.length > 0 && (
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Update Status
          </Text>
          <View style={styles.statusButtons}>
            {availableTransitions.map((status) => {
              const info = GIFT_STATUSES.find((s) => s.value === status);
              return (
                <TouchableOpacity
                  key={status}
                  testID={`${TEST_IDS.GIFT_DETAIL.STATUS_BUTTON}-${status}`}
                  onPress={() => handleStatusChange(status)}
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor: info?.color || theme.colors.primary,
                    },
                  ]}
                >
                  <Text style={styles.statusButtonText}>
                    Mark as {info?.label || status}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>
      )}

      {/* Details */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Details</Text>

        {gift.description && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Description
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {gift.description}
            </Text>
          </View>
        )}

        {categoryInfo && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Category
            </Text>
            <Badge label={categoryInfo.label} backgroundColor={categoryInfo.color} size="sm" />
          </View>
        )}

        {priorityInfo && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Priority
            </Text>
            <Badge label={priorityInfo.label} backgroundColor={priorityInfo.color} size="sm" />
          </View>
        )}

        {sourceInfo && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Source
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {sourceInfo.label}
            </Text>
          </View>
        )}

        {occasion && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Occasion
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {occasion.name}
            </Text>
          </View>
        )}

        {gift.status === GiftStatus.HIDDEN && gift.hidingSpot && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Hiding Spot
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {gift.hidingSpot}
            </Text>
          </View>
        )}
      </Card>

      {/* URL Link */}
      {gift.url && (
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Link</Text>
          <TouchableOpacity
            testID={TEST_IDS.GIFT_DETAIL.URL_LINK}
            onPress={handleOpenUrl}
            style={[styles.urlButton, { borderColor: theme.colors.border }]}
          >
            <Text
              style={[styles.urlText, { color: theme.colors.primary }]}
              numberOfLines={1}
            >
              {gift.url}
            </Text>
            <Text style={[styles.urlIcon, { color: theme.colors.primary }]}>↗</Text>
          </TouchableOpacity>
        </Card>
      )}

      {/* Notes */}
      {gift.notes && (
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notes</Text>
          <Text style={[styles.notes, { color: theme.colors.textSecondary }]}>
            {gift.notes}
          </Text>
        </Card>
      )}

      {/* Timestamps */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>History</Text>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            Created
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            {new Date(gift.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {gift.dateGiven && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Given
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {new Date(gift.dateGiven).toLocaleDateString()}
            </Text>
          </View>
        )}
      </Card>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          testID={TEST_IDS.GIFT_DETAIL.EDIT_BUTTON}
          title="Edit Gift"
          onPress={handleEdit}
          fullWidth
        />
        <Button
          testID={TEST_IDS.GIFT_DETAIL.DELETE_BUTTON}
          title="Delete Gift"
          onPress={handleDelete}
          variant="danger"
          fullWidth
          style={styles.deleteButton}
        />
      </View>
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
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  headerCard: {
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
    marginRight: 12,
  },
  giftName: {
    fontSize: 24,
    fontWeight: '700',
  },
  personName: {
    fontSize: 14,
    marginTop: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 12,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  urlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  urlText: {
    flex: 1,
    fontSize: 14,
  },
  urlIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  notes: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    marginTop: 8,
  },
  deleteButton: {
    marginTop: 12,
  },
});

export default GiftDetailScreen;
