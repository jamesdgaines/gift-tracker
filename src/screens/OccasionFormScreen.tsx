import React, { useState, useCallback } from 'react';
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
import { useOccasionsStore, usePeopleStore, useSettingsStore } from '@/store';
import { Button, Input, Card } from '@/components/common';
import { TEST_IDS } from '@/constants/testIDs';
import { OCCASION_TYPES } from '@/constants/occasions';
import { OccasionFormData, OccasionType, Currency } from '@/types';
import type { RootStackScreenProps } from '@/navigation/types';

type ScreenProps = RootStackScreenProps<'OccasionForm'>;

const defaultFormData: OccasionFormData = {
  personId: '',
  name: '',
  type: OccasionType.BIRTHDAY,
  date: new Date().toISOString().split('T')[0],
  isRecurring: true,
  reminderDays: 7,
  budgetAmount: undefined,
  budgetCurrency: Currency.USD,
  notes: '',
};

interface TypeSelectorProps {
  selected: OccasionType;
  onSelect: (value: OccasionType) => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({ selected, onSelect }) => {
  const theme = useTheme();

  return (
    <View style={styles.typeSection}>
      <Text
        style={[
          styles.optionLabel,
          { color: theme.colors.text, fontSize: theme.fontSize.sm },
        ]}
      >
        Occasion Type
      </Text>
      <View style={styles.typeButtons}>
        {OCCASION_TYPES.map((type) => (
          <TouchableOpacity
            key={type.value}
            testID={`occasionForm-type-${type.value}`}
            onPress={() => onSelect(type.value)}
            style={[
              styles.typeButton,
              {
                backgroundColor:
                  selected === type.value
                    ? type.color
                    : theme.colors.backgroundTertiary,
                borderColor:
                  selected === type.value ? type.color : theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.typeButtonText,
                {
                  color:
                    selected === type.value
                      ? '#FFFFFF'
                      : theme.colors.textSecondary,
                  fontSize: theme.fontSize.xs,
                },
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export const OccasionFormScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ScreenProps['navigation']>();
  const route = useRoute<ScreenProps['route']>();
  const { occasionId, personId: defaultPersonId } = route.params || {};

  const getOccasion = useOccasionsStore((state) => state.getOccasion);
  const addOccasion = useOccasionsStore((state) => state.addOccasion);
  const updateOccasion = useOccasionsStore((state) => state.updateOccasion);
  const deleteOccasion = useOccasionsStore((state) => state.deleteOccasion);
  const people = usePeopleStore((state) => state.people);
  const defaultCurrency = useSettingsStore((state) => state.defaultCurrency);

  const existingOccasion = occasionId ? getOccasion(occasionId) : undefined;
  const isEditing = !!existingOccasion;

  const [formData, setFormData] = useState<OccasionFormData>(
    existingOccasion
      ? {
          personId: existingOccasion.personId,
          name: existingOccasion.name,
          type: existingOccasion.type,
          date: existingOccasion.date.split('T')[0],
          isRecurring: existingOccasion.isRecurring,
          reminderDays: existingOccasion.reminderDays,
          budgetAmount: existingOccasion.budgetAmount,
          budgetCurrency: existingOccasion.budgetCurrency,
          notes: existingOccasion.notes,
        }
      : {
          ...defaultFormData,
          personId: defaultPersonId || '',
          budgetCurrency: defaultCurrency,
        }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const updateField = useCallback(
    <K extends keyof OccasionFormData>(field: K, value: OccasionFormData[K]) => {
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
      newErrors.name = 'Occasion name is required';
    }

    if (!formData.personId) {
      newErrors.personId = 'Please select a person';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
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
      if (isEditing && occasionId) {
        updateOccasion(occasionId, formData);
      } else {
        addOccasion(formData);
      }

      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to save occasion. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [formData, validateForm, isEditing, occasionId, updateOccasion, addOccasion, navigation]);

  const handleDelete = useCallback(() => {
    if (!occasionId) return;

    Alert.alert(
      'Delete Occasion',
      `Are you sure you want to delete "${formData.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteOccasion(occasionId);
            navigation.goBack();
          },
        },
      ]
    );
  }, [occasionId, formData.name, deleteOccasion, navigation]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        testID={TEST_IDS.OCCASION_FORM.MODAL}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Person Selector */}
        <Card style={styles.section}>
          <Text
            style={[
              styles.optionLabel,
              { color: theme.colors.text, fontSize: theme.fontSize.sm },
            ]}
          >
            For Person
          </Text>
          {people.length === 0 ? (
            <Text style={[styles.noPersonsText, { color: theme.colors.textSecondary }]}>
              No people added yet. Add a person first.
            </Text>
          ) : (
            <View style={styles.personButtons}>
              {people.map((person) => (
                <TouchableOpacity
                  key={person.id}
                  testID={`occasionForm-person-${person.id}`}
                  onPress={() => updateField('personId', person.id)}
                  style={[
                    styles.personButton,
                    {
                      backgroundColor:
                        formData.personId === person.id
                          ? theme.colors.primary
                          : theme.colors.backgroundTertiary,
                      borderColor:
                        formData.personId === person.id
                          ? theme.colors.primary
                          : theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.personButtonText,
                      {
                        color:
                          formData.personId === person.id
                            ? '#FFFFFF'
                            : theme.colors.textSecondary,
                        fontSize: theme.fontSize.sm,
                      },
                    ]}
                  >
                    {person.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {errors.personId && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.personId}
            </Text>
          )}
        </Card>

        {/* Occasion Type */}
        <Card style={styles.section}>
          <TypeSelector
            selected={formData.type}
            onSelect={(value) => {
              updateField('type', value);
              // Auto-fill name based on type if empty
              if (!formData.name.trim()) {
                const typeInfo = OCCASION_TYPES.find((t) => t.value === value);
                if (typeInfo) {
                  updateField('name', typeInfo.label);
                }
              }
            }}
          />
        </Card>

        {/* Basic Info */}
        <Card style={styles.section}>
          <Input
            testID={TEST_IDS.OCCASION_FORM.NAME_INPUT}
            label="Occasion Name"
            placeholder="e.g., Birthday, Christmas, Anniversary"
            value={formData.name}
            onChangeText={(text) => updateField('name', text)}
            error={errors.name}
            required
          />

          <Input
            testID={TEST_IDS.OCCASION_FORM.DATE_PICKER}
            label="Date"
            placeholder="YYYY-MM-DD"
            value={formData.date}
            onChangeText={(text) => updateField('date', text)}
            error={errors.date}
            keyboardType="numbers-and-punctuation"
            required
          />
        </Card>

        {/* Recurring Toggle */}
        <Card style={styles.section}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>
                Recurring Yearly
              </Text>
              <Text style={[styles.toggleDescription, { color: theme.colors.textSecondary }]}>
                This occasion repeats every year
              </Text>
            </View>
            <TouchableOpacity
              testID={TEST_IDS.OCCASION_FORM.RECURRING_TOGGLE}
              onPress={() => updateField('isRecurring', !formData.isRecurring)}
              style={[
                styles.toggle,
                {
                  backgroundColor: formData.isRecurring
                    ? theme.colors.primary
                    : theme.colors.backgroundTertiary,
                },
              ]}
            >
              <View
                style={[
                  styles.toggleKnob,
                  {
                    backgroundColor: '#FFFFFF',
                    transform: [{ translateX: formData.isRecurring ? 20 : 0 }],
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Budget */}
        <Card style={styles.section}>
          <Input
            testID={TEST_IDS.OCCASION_FORM.BUDGET_INPUT}
            label="Budget (Optional)"
            placeholder="0.00"
            value={formData.budgetAmount?.toString() || ''}
            onChangeText={(text) => {
              const num = parseFloat(text);
              updateField('budgetAmount', isNaN(num) ? undefined : num);
            }}
            keyboardType="decimal-pad"
          />
        </Card>

        {/* Notes */}
        <Card style={styles.section}>
          <Input
            testID="occasionForm-input-notes"
            label="Notes (Optional)"
            placeholder="Any additional details..."
            value={formData.notes}
            onChangeText={(text) => updateField('notes', text)}
            multiline
            numberOfLines={3}
          />
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            testID={TEST_IDS.OCCASION_FORM.SAVE_BUTTON}
            title={isEditing ? 'Save Changes' : 'Add Occasion'}
            onPress={handleSave}
            loading={isSaving}
            fullWidth
          />
          <Button
            testID={TEST_IDS.OCCASION_FORM.CANCEL_BUTTON}
            title="Cancel"
            onPress={handleCancel}
            variant="outline"
            fullWidth
            style={styles.cancelButton}
          />
          {isEditing && (
            <Button
              title="Delete Occasion"
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
  section: {
    marginBottom: 16,
    padding: 16,
  },
  optionLabel: {
    fontWeight: '500',
    marginBottom: 8,
  },
  typeSection: {
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  typeButtonText: {
    fontWeight: '500',
  },
  personButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  personButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  personButtonText: {
    fontWeight: '500',
  },
  noPersonsText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  toggleDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 5,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
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

export default OccasionFormScreen;
