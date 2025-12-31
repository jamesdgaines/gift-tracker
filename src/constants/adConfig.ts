import { AdConfig } from '@/types';

// Test ad unit IDs - replace with production IDs before release
export const AD_UNIT_IDS = {
  // Test IDs provided by Google for development
  banner: {
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
  },
  interstitial: {
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712',
  },
  rewarded: {
    ios: 'ca-app-pub-3940256099942544/1712485313',
    android: 'ca-app-pub-3940256099942544/5224354917',
  },
  // TODO: Replace with production IDs before release
  // Production IDs should be stored securely and not committed to source control
  // Consider using environment variables or a secrets manager
};

export const AD_CONFIG: AdConfig = {
  // Screens that should show banner ads
  bannerScreens: ['home', 'personList', 'giftHistory', 'reports'],

  // Interstitial ad trigger configuration
  interstitialTriggers: {
    personAdded: {
      enabled: true,
      frequencyCapMinutes: 5, // Don't show more than once every 5 minutes
    },
    giftGiven: {
      enabled: true,
      frequencyCapMinutes: 3, // Celebration moment, slightly higher frequency allowed
    },
    sessionReturn: {
      enabled: true,
      frequencyCapMinutes: 10, // When user returns to home after completing task
    },
  },

  // Features that can be unlocked via rewarded ads
  rewardedFeatures: ['exportData', 'removeAdsTemporary', 'cloudBackup'],
};

// Banner ad sizes
export const BANNER_SIZES = {
  STANDARD: { width: 320, height: 50 },
  LARGE: { width: 320, height: 100 },
  MEDIUM_RECTANGLE: { width: 300, height: 250 },
  SMART: 'smart', // Adapts to screen width
} as const;

// Rewarded ad rewards
export const REWARDS = {
  AD_FREE_DURATION_HOURS: 1, // Hours of ad-free experience after watching rewarded ad
  EXPORT_ENABLED_HOURS: 24, // Hours export feature is enabled after watching
  CLOUD_BACKUP_ENABLED_HOURS: 24,
} as const;

// Screens where ads should NOT be shown (forms, modals, sensitive moments)
export const AD_EXCLUDED_SCREENS = [
  'personForm',
  'giftForm',
  'occasionForm',
  'statusModal',
  'confirmModal',
];

// User experience guidelines
export const AD_UX_GUIDELINES = {
  // Minimum time between interstitials (regardless of trigger type)
  MIN_INTERSTITIAL_INTERVAL_MS: 60000, // 1 minute absolute minimum
  // Don't show interstitials within X seconds of app start
  APP_START_GRACE_PERIOD_MS: 30000, // 30 seconds
  // Maximum interstitials per session
  MAX_INTERSTITIALS_PER_SESSION: 5,
  // Minimum spacing from interactive elements (for banner ads)
  BANNER_SAFE_AREA_PX: 20,
} as const;

// Privacy and compliance
export const CONSENT_CONFIG = {
  // Regions requiring GDPR consent
  gdprRegions: ['EU', 'EEA', 'UK'],
  // Default consent state for non-GDPR regions
  defaultConsent: true,
  // Link to privacy policy
  privacyPolicyUrl: 'https://example.com/privacy', // TODO: Update with actual URL
  // Support for consent modification
  allowConsentModification: true,
} as const;
