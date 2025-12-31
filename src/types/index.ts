/**
 * Core type definitions for the Gift Tracker app
 */

// ============================================
// Enums
// ============================================

export enum GiftStatus {
  IDEA = 'idea',
  PURCHASED = 'purchased',
  WRAPPED = 'wrapped',
  HIDDEN = 'hidden',
  GIVEN = 'given',
  RETURNED = 'returned',
}

export enum GiftPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  MUST_HAVE = 'must_have',
}

export enum GiftCategory {
  CLOTHING = 'clothing',
  ELECTRONICS = 'electronics',
  BOOKS = 'books',
  EXPERIENCES = 'experiences',
  HOMEMADE = 'homemade',
  HOME_DECOR = 'home_decor',
  JEWELRY = 'jewelry',
  TOYS_GAMES = 'toys_games',
  SPORTS_OUTDOORS = 'sports_outdoors',
  BEAUTY = 'beauty',
  FOOD_DRINK = 'food_drink',
  GIFT_CARD = 'gift_card',
  OTHER = 'other',
}

export enum GiftSource {
  MENTIONED = 'mentioned',
  WISHLIST = 'wishlist',
  ONLINE = 'online',
  RECOMMENDATION = 'recommendation',
  STORE = 'store',
  OTHER = 'other',
}

export enum RelationshipCategory {
  FAMILY = 'family',
  FRIEND = 'friend',
  COWORKER = 'coworker',
  PARTNER = 'partner',
  OTHER = 'other',
}

export enum OccasionType {
  BIRTHDAY = 'birthday',
  CHRISTMAS = 'christmas',
  HANUKKAH = 'hanukkah',
  ANNIVERSARY = 'anniversary',
  VALENTINES_DAY = 'valentines_day',
  MOTHERS_DAY = 'mothers_day',
  FATHERS_DAY = 'fathers_day',
  GRADUATION = 'graduation',
  WEDDING = 'wedding',
  BABY_SHOWER = 'baby_shower',
  HOUSEWARMING = 'housewarming',
  CUSTOM = 'custom',
}

export enum GiftReaction {
  LOVED_IT = 'loved_it',
  LIKED_IT = 'liked_it',
  MEH = 'meh',
  DIDNT_LIKE = 'didnt_like',
  UNKNOWN = 'unknown',
}

export enum ReminderTiming {
  ONE_WEEK = '1_week',
  TWO_WEEKS = '2_weeks',
  ONE_MONTH = '1_month',
  TWO_MONTHS = '2_months',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  CAD = 'CAD',
  AUD = 'AUD',
  JPY = 'JPY',
}

// ============================================
// Base Types
// ============================================

