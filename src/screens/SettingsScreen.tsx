import React, { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { useTheme } from '@/theme';
import { useSettingsStore, usePeopleStore, useGiftsStore, useOccasionsStore } from '@/store';
import { Card } from '@/components/common';
import { TEST_IDS } from '@/constants/testIDs';
import { Currency } from '@/types';

const CURRENCY_OPTIONS: { value: Currency; label: string; symbol: string }[] = [
  { value: Currency.USD, label: 'US Dollar', symbol: '$' },
  { value: Currency.EUR, label: 'Euro', symbol: '€' },
  { value: Currency.GBP, label: 'British Pound', symbol: '£' },
  { value: Currency.CAD, label: 'Canadian Dollar', symbol: 'C$' },
  { value: Currency.AUD, label: 'Australian Dollar', symbol: 'A$' },
];

interface SettingRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  isToggle?: boolean;
  toggleValue?: boolean;
  testID?: string;
}

const SettingRow: React.FC<SettingRowProps> = ({
  label,
  value,
  onPress,
  isToggle,
  toggleValue,
  testID,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      testID={testID}
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{label}</Text>
      {isToggle ? (
        <View
          style={[
            styles.toggle,
            {
              backgroundColor: toggleValue
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
                transform: [{ translateX: toggleValue ? 20 : 0 }],
              },
            ]}
          />
        </View>
      ) : (
        <View style={styles.settingValueContainer}>
          {value && (
            <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
              {value}
            </Text>
          )}
          {onPress && (
            <Text style={[styles.chevron, { color: theme.colors.textTertiary }]}>›</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export const SettingsScreen: React.FC = () => {
  const theme = useTheme();

  const settings = useSettingsStore();
  const people = usePeopleStore((state) => state.people);
  const gifts = useGiftsStore((state) => state.gifts);
  const occasions = useOccasionsStore((state) => state.occasions);
  const resetPeople = usePeopleStore((state) => state.reset);
  const resetGifts = useGiftsStore((state) => state.reset);
  const resetOccasions = useOccasionsStore((state) => state.reset);

  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const currentCurrency = CURRENCY_OPTIONS.find((c) => c.value === settings.defaultCurrency);

  const handleToggleNotifications = useCallback(() => {
    settings.setNotificationsEnabled(!settings.notificationsEnabled);
  }, [settings]);

  const handleToggleDarkMode = useCallback(() => {
    settings.setTheme(settings.theme === 'dark' ? 'light' : 'dark');
  }, [settings]);

  const handleToggleHaptics = useCallback(() => {
    settings.setHapticsEnabled(!settings.hapticsEnabled);
  }, [settings]);

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      settings.setDefaultCurrency(currency);
      setShowCurrencyPicker(false);
    },
    [settings]
  );

  const handleExportData = useCallback(async () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        people,
        gifts,
        occasions,
        settings: {
          defaultCurrency: settings.defaultCurrency,
          notificationsEnabled: settings.notificationsEnabled,
          theme: settings.theme,
        },
      };

      const jsonString = JSON.stringify(exportData, null, 2);

      await Share.share({
        message: jsonString,
        title: 'Gift Tracker Export',
      });
    } catch {
      Alert.alert('Export Failed', 'Unable to export data. Please try again.');
    }
  }, [people, gifts, occasions, settings]);

  const handleClearData = useCallback(() => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your people, gifts, and occasions. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            resetPeople();
            resetGifts();
            resetOccasions();
            Alert.alert('Data Cleared', 'All data has been deleted.');
          },
        },
      ]
    );
  }, [resetPeople, resetGifts, resetOccasions]);

  const handlePrivacyPolicy = useCallback(() => {
    Alert.alert('Privacy Policy', 'Privacy policy will be available in the full release.');
  }, []);

  const handleTermsOfService = useCallback(() => {
    Alert.alert('Terms of Service', 'Terms of service will be available in the full release.');
  }, []);

  const handleRateApp = useCallback(() => {
    Alert.alert('Rate App', 'App store rating will be available after release.');
  }, []);

  const handleContactSupport = useCallback(() => {
    Alert.alert('Contact Support', 'Support contact will be available in the full release.');
  }, []);

  return (
    <ScrollView
      testID={TEST_IDS.SETTINGS.SCREEN}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Preferences */}
      <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>
        PREFERENCES
      </Text>
      <Card style={styles.section}>
        <SettingRow
          testID={TEST_IDS.SETTINGS.THEME_TOGGLE}
          label="Dark Mode"
          isToggle
          toggleValue={settings.theme === 'dark'}
          onPress={handleToggleDarkMode}
        />
        <SettingRow
          testID={TEST_IDS.SETTINGS.NOTIFICATIONS_TOGGLE}
          label="Notifications"
          isToggle
          toggleValue={settings.notificationsEnabled}
          onPress={handleToggleNotifications}
        />
        <SettingRow
          testID={TEST_IDS.SETTINGS.HAPTICS_TOGGLE}
          label="Haptic Feedback"
          isToggle
          toggleValue={settings.hapticsEnabled}
          onPress={handleToggleHaptics}
        />
        <SettingRow
          testID={TEST_IDS.SETTINGS.CURRENCY_PICKER}
          label="Default Currency"
          value={currentCurrency ? `${currentCurrency.symbol} ${currentCurrency.label}` : 'USD'}
          onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
        />
      </Card>

      {/* Currency Picker */}
      {showCurrencyPicker && (
        <Card style={styles.pickerSection}>
          {CURRENCY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              testID={TEST_IDS.SETTINGS.CURRENCY_OPTION(option.value)}
              style={[
                styles.pickerOption,
                settings.defaultCurrency === option.value && {
                  backgroundColor: theme.colors.primaryLight,
                },
              ]}
              onPress={() => handleCurrencySelect(option.value)}
            >
              <Text
                style={[
                  styles.pickerOptionText,
                  {
                    color:
                      settings.defaultCurrency === option.value
                        ? theme.colors.primary
                        : theme.colors.text,
                  },
                ]}
              >
                {option.symbol} {option.label}
              </Text>
              {settings.defaultCurrency === option.value && (
                <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </Card>
      )}

      {/* Data */}
      <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>
        DATA
      </Text>
      <Card style={styles.section}>
        <SettingRow
          testID={TEST_IDS.SETTINGS.EXPORT_BUTTON}
          label="Export Data"
          onPress={handleExportData}
        />
        <SettingRow
          testID={TEST_IDS.SETTINGS.CLEAR_DATA_BUTTON}
          label="Clear All Data"
          onPress={handleClearData}
        />
      </Card>

      {/* Stats */}
      <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>
        STATISTICS
      </Text>
      <Card style={styles.section}>
        <View style={styles.statsRow}>
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
              {gifts.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Gifts
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

      {/* About */}
      <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>
        ABOUT
      </Text>
      <Card style={styles.section}>
        <SettingRow label="Version" value="1.0.0" />
        <SettingRow label="Privacy Policy" onPress={handlePrivacyPolicy} />
        <SettingRow label="Terms of Service" onPress={handleTermsOfService} />
        <SettingRow label="Rate the App" onPress={handleRateApp} />
        <SettingRow label="Contact Support" onPress={handleContactSupport} />
      </Card>

      {/* Footer */}
      <Text style={[styles.footer, { color: theme.colors.textTertiary }]}>
        Gift Tracker © 2024
      </Text>
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
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
  },
  section: {
    padding: 0,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 15,
    marginRight: 8,
  },
  chevron: {
    fontSize: 22,
    fontWeight: '300',
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
  pickerSection: {
    padding: 0,
    marginTop: -8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  pickerOptionText: {
    fontSize: 15,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 12,
  },
});

export default SettingsScreen;
