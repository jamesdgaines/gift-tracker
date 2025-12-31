import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/theme';
import { usePeopleStore, useSettingsStore } from '@/store';
import { Button, Input, Card } from '@/components/common';
import { TEST_IDS } from '@/constants/testIDs';
import { RELATIONSHIPS } from '@/constants/categories';
import { PersonFormData, RelationshipCategory, Currency, PersonDate } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import type { RootStackScreenProps } from '@/navigation/types';

type ScreenProps = RootStackScreenProps<'PersonForm'>;

const defaultFormData: PersonFormData = {
  name: '',
  photoUri: undefined,
  relationship: RelationshipCategory.FRIEND,
  customRelationship: undefined,
  dates: [],
  notes: '',
  sizes: {},
  interests: [],
  allergies: [],
  budgetAmount: undefined,
  budgetCurrency: Currency.USD,
};

export const PersonFormScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ScreenProps['navigation']>();
  const route = useRoute<ScreenProps['route']>();
  const { personId } = route.params || {};

  const getPerson = usePeopleStore((state) => state.getPerson);
  const addPerson = usePeopleStore((state) => state.addPerson);
  const updatePerson = usePeopleStore((state) => state.updatePerson);
  const deletePerson = usePeopleStore((state) => state.deletePerson);
  const defaultCurrency = useSettingsStore((state) => state.defaultCurrency);

  const existingPerson = personId ? getPerson(personId) : undefined;
  const isEditing = !!existingPerson;

  const [formData, setFormData] = useState<PersonFormData>(
    existingPerson
      ? {
          name: existingPerson.name,
          photoUri: existingPerson.photoUri,
          relationship: existingPerson.relationship,
          customRelationship: existingPerson.customRelationship,
          dates: existingPerson.dates,
          notes: existingPerson.notes,
          sizes: existingPerson.sizes,
          interests: existingPerson.interests,
          allergies: existingPerson.allergies,
          budgetAmount: existingPerson.budgetAmount,
          budgetCurrency: existingPerson.budgetCurrency,
        }
      : { ...defaultFormData, budgetCurrency: defaultCurrency }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [birthdayInput, setBirthdayInput] = useState('');

  // Initialize birthday input from existing data
  useEffect(() => {
    const birthdayDate = formData.dates.find((d) => d.label === 'Birthday');
    if (birthdayDate) {
      setBirthdayInput(birthdayDate.date);
    }
  }, []);

  const updateField = useCallback(<K extends keyof PersonFormData>(
    field: K,
    value: PersonFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (
      formData.relationship === RelationshipCategory.OTHER &&
      !formData.customRelationship?.trim()
    ) {
      newErrors.customRelationship = 'Please specify the relationship';
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
      // Process birthday
      const dates: PersonDate[] = [...formData.dates.filter((d) => d.label !== 'Birthday')];
      if (birthdayInput) {
        dates.push({
          id: uuidv4(),
          label: 'Birthday',
          date: birthdayInput,
          isRecurring: true,
        });
      }

      const dataToSave: PersonFormData = {
        ...formData,
        dates,
      };

      if (isEditing && personId) {
        updatePerson(personId, dataToSave);
      } else {
        addPerson(dataToSave);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [formData, birthdayInput, validateForm, isEditing, personId, updatePerson, addPerson, navigation]);

  const handleDelete = useCallback(() => {
    if (!personId) return;

    Alert.alert(
      'Delete Person',
      `Are you sure you want to delete ${formData.name}? This will also delete all their gift data.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deletePerson(personId);
            navigation.goBack();
          },
        },
      ]
    );
  }, [personId, formData.name, deletePerson, navigation]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        testID={TEST_IDS.PERSON_FORM.SCREEN}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Info */}
        <Card style={styles.section}>
          <Input
            testID={TEST_IDS.PERSON_FORM.NAME_INPUT}
            label="Name"
            placeholder="Enter name"
            value={formData.name}
            onChangeText={(text) => updateField('name', text)}
            error={errors.name}
            required
            autoCapitalize="words"
          />

          {/* Relationship Selection */}
          <View style={styles.relationshipContainer}>
            <View style={styles.relationshipLabel}>
              <Input
                label="Relationship"
                placeholder=""
                value=""
                editable={false}
                containerStyle={styles.relationshipLabelInput}
              />
            </View>
            <View style={styles.relationshipButtons}>
              {RELATIONSHIPS.map((rel) => (
                <Button
                  key={rel.value}
                  testID={`personForm-button-relationship-${rel.value}`}
                  title={rel.label}
                  onPress={() => updateField('relationship', rel.value)}
                  variant={formData.relationship === rel.value ? 'primary' : 'outline'}
                  size="sm"
                  style={styles.relationshipButton}
                />
              ))}
            </View>
          </View>

          {formData.relationship === RelationshipCategory.OTHER && (
            <Input
              label="Custom Relationship"
              placeholder="e.g., Neighbor, Teacher"
              value={formData.customRelationship || ''}
              onChangeText={(text) => updateField('customRelationship', text)}
              error={errors.customRelationship}
            />
          )}
        </Card>

        {/* Dates */}
        <Card style={styles.section}>
          <Input
            testID={TEST_IDS.PERSON_FORM.BIRTHDAY_INPUT}
            label="Birthday"
            placeholder="YYYY-MM-DD"
            value={birthdayInput}
            onChangeText={setBirthdayInput}
            hint="Format: YYYY-MM-DD (e.g., 1990-05-15)"
          />
        </Card>

        {/* Sizes */}
        <Card style={styles.section}>
          <View style={styles.sizesGrid}>
            <View style={styles.sizeField}>
              <Input
                testID={TEST_IDS.PERSON_FORM.SIZE_SHIRT_INPUT}
                label="Shirt Size"
                placeholder="e.g., M, L, XL"
                value={formData.sizes.shirt || ''}
                onChangeText={(text) =>
                  updateField('sizes', { ...formData.sizes, shirt: text })
                }
              />
            </View>
            <View style={styles.sizeField}>
              <Input
                testID={TEST_IDS.PERSON_FORM.SIZE_PANTS_INPUT}
                label="Pants Size"
                placeholder="e.g., 32, 34"
                value={formData.sizes.pants || ''}
                onChangeText={(text) =>
                  updateField('sizes', { ...formData.sizes, pants: text })
                }
              />
            </View>
          </View>
          <View style={styles.sizesGrid}>
            <View style={styles.sizeField}>
              <Input
                testID={TEST_IDS.PERSON_FORM.SIZE_SHOE_INPUT}
                label="Shoe Size"
                placeholder="e.g., 10, 11"
                value={formData.sizes.shoe || ''}
                onChangeText={(text) =>
                  updateField('sizes', { ...formData.sizes, shoe: text })
                }
              />
            </View>
            <View style={styles.sizeField}>
              <Input
                testID={TEST_IDS.PERSON_FORM.SIZE_RING_INPUT}
                label="Ring Size"
                placeholder="e.g., 7, 8"
                value={formData.sizes.ring || ''}
                onChangeText={(text) =>
                  updateField('sizes', { ...formData.sizes, ring: text })
                }
              />
            </View>
          </View>
        </Card>

        {/* Notes */}
        <Card style={styles.section}>
          <Input
            testID={TEST_IDS.PERSON_FORM.NOTES_INPUT}
            label="Notes"
            placeholder="Preferences, interests, allergies, things they've mentioned wanting..."
            value={formData.notes}
            onChangeText={(text) => updateField('notes', text)}
            multiline
            numberOfLines={4}
          />
        </Card>

        {/* Budget */}
        <Card style={styles.section}>
          <Input
            label="Annual Budget (Optional)"
            placeholder="e.g., 100"
            value={formData.budgetAmount?.toString() || ''}
            onChangeText={(text) => {
              const num = parseFloat(text);
              updateField('budgetAmount', isNaN(num) ? undefined : num);
            }}
            keyboardType="decimal-pad"
            hint="Set a yearly spending limit for this person"
          />
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            testID={TEST_IDS.PERSON_FORM.SAVE_BUTTON}
            title={isEditing ? 'Save Changes' : 'Add Person'}
            onPress={handleSave}
            loading={isSaving}
            fullWidth
          />
          <Button
            testID={TEST_IDS.PERSON_FORM.CANCEL_BUTTON}
            title="Cancel"
            onPress={handleCancel}
            variant="outline"
            fullWidth
            style={styles.cancelButton}
          />
          {isEditing && (
            <Button
              testID={TEST_IDS.PERSON_FORM.DELETE_BUTTON}
              title="Delete Person"
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
  relationshipContainer: {
    marginBottom: 16,
  },
  relationshipLabel: {
    marginBottom: -8,
  },
  relationshipLabelInput: {
    marginBottom: 0,
  },
  relationshipButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -8,
  },
  relationshipButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  sizesGrid: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  sizeField: {
    flex: 1,
    paddingHorizontal: 8,
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

export default PersonFormScreen;
