import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/theme';
import { useGiftsStore, usePeopleStore, useOccasionsStore, useSettingsStore } from '@/store';
import { Button, Input, Card, Badge } from '@/components/common';
import { TEST_IDS } from '@/constants/testIDs';
import {
  GIFT_CATEGORIES,
  GIFT_PRIORITIES,
  GIFT_STATUSES,
  GIFT_SOURCES,
} from '@/constants/categories';
import {
  GiftFormData,
  GiftStatus,
  GiftPriority,
  GiftCategory,
  GiftSource,
  Currency,
} from '@/types';
import type { RootStackScreenProps } from '@/navigation/types';

type ScreenProps = RootStackScreenProps<'GiftForm'>;

const defaultFormData: GiftFormData = {
  personId: '',
  name: '',
  description: '',
  url: '',
  price: undefined,
  currency: Currency.USD,
  priority: GiftPriority.MEDIUM,
  category: GiftCategory.OTHER,
  status: GiftStatus.IDEA,
  occasionId: undefined,
  photos: [],
  voiceNotes: [],
  notes: '',
  source: GiftSource.OTHER,
  hidingSpot: '',
  receiptUri: undefined,
  returnDeadline: undefined,
  isRegift: false,
};

interface OptionSelectorProps<T extends string> {
  label: string;
  options: { value: T; label: string; color?: string }[];
  selected: T;
  onSelect: (value: T) => void;
  testIDPrefix: string;
}

