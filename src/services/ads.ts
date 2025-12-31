import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AD_UNIT_IDS,
  AD_CONFIG,
  AD_UX_GUIDELINES,
  REWARDS,
} from '@/constants/adConfig';

// Storage keys
const STORAGE_KEYS = {
  LAST_INTERSTITIAL: '@ads/lastInterstitial',
  SESSION_INTERSTITIALS: '@ads/sessionInterstitials',
  AD_FREE_UNTIL: '@ads/adFreeUntil',
  USER_CONSENT: '@ads/userConsent',
  TRIGGER_TIMESTAMPS: '@ads/triggerTimestamps',
};

// Ad state management
interface AdState {
  isInitialized: boolean;
  lastInterstitialTime: number;
  sessionInterstitialCount: number;
  appStartTime: number;
  adFreeUntil: number;
  userConsent: boolean | null;
  triggerTimestamps: Record<string, number>;
}

let adState: AdState = {
  isInitialized: false,
  lastInterstitialTime: 0,
  sessionInterstitialCount: 0,
  appStartTime: Date.now(),
  adFreeUntil: 0,
  userConsent: null,
  triggerTimestamps: {},
};

// Get the appropriate ad unit ID for the current platform
export const getAdUnitId = (type: 'banner' | 'interstitial' | 'rewarded'): string => {
  const platform = Platform.OS as 'ios' | 'android';
  return AD_UNIT_IDS[type][platform] || AD_UNIT_IDS[type].android;
};

// Initialize ad service
export const initializeAds = async (): Promise<void> => {
  try {
    // Load persisted state
    const [
      lastInterstitial,
      adFreeUntil,
      userConsent,
      triggerTimestamps,
    ] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.LAST_INTERSTITIAL),
      AsyncStorage.getItem(STORAGE_KEYS.AD_FREE_UNTIL),
      AsyncStorage.getItem(STORAGE_KEYS.USER_CONSENT),
      AsyncStorage.getItem(STORAGE_KEYS.TRIGGER_TIMESTAMPS),
    ]);

    adState = {
      ...adState,
      isInitialized: true,
      lastInterstitialTime: lastInterstitial ? parseInt(lastInterstitial, 10) : 0,
      adFreeUntil: adFreeUntil ? parseInt(adFreeUntil, 10) : 0,
      userConsent: userConsent ? userConsent === 'true' : null,
      triggerTimestamps: triggerTimestamps ? JSON.parse(triggerTimestamps) : {},
    };

    // Reset session count on new app launch
    adState.sessionInterstitialCount = 0;
    adState.appStartTime = Date.now();
  } catch (error) {
    console.error('Failed to initialize ads:', error);
    adState.isInitialized = true;
  }
};

// Check if user is in ad-free period
export const isAdFree = (): boolean => {
  return Date.now() < adState.adFreeUntil;
};

// Check if we should show banner ads
export const shouldShowBannerAd = (screenName: string): boolean => {
  if (isAdFree()) return false;
  if (adState.userConsent === false) return false;
  return AD_CONFIG.bannerScreens.includes(screenName);
};

// Check if we can show an interstitial ad
export const canShowInterstitial = (trigger: keyof typeof AD_CONFIG.interstitialTriggers): boolean => {
  if (isAdFree()) return false;
  if (adState.userConsent === false) return false;

  const now = Date.now();

  // Check app start grace period
  if (now - adState.appStartTime < AD_UX_GUIDELINES.APP_START_GRACE_PERIOD_MS) {
    return false;
  }

  // Check session limit
  if (adState.sessionInterstitialCount >= AD_UX_GUIDELINES.MAX_INTERSTITIALS_PER_SESSION) {
    return false;
  }

  // Check minimum interval
  if (now - adState.lastInterstitialTime < AD_UX_GUIDELINES.MIN_INTERSTITIAL_INTERVAL_MS) {
    return false;
  }

  // Check trigger-specific configuration
  const triggerConfig = AD_CONFIG.interstitialTriggers[trigger];
  if (!triggerConfig?.enabled) {
    return false;
  }

  // Check trigger-specific frequency cap
  const lastTriggerTime = adState.triggerTimestamps[trigger] || 0;
  const frequencyCapMs = triggerConfig.frequencyCapMinutes * 60 * 1000;
  if (now - lastTriggerTime < frequencyCapMs) {
    return false;
  }

  return true;
};

// Record that an interstitial was shown
export const recordInterstitialShown = async (
  trigger: keyof typeof AD_CONFIG.interstitialTriggers
): Promise<void> => {
  const now = Date.now();

  adState.lastInterstitialTime = now;
  adState.sessionInterstitialCount++;
  adState.triggerTimestamps[trigger] = now;

  // Persist to storage
  await Promise.all([
    AsyncStorage.setItem(STORAGE_KEYS.LAST_INTERSTITIAL, now.toString()),
    AsyncStorage.setItem(
      STORAGE_KEYS.TRIGGER_TIMESTAMPS,
      JSON.stringify(adState.triggerTimestamps)
    ),
  ]);
};

// Grant ad-free period after watching rewarded ad
export const grantAdFreePeriod = async (hours: number = REWARDS.AD_FREE_DURATION_HOURS): Promise<void> => {
  const adFreeUntil = Date.now() + hours * 60 * 60 * 1000;
  adState.adFreeUntil = adFreeUntil;
  await AsyncStorage.setItem(STORAGE_KEYS.AD_FREE_UNTIL, adFreeUntil.toString());
};

// Set user consent
export const setUserConsent = async (consent: boolean): Promise<void> => {
  adState.userConsent = consent;
  await AsyncStorage.setItem(STORAGE_KEYS.USER_CONSENT, consent.toString());
};

// Get user consent status
export const getUserConsent = (): boolean | null => {
  return adState.userConsent;
};

// Check if consent is required (for GDPR regions)
export const isConsentRequired = async (): Promise<boolean> => {
  // In a real app, you would check the user's region
  // For now, we'll assume consent is always required
  return adState.userConsent === null;
};

// Ad event callbacks type
export interface AdCallbacks {
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: Error) => void;
  onAdOpened?: () => void;
  onAdClosed?: () => void;
  onAdRewarded?: (reward: { type: string; amount: number }) => void;
}

// Note: Actual ad loading would be implemented using react-native-google-mobile-ads
// This service provides the logic layer that wraps around the ad SDK

export default {
  initializeAds,
  getAdUnitId,
  isAdFree,
  shouldShowBannerAd,
  canShowInterstitial,
  recordInterstitialShown,
  grantAdFreePeriod,
  setUserConsent,
  getUserConsent,
  isConsentRequired,
};
