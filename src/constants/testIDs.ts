/**
 * Centralized testID constants for end-to-end testing.
 * All testIDs follow the pattern: {screen}-{component}-{identifier}
 */

export const TEST_IDS = {
  // Home Screen
  HOME: {
    SCREEN: 'home-screen',
    ADD_PERSON_BUTTON: 'home-button-addPerson',
    SEARCH_INPUT: 'home-input-search',
    PERSON_LIST: 'home-list-people',
    PERSON_CARD: (id: string) => `home-card-person-${id}`,
    FILTER_BUTTON: 'home-button-filter',
    FILTER_MODAL: 'home-modal-filter',
    EMPTY_STATE: 'home-emptyState',
    LOADING: 'home-loading',
  },

  // Person Detail Screen
  PERSON_DETAIL: {
    SCREEN: 'personDetail-screen',
    NAME_TEXT: 'personDetail-text-name',
    PHOTO: 'personDetail-image-photo',
    EDIT_BUTTON: 'personDetail-button-edit',
    DELETE_BUTTON: 'personDetail-button-delete',
    ADD_GIFT_BUTTON: 'personDetail-button-addGift',
    GIFT_LIST: 'personDetail-list-gifts',
    GIFT_CARD: (id: string) => `personDetail-card-gift-${id}`,
    BUDGET_PROGRESS: 'personDetail-progress-budget',
    BUDGET_TEXT: 'personDetail-text-budget',
    RELATIONSHIP_BADGE: 'personDetail-badge-relationship',
    DATES_SECTION: 'personDetail-section-dates',
    NOTES_SECTION: 'personDetail-section-notes',
    TABS: {
      GIFTS: 'personDetail-tab-gifts',
      HISTORY: 'personDetail-tab-history',
      NOTES: 'personDetail-tab-notes',
    },
  },

  // Person Form
  PERSON_FORM: {
    MODAL: 'personForm-modal',
    SCREEN: 'personForm-screen',
    NAME_INPUT: 'personForm-input-name',
    PHOTO_BUTTON: 'personForm-button-photo',
    PHOTO_PREVIEW: 'personForm-image-preview',
    RELATIONSHIP_PICKER: 'personForm-picker-relationship',
    BIRTHDAY_INPUT: 'personForm-input-birthday',
    ANNIVERSARY_INPUT: 'personForm-input-anniversary',
    CUSTOM_DATE_BUTTON: 'personForm-button-addCustomDate',
    NOTES_INPUT: 'personForm-input-notes',
    SIZE_SHIRT_INPUT: 'personForm-input-sizeShirt',
    SIZE_PANTS_INPUT: 'personForm-input-sizePants',
    SIZE_SHOE_INPUT: 'personForm-input-sizeShoe',
    SIZE_RING_INPUT: 'personForm-input-sizeRing',
    SAVE_BUTTON: 'personForm-button-save',
    CANCEL_BUTTON: 'personForm-button-cancel',
    DELETE_BUTTON: 'personForm-button-delete',
  },

  // Gift Detail Screen
  GIFT_DETAIL: {
    SCREEN: 'giftDetail-screen',
    NAME_TEXT: 'giftDetail-text-name',
    PRICE_TEXT: 'giftDetail-text-price',
    STATUS_BADGE: 'giftDetail-badge-status',
    PRIORITY_BADGE: 'giftDetail-badge-priority',
    CATEGORY_BADGE: 'giftDetail-badge-category',
    URL_LINK: 'giftDetail-link-url',
    PHOTO_GALLERY: 'giftDetail-gallery-photos',
    PHOTO_IMAGE: (index: number) => `giftDetail-image-photo-${index}`,
    VOICE_NOTE_PLAYER: 'giftDetail-player-voiceNote',
    NOTES_TEXT: 'giftDetail-text-notes',
    SOURCE_TEXT: 'giftDetail-text-source',
    HIDING_SPOT_TEXT: 'giftDetail-text-hidingSpot',
    EDIT_BUTTON: 'giftDetail-button-edit',
    DELETE_BUTTON: 'giftDetail-button-delete',
    STATUS_BUTTON: 'giftDetail-button-changeStatus',
  },

  // Gift Form
  GIFT_FORM: {
    MODAL: 'giftForm-modal',
    SCREEN: 'giftForm-screen',
    NAME_INPUT: 'giftForm-input-name',
    URL_INPUT: 'giftForm-input-url',
    PRICE_INPUT: 'giftForm-input-price',
    CURRENCY_PICKER: 'giftForm-picker-currency',
    PRIORITY_PICKER: 'giftForm-picker-priority',
    CATEGORY_PICKER: 'giftForm-picker-category',
    STATUS_PICKER: 'giftForm-picker-status',
    OCCASION_PICKER: 'giftForm-picker-occasion',
    NOTES_INPUT: 'giftForm-input-notes',
    SOURCE_PICKER: 'giftForm-picker-source',
    HIDING_SPOT_INPUT: 'giftForm-input-hidingSpot',
    SAVE_BUTTON: 'giftForm-button-save',
    CANCEL_BUTTON: 'giftForm-button-cancel',
    PHOTO_BUTTON: 'giftForm-button-addPhoto',
    PHOTO_PREVIEW: (index: number) => `giftForm-image-preview-${index}`,
    REMOVE_PHOTO_BUTTON: (index: number) => `giftForm-button-removePhoto-${index}`,
    VOICE_BUTTON: 'giftForm-button-addVoice',
    VOICE_RECORDING_INDICATOR: 'giftForm-indicator-recording',
    VOICE_PREVIEW: 'giftForm-player-voicePreview',
    REMOVE_VOICE_BUTTON: 'giftForm-button-removeVoice',
  },

  // Status Change Modal
  STATUS_MODAL: {
    MODAL: 'statusModal-modal',
    TITLE: 'statusModal-text-title',
    OPTION: (status: string) => `statusModal-option-${status}`,
    HIDING_SPOT_INPUT: 'statusModal-input-hidingSpot',
    DATE_PICKER: 'statusModal-picker-date',
    REACTION_PICKER: 'statusModal-picker-reaction',
    CONFIRM_BUTTON: 'statusModal-button-confirm',
    CANCEL_BUTTON: 'statusModal-button-cancel',
  },

  // Occasions Screen
  OCCASIONS: {
    SCREEN: 'occasions-screen',
    ADD_BUTTON: 'occasions-button-add',
    OCCASION_LIST: 'occasions-list',
    OCCASION_CARD: (id: string) => `occasions-card-${id}`,
    FILTER_TABS: {
      ALL: 'occasions-tab-all',
      UPCOMING: 'occasions-tab-upcoming',
      PAST: 'occasions-tab-past',
    },
    EMPTY_STATE: 'occasions-emptyState',
  },

  // Occasion Detail Screen
  OCCASION_DETAIL: {
    SCREEN: 'occasionDetail-screen',
    NAME_TEXT: 'occasionDetail-text-name',
    DATE_TEXT: 'occasionDetail-text-date',
    COUNTDOWN_TEXT: 'occasionDetail-text-countdown',
    PERSON_TEXT: 'occasionDetail-text-person',
    GIFT_LIST: 'occasionDetail-list-gifts',
    GIFT_CARD: (id: string) => `occasionDetail-card-gift-${id}`,
    ADD_GIFT_BUTTON: 'occasionDetail-button-addGift',
    EDIT_BUTTON: 'occasionDetail-button-edit',
    DELETE_BUTTON: 'occasionDetail-button-delete',
    BUDGET_SECTION: 'occasionDetail-section-budget',
  },

  // Occasion Form
  OCCASION_FORM: {
    MODAL: 'occasionForm-modal',
    NAME_INPUT: 'occasionForm-input-name',
    TYPE_PICKER: 'occasionForm-picker-type',
    DATE_PICKER: 'occasionForm-picker-date',
    PERSON_PICKER: 'occasionForm-picker-person',
    RECURRING_TOGGLE: 'occasionForm-toggle-recurring',
    REMINDER_PICKER: 'occasionForm-picker-reminder',
    BUDGET_INPUT: 'occasionForm-input-budget',
    SAVE_BUTTON: 'occasionForm-button-save',
    CANCEL_BUTTON: 'occasionForm-button-cancel',
  },

  // Reports Screen
  REPORTS: {
    SCREEN: 'reports-screen',
    TAB_PERSON: 'reports-tab-person',
    TAB_OCCASION: 'reports-tab-occasion',
    TAB_YEAR: 'reports-tab-year',
    TAB_CATEGORY: 'reports-tab-category',
    CHART_CONTAINER: 'reports-chart-container',
    TOTAL_SPENT_TEXT: 'reports-text-totalSpent',
    BUDGET_SUMMARY: 'reports-summary-budget',
    PERSON_LIST: 'reports-list-persons',
    PERSON_ROW: (id: string) => `reports-row-person-${id}`,
    DATE_RANGE_PICKER: 'reports-picker-dateRange',
    EXPORT_BUTTON: 'reports-button-export',
  },

  // Settings Screen
  SETTINGS: {
    SCREEN: 'settings-screen',
    THEME_TOGGLE: 'settings-toggle-theme',
    NOTIFICATIONS_TOGGLE: 'settings-toggle-notifications',
    REMINDER_DAYS_PICKER: 'settings-picker-reminderDays',
    CURRENCY_PICKER: 'settings-picker-currency',
    EXPORT_BUTTON: 'settings-button-export',
    IMPORT_BUTTON: 'settings-button-import',
    BACKUP_BUTTON: 'settings-button-backup',
    RESTORE_BUTTON: 'settings-button-restore',
    PRIVACY_BUTTON: 'settings-button-privacy',
    AD_CONSENT_BUTTON: 'settings-button-adConsent',
    ABOUT_BUTTON: 'settings-button-about',
    SIGN_OUT_BUTTON: 'settings-button-signOut',
    DELETE_ACCOUNT_BUTTON: 'settings-button-deleteAccount',
  },

  // Gift History Screen
  GIFT_HISTORY: {
    SCREEN: 'giftHistory-screen',
    FILTER_BUTTON: 'giftHistory-button-filter',
    SORT_BUTTON: 'giftHistory-button-sort',
    GIFT_LIST: 'giftHistory-list-gifts',
    GIFT_CARD: (id: string) => `giftHistory-card-gift-${id}`,
    EMPTY_STATE: 'giftHistory-emptyState',
  },

  // Common Components
  COMMON: {
    BUTTON: (id: string) => `common-button-${id}`,
    INPUT: (id: string) => `common-input-${id}`,
    CARD: (id: string) => `common-card-${id}`,
    MODAL: (id: string) => `common-modal-${id}`,
    AVATAR: (id: string) => `common-avatar-${id}`,
    BADGE: (id: string) => `common-badge-${id}`,
    PROGRESS_BAR: (id: string) => `common-progressBar-${id}`,
    EMPTY_STATE: (id: string) => `common-emptyState-${id}`,
    LOADING: (id: string) => `common-loading-${id}`,
    ERROR: (id: string) => `common-error-${id}`,
    CONFIRM_MODAL: {
      MODAL: 'common-confirmModal',
      TITLE: 'common-confirmModal-title',
      MESSAGE: 'common-confirmModal-message',
      CONFIRM_BUTTON: 'common-confirmModal-button-confirm',
      CANCEL_BUTTON: 'common-confirmModal-button-cancel',
    },
  },

  // Navigation
  NAV: {
    TAB_BAR: 'nav-tabBar',
    TAB_HOME: 'nav-tab-home',
    TAB_OCCASIONS: 'nav-tab-occasions',
    TAB_REPORTS: 'nav-tab-reports',
    TAB_SETTINGS: 'nav-tab-settings',
    HEADER_BACK: 'nav-header-back',
    HEADER_TITLE: 'nav-header-title',
  },

  // Ads
  ADS: {
    BANNER: {
      CONTAINER: (screen: string) => `ad-banner-container-${screen}`,
      HOME: 'ad-banner-home',
      PERSON_LIST: 'ad-banner-personList',
      GIFT_HISTORY: 'ad-banner-giftHistory',
      REPORTS: 'ad-banner-reports',
    },
    INTERSTITIAL: {
      CONTAINER: 'ad-interstitial-container',
      CLOSE_BUTTON: 'ad-interstitial-button-close',
    },
    REWARDED: {
      PROMPT_MODAL: 'ad-rewarded-modal-prompt',
      WATCH_BUTTON: 'ad-rewarded-button-watch',
      SKIP_BUTTON: 'ad-rewarded-button-skip',
      SUCCESS_MESSAGE: 'ad-rewarded-text-success',
    },
    CONSENT: {
      MODAL: 'ad-consent-modal',
      TITLE: 'ad-consent-title',
      DESCRIPTION: 'ad-consent-description',
      ACCEPT_BUTTON: 'ad-consent-button-accept',
      DECLINE_BUTTON: 'ad-consent-button-decline',
      MANAGE_BUTTON: 'ad-consent-button-manage',
      PRIVACY_LINK: 'ad-consent-link-privacy',
    },
  },

  // Auth (for future)
  AUTH: {
    LOGIN_SCREEN: 'auth-screen-login',
    REGISTER_SCREEN: 'auth-screen-register',
    EMAIL_INPUT: 'auth-input-email',
    PASSWORD_INPUT: 'auth-input-password',
    CONFIRM_PASSWORD_INPUT: 'auth-input-confirmPassword',
    LOGIN_BUTTON: 'auth-button-login',
    REGISTER_BUTTON: 'auth-button-register',
    FORGOT_PASSWORD_LINK: 'auth-link-forgotPassword',
    GOOGLE_BUTTON: 'auth-button-google',
    APPLE_BUTTON: 'auth-button-apple',
  },

  // Quick Capture
  QUICK_CAPTURE: {
    FAB: 'quickCapture-fab',
    MENU: 'quickCapture-menu',
    PHOTO_OPTION: 'quickCapture-option-photo',
    VOICE_OPTION: 'quickCapture-option-voice',
    LINK_OPTION: 'quickCapture-option-link',
    MANUAL_OPTION: 'quickCapture-option-manual',
  },

  // Search & Filter
  SEARCH: {
    INPUT: 'search-input',
    CLEAR_BUTTON: 'search-button-clear',
    RESULTS_LIST: 'search-list-results',
    RESULT_ITEM: (id: string) => `search-item-${id}`,
    NO_RESULTS: 'search-emptyState-noResults',
  },

  FILTER: {
    MODAL: 'filter-modal',
    RELATIONSHIP_OPTION: (value: string) => `filter-option-relationship-${value}`,
    STATUS_OPTION: (value: string) => `filter-option-status-${value}`,
    PRIORITY_OPTION: (value: string) => `filter-option-priority-${value}`,
    CATEGORY_OPTION: (value: string) => `filter-option-category-${value}`,
    APPLY_BUTTON: 'filter-button-apply',
    RESET_BUTTON: 'filter-button-reset',
    CLOSE_BUTTON: 'filter-button-close',
  },
} as const;

export type TestIDKey = keyof typeof TEST_IDS;