function OptionSelector<T extends string>({
  label,
  options,
  selected,
  onSelect,
  testIDPrefix,
}: OptionSelectorProps<T>) {
  const theme = useTheme();

  return (
    <View style={styles.optionSection}>
      <Text
        style={[
          styles.optionLabel,
          { color: theme.colors.text, fontSize: theme.fontSize.sm },
        ]}
      >
        {label}
      </Text>
      <View style={styles.optionButtons}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            testID={`${testIDPrefix}-${opt.value}`}
            onPress={() => onSelect(opt.value)}
            style={[
              styles.optionButton,
              {
                backgroundColor:
                  selected === opt.value
                    ? opt.color || theme.colors.primary
                    : theme.colors.backgroundTertiary,
                borderColor:
                  selected === opt.value
                    ? opt.color || theme.colors.primary
                    : theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.optionButtonText,
                {
                  color:
                    selected === opt.value
                      ? '#FFFFFF'
                      : theme.colors.textSecondary,
                  fontSize: theme.fontSize.xs,
                },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export const GiftFormScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ScreenProps['navigation']>();
  const route = useRoute<ScreenProps['route']>();
  const { personId, giftId, occasionId: defaultOccasionId } = route.params;

  const getGift = useGiftsStore((state) => state.getGift);
  const addGift = useGiftsStore((state) => state.addGift);
  const updateGift = useGiftsStore((state) => state.updateGift);
  const deleteGift = useGiftsStore((state) => state.deleteGift);
  const getPerson = usePeopleStore((state) => state.getPerson);
  const getOccasionsByPerson = useOccasionsStore((state) => state.getOccasionsByPerson);
  const defaultCurrency = useSettingsStore((state) => state.defaultCurrency);

  const existingGift = giftId ? getGift(giftId) : undefined;
  const isEditing = !!existingGift;
  const person = getPerson(personId);
  const occasions = getOccasionsByPerson(personId);

  const [formData, setFormData] = useState<GiftFormData>(
    existingGift
      ? {
          personId: existingGift.personId,
          name: existingGift.name,
          description: existingGift.description,
          url: existingGift.url,
          price: existingGift.price,
          currency: existingGift.currency,
          priority: existingGift.priority,
          category: existingGift.category,
          status: existingGift.status,
          occasionId: existingGift.occasionId,
          photos: existingGift.photos,
          voiceNotes: existingGift.voiceNotes,
          notes: existingGift.notes,
          source: existingGift.source,
          hidingSpot: existingGift.hidingSpot || '',
          receiptUri: existingGift.receiptUri,
          returnDeadline: existingGift.returnDeadline,
          isRegift: existingGift.isRegift,
        }
      : {
          ...defaultFormData,
          personId,
          currency: defaultCurrency,
          occasionId: defaultOccasionId,
        }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const updateField = useCallback(
    <K extends keyof GiftFormData>(field: K, value: GiftFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Gift name is required';
    }

    if (formData.status === GiftStatus.HIDDEN && !formData.hidingSpot?.trim()) {
      newErrors.hidingSpot = 'Please specify where the gift is hidden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing && giftId) {
        updateGift(giftId, formData);
      } else {
        addGift(formData);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save gift. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [formData, validateForm, isEditing, giftId, updateGift, addGift, navigation]);

  const handleDelete = useCallback(() => {
    if (!giftId) return;

    Alert.alert(
      'Delete Gift',
      `Are you sure you want to delete "${formData.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteGift(giftId);
            navigation.goBack();
          },
        },
      ]
    );
  }, [giftId, formData.name, deleteGift, navigation]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        testID={TEST_IDS.GIFT_FORM.SCREEN}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Person Info */}
        {person && (
          <View style={styles.personInfo}>
            <Text style={[styles.personLabel, { color: theme.colors.textSecondary }]}>
              Gift for:
            </Text>
            <Text style={[styles.personName, { color: theme.colors.text }]}>
              {person.name}
            </Text>
          </View>
        )}

        {/* Basic Info */}
        <Card style={styles.section}>
          <Input
            testID={TEST_IDS.GIFT_FORM.NAME_INPUT}
            label="Gift Name"
            placeholder="What's the gift idea?"
            value={formData.name}
            onChangeText={(text) => updateField('name', text)}
            error={errors.name}
            required
          />

          <Input
            testID={TEST_IDS.GIFT_FORM.URL_INPUT}
            label="Link (Optional)"
            placeholder="https://..."
            value={formData.url || ''}
            onChangeText={(text) => updateField('url', text)}
            keyboardType="url"
            autoCapitalize="none"
          />

          <Input
            testID={TEST_IDS.GIFT_FORM.PRICE_INPUT}
            label="Price (Optional)"
            placeholder="0.00"
            value={formData.price?.toString() || ''}
            onChangeText={(text) => {
              const num = parseFloat(text);
              updateField('price', isNaN(num) ? undefined : num);
            }}
            keyboardType="decimal-pad"
          />
        </Card>

        {/* Priority */}
        <Card style={styles.section}>
          <OptionSelector
            label="Priority"
            options={GIFT_PRIORITIES}
            selected={formData.priority}
            onSelect={(value) => updateField('priority', value)}
            testIDPrefix="giftForm-priority"
          />
        </Card>

        {/* Category */}
        <Card style={styles.section}>
          <OptionSelector
            label="Category"
            options={GIFT_CATEGORIES}
            selected={formData.category}
            onSelect={(value) => updateField('category', value)}
            testIDPrefix="giftForm-category"
          />
        </Card>

        {/* Status */}
        <Card style={styles.section}>
          <OptionSelector
            label="Status"
            options={GIFT_STATUSES}
            selected={formData.status}
            onSelect={(value) => updateField('status', value)}
            testIDPrefix="giftForm-status"
          />

          {formData.status === GiftStatus.HIDDEN && (
            <Input
              testID={TEST_IDS.GIFT_FORM.HIDING_SPOT_INPUT}
              label="Hiding Spot"
              placeholder="Where is it hidden?"
              value={formData.hidingSpot || ''}
              onChangeText={(text) => updateField('hidingSpot', text)}
              error={errors.hidingSpot}
              containerStyle={styles.hidingSpotInput}
            />
          )}
        </Card>

        {/* Source */}
        <Card style={styles.section}>
          <OptionSelector
            label="Where did this idea come from?"
            options={GIFT_SOURCES}
            selected={formData.source}
            onSelect={(value) => updateField('source', value)}
            testIDPrefix="giftForm-source"
          />
        </Card>

        {/* Occasion (if person has occasions) */}
        {occasions.length > 0 && (
          <Card style={styles.section}>
            <Text
              style={[
                styles.optionLabel,
                { color: theme.colors.text, fontSize: theme.fontSize.sm },
              ]}
            >
              Assign to Occasion (Optional)
            </Text>
            <View style={styles.optionButtons}>
              <TouchableOpacity
                onPress={() => updateField('occasionId', undefined)}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: !formData.occasionId
                      ? theme.colors.primary
                      : theme.colors.backgroundTertiary,
                    borderColor: !formData.occasionId
                      ? theme.colors.primary
                      : theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    {
                      color: !formData.occasionId ? '#FFFFFF' : theme.colors.textSecondary,
                      fontSize: theme.fontSize.xs,
                    },
                  ]}
                >
                  None
                </Text>
              </TouchableOpacity>
              {occasions.map((occ) => (
                <TouchableOpacity
                  key={occ.id}
                  onPress={() => updateField('occasionId', occ.id)}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor:
                        formData.occasionId === occ.id
                          ? theme.colors.primary
                          : theme.colors.backgroundTertiary,
                      borderColor:
                        formData.occasionId === occ.id
                          ? theme.colors.primary
                          : theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      {
                        color:
                          formData.occasionId === occ.id
                            ? '#FFFFFF'
                            : theme.colors.textSecondary,
                        fontSize: theme.fontSize.xs,
                      },
                    ]}
                  >
                    {occ.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {/* Notes */}
        <Card style={styles.section}>
          <Input
            testID={TEST_IDS.GIFT_FORM.NOTES_INPUT}
            label="Notes (Optional)"
            placeholder="Additional details, color preferences, size info..."
            value={formData.notes}
            onChangeText={(text) => updateField('notes', text)}
            multiline
            numberOfLines={3}
          />
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            testID={TEST_IDS.GIFT_FORM.SAVE_BUTTON}
            title={isEditing ? 'Save Changes' : 'Add Gift'}
            onPress={handleSave}
            loading={isSaving}
            fullWidth
          />
          <Button
            testID={TEST_IDS.GIFT_FORM.CANCEL_BUTTON}
            title="Cancel"
            onPress={handleCancel}
            variant="outline"
            fullWidth
            style={styles.cancelButton}
          />
          {isEditing && (
            <Button
              title="Delete Gift"
              onPress={handleDelete}
              variant="danger"
              fullWidth
              style={styles.deleteButton}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  personInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  personLabel: {
    marginRight: 8,
  },
  personName: {
    fontWeight: '600',
    fontSize: 16,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  optionSection: {
    marginBottom: 8,
  },
  optionLabel: {
    fontWeight: '500',
    marginBottom: 8,
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonText: {
    fontWeight: '500',
  },
  hidingSpotInput: {
    marginTop: 12,
    marginBottom: 0,
  },
  actions: {
    marginTop: 8,
  },
  cancelButton: {
    marginTop: 12,
  },
  deleteButton: {
    marginTop: 24,
  },
});

export default GiftFormScreen;