export interface BaseEntity {
  id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// ============================================
// Person Types
// ============================================

export interface PersonSizes {
  shirt?: string;
  pants?: string;
  shoe?: string;
  ring?: string;
}

export interface PersonDate {
  id: string;
  label: string; // e.g., "Birthday", "Anniversary", custom labels
  date: string; // ISO date string (just date portion)
  isRecurring: boolean;
}

export interface Person extends BaseEntity {
  userId: string; // Owner of this person record
  name: string;
  photoUri?: string;
  relationship: RelationshipCategory;
  customRelationship?: string; // If relationship is OTHER
  dates: PersonDate[];
  notes: string;
  sizes: PersonSizes;
  interests: string[];
  allergies: string[];
  budgetAmount?: number;
  budgetCurrency: Currency;
}

export interface PersonFormData {
  name: string;
  photoUri?: string;
  relationship: RelationshipCategory;
  customRelationship?: string;
  dates: PersonDate[];
  notes: string;
  sizes: PersonSizes;
  interests: string[];
  allergies: string[];
  budgetAmount?: number;
  budgetCurrency: Currency;
}

// ============================================
// Gift Types
// ============================================

export interface GiftPhoto {
  id: string;
  uri: string;
  thumbnailUri?: string;
  createdAt: string;
}

export interface VoiceNote {
  id: string;
  uri: string;
  duration: number; // in seconds
  createdAt: string;
}

export interface StatusHistory {
  status: GiftStatus;
  date: string;
  notes?: string;
}

export interface Gift extends BaseEntity {
  userId: string;
  personId: string;
  name: string;
  description?: string;
  url?: string;
  price?: number;
  currency: Currency;
  priority: GiftPriority;
  category: GiftCategory;
  status: GiftStatus;
  statusHistory: StatusHistory[];
  occasionId?: string;
  photos: GiftPhoto[];
  voiceNotes: VoiceNote[];
  notes: string;
  source: GiftSource;
  hidingSpot?: string; // Used when status is HIDDEN
  receiptUri?: string;
  returnDeadline?: string; // ISO date string
  reaction?: GiftReaction; // Set after gift is given
  dateGiven?: string; // ISO date string
  isRegift: boolean; // If this is a regifted item
}

export interface GiftFormData {
  personId: string;
  name: string;
  description?: string;
  url?: string;
  price?: number;
  currency: Currency;
  priority: GiftPriority;
  category: GiftCategory;
  status: GiftStatus;
  occasionId?: string;
  photos: GiftPhoto[];
  voiceNotes: VoiceNote[];
  notes: string;
  source: GiftSource;
  hidingSpot?: string;
  receiptUri?: string;
  returnDeadline?: string;
  isRegift: boolean;
}

// ============================================
// Occasion Types
// ============================================

export interface Occasion extends BaseEntity {
  userId: string;
  personId?: string; // Optional: occasion can be for a specific person
  name: string;
  type: OccasionType;
  date: string; // ISO date string
  isRecurring: boolean;
  reminderDays: number; // Days before to remind
  budgetAmount?: number;
  budgetCurrency: Currency;
  notes?: string;
}

export interface OccasionFormData {
  personId?: string;
  name: string;
  type: OccasionType;
  date: string;
  isRecurring: boolean;
  reminderDays: number;
  budgetAmount?: number;
  budgetCurrency: Currency;
  notes?: string;
}

// ============================================
// Budget Types
// ============================================

export interface BudgetSummary {
  personId?: string;
  occasionId?: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  currency: Currency;
  isOverBudget: boolean;
  percentUsed: number;
}

export interface SpendingReport {
  period: string;
  totalSpent: number;
  currency: Currency;
  byPerson: {
    personId: string;
    personName: string;
    amount: number;
  }[];
  byCategory: {
    category: GiftCategory;
    amount: number;
  }[];
  byOccasion: {
    occasionId: string;
    occasionName: string;
    amount: number;
  }[];
}

// ============================================
// User Settings Types
// ============================================

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  defaultReminderDays: number;
  defaultCurrency: Currency;
  hasSeenOnboarding: boolean;
  adsConsent: boolean | null; // null = not yet asked
  adsConsentDate?: string;
}

// ============================================
// Sync Types
// ============================================

export interface SyncStatus {
  lastSyncedAt: string | null;
  isPending: boolean;
  pendingChanges: number;
  isOnline: boolean;
  error?: string;
}

export interface SyncQueueItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: 'people' | 'gifts' | 'occasions';
  documentId: string;
  data?: Record<string, unknown>;
  timestamp: string;
  retryCount: number;
}

// ============================================
// Notification Types
// ============================================

export interface ScheduledNotification {
  id: string;
  occasionId?: string;
  personId?: string;
  giftId?: string;
  type: 'occasion_reminder' | 'shipping_deadline' | 'return_deadline';
  title: string;
  body: string;
  scheduledDate: string;
}

// ============================================
// Filter & Sort Types
// ============================================

export interface PeopleFilters {
  relationship?: RelationshipCategory[];
  hasUpcomingOccasion?: boolean;
  searchQuery?: string;
}

export interface GiftFilters {
  status?: GiftStatus[];
  priority?: GiftPriority[];
  category?: GiftCategory[];
  priceMin?: number;
  priceMax?: number;
  searchQuery?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface PeopleSortOptions {
  field: 'name' | 'createdAt' | 'nextOccasion';
  direction: SortDirection;
}

export interface GiftSortOptions {
  field: 'name' | 'price' | 'priority' | 'createdAt' | 'status';
  direction: SortDirection;
}

// ============================================
// Navigation Types
// ============================================

export type RootStackParamList = {
  Main: undefined;
  PersonDetail: { personId: string };
  PersonForm: { personId?: string };
  GiftDetail: { giftId: string };
  GiftForm: { personId: string; giftId?: string };
  OccasionDetail: { occasionId: string };
  OccasionForm: { occasionId?: string; personId?: string };
  GiftHistory: { personId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Occasions: undefined;
  Reports: undefined;
  Settings: undefined;
};

// ============================================
// Ad Types
// ============================================

export interface AdConfig {
  bannerScreens: string[];
  interstitialTriggers: {
    personAdded: { enabled: boolean; frequencyCapMinutes: number };
    giftGiven: { enabled: boolean; frequencyCapMinutes: number };
    sessionReturn: { enabled: boolean; frequencyCapMinutes: number };
  };
  rewardedFeatures: string[];
}

export interface AdState {
  isInitialized: boolean;
  consentStatus: 'unknown' | 'required' | 'granted' | 'denied';
  lastInterstitialTime: number | null;
  adsEnabled: boolean;
}

// ============================================
// Utility Types
// ============================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type WithTimestamps<T> = T & {
  createdAt: string;
  updatedAt: string;
};
