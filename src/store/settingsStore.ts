import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings, Currency, AdState } from '@/types';

interface SettingsState extends UserSettings {
  adState: AdState;
  hapticsEnabled: boolean;
}

interface SettingsActions {
  // Theme
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Notifications
  setNotificationsEnabled: (enabled: boolean) => void;
  setDefaultReminderDays: (days: number) => void;

  // Haptics
  setHapticsEnabled: (enabled: boolean) => void;

  // Currency
  setDefaultCurrency: (currency: Currency) => void;

  // Onboarding
  setHasSeenOnboarding: (seen: boolean) => void;

  // Ads consent
  setAdsConsent: (consent: boolean | null) => void;
  updateAdState: (state: Partial<AdState>) => void;

  // Interstitial tracking
  recordInterstitialShown: () => void;
  canShowInterstitial: (frequencyCapMinutes: number) => boolean;

  // Reset
  reset: () => void;
}

const initialAdState: AdState = {
  isInitialized: false,
  consentStatus: 'unknown',
  lastInterstitialTime: null,
  adsEnabled: true,
};

const initialState: SettingsState = {
  theme: 'system',
  notificationsEnabled: true,
  defaultReminderDays: 14,
  defaultCurrency: Currency.USD,
  hasSeenOnboarding: false,
  adsConsent: null,
  adsConsentDate: undefined,
  adState: initialAdState,
  hapticsEnabled: true,
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Theme
      setTheme: (theme: 'light' | 'dark' | 'system'): void => {
        set({ theme });
      },

      // Notifications
      setNotificationsEnabled: (enabled: boolean): void => {
        set({ notificationsEnabled: enabled });
      },

      setDefaultReminderDays: (days: number): void => {
        set({ defaultReminderDays: days });
      },

      // Haptics
      setHapticsEnabled: (enabled: boolean): void => {
        set({ hapticsEnabled: enabled });
      },

      // Currency
      setDefaultCurrency: (currency: Currency): void => {
        set({ defaultCurrency: currency });
      },

      // Onboarding
      setHasSeenOnboarding: (seen: boolean): void => {
        set({ hasSeenOnboarding: seen });
      },

      // Ads consent
      setAdsConsent: (consent: boolean | null): void => {
        set({
          adsConsent: consent,
          adsConsentDate: consent !== null ? new Date().toISOString() : undefined,
          adState: {
            ...get().adState,
            consentStatus: consent === null ? 'unknown' : consent ? 'granted' : 'denied',
          },
        });
      },

      updateAdState: (state: Partial<AdState>): void => {
        set((current) => ({
          adState: {
            ...current.adState,
            ...state,
          },
        }));
      },

      // Interstitial tracking
      recordInterstitialShown: (): void => {
        set((state) => ({
          adState: {
            ...state.adState,
            lastInterstitialTime: Date.now(),
          },
        }));
      },

      canShowInterstitial: (frequencyCapMinutes: number): boolean => {
        const { adState, adsConsent } = get();

        // Don't show if ads are disabled or no consent
        if (!adState.adsEnabled || adsConsent === false) {
          return false;
        }

        // If never shown, allow
        if (adState.lastInterstitialTime === null) {
          return true;
        }

        // Check frequency cap
        const timeSinceLastAd = Date.now() - adState.lastInterstitialTime;
        const frequencyCapMs = frequencyCapMinutes * 60 * 1000;

        return timeSinceLastAd >= frequencyCapMs;
      },

      // Reset
      reset: (): void => {
        set(initialState);
      },
    }),
    {
      name: 'gift-tracker-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selectors
export const selectTheme = (state: SettingsState & SettingsActions) => state.theme;
export const selectNotificationsEnabled = (state: SettingsState & SettingsActions) =>
  state.notificationsEnabled;
export const selectDefaultCurrency = (state: SettingsState & SettingsActions) =>
  state.defaultCurrency;
export const selectAdsConsent = (state: SettingsState & SettingsActions) => state.adsConsent;
export const selectAdState = (state: SettingsState & SettingsActions) => state.adState;
