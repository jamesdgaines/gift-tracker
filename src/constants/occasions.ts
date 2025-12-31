import { OccasionType, ReminderTiming } from '@/types';

export interface OccasionTypeOption {
  value: OccasionType;
  label: string;
  icon: string;
  color: string;
  isRecurringByDefault: boolean;
  defaultReminderDays: number;
}

export const OCCASION_TYPES: OccasionTypeOption[] = [
  {
    value: OccasionType.BIRTHDAY,
    label: 'Birthday',
    icon: 'cake',
    color: '#EC4899',
    isRecurringByDefault: true,
    defaultReminderDays: 14,
  },
  {
    value: OccasionType.CHRISTMAS,
    label: 'Christmas',
    icon: 'gift',
    color: '#EF4444',
    isRecurringByDefault: true,
    defaultReminderDays: 30,
  },
  {
    value: OccasionType.HANUKKAH,
    label: 'Hanukkah',
    icon: 'star',
    color: '#3B82F6',
    isRecurringByDefault: true,
    defaultReminderDays: 30,
  },
  {
    value: OccasionType.ANNIVERSARY,
    label: 'Anniversary',
    icon: 'heart',
    color: '#F43F5E',
    isRecurringByDefault: true,
    defaultReminderDays: 14,
  },
  {
    value: OccasionType.VALENTINES_DAY,
    label: "Valentine's Day",
    icon: 'heart',
    color: '#FB7185',
    isRecurringByDefault: true,
    defaultReminderDays: 14,
  },
  {
    value: OccasionType.MOTHERS_DAY,
    label: "Mother's Day",
    icon: 'flower',
    color: '#F472B6',
    isRecurringByDefault: true,
    defaultReminderDays: 14,
  },
  {
    value: OccasionType.FATHERS_DAY,
    label: "Father's Day",
    icon: 'user',
    color: '#3B82F6',
    isRecurringByDefault: true,
    defaultReminderDays: 14,
  },
  {
    value: OccasionType.GRADUATION,
    label: 'Graduation',
    icon: 'award',
    color: '#8B5CF6',
    isRecurringByDefault: false,
    defaultReminderDays: 30,
  },
  {
    value: OccasionType.WEDDING,
    label: 'Wedding',
    icon: 'ring',
    color: '#F59E0B',
    isRecurringByDefault: false,
    defaultReminderDays: 30,
  },
  {
    value: OccasionType.BABY_SHOWER,
    label: 'Baby Shower',
    icon: 'baby',
    color: '#14B8A6',
    isRecurringByDefault: false,
    defaultReminderDays: 14,
  },
  {
    value: OccasionType.HOUSEWARMING,
    label: 'Housewarming',
    icon: 'home',
    color: '#22C55E',
    isRecurringByDefault: false,
    defaultReminderDays: 7,
  },
  {
    value: OccasionType.CUSTOM,
    label: 'Custom',
    icon: 'calendar',
    color: '#64748B',
    isRecurringByDefault: false,
    defaultReminderDays: 7,
  },
];

export const REMINDER_OPTIONS: { value: ReminderTiming; label: string; days: number }[] = [
  { value: ReminderTiming.ONE_WEEK, label: '1 week before', days: 7 },
  { value: ReminderTiming.TWO_WEEKS, label: '2 weeks before', days: 14 },
  { value: ReminderTiming.ONE_MONTH, label: '1 month before', days: 30 },
  { value: ReminderTiming.TWO_MONTHS, label: '2 months before', days: 60 },
];

export const getOccasionTypeOption = (type: OccasionType): OccasionTypeOption | undefined => {
  return OCCASION_TYPES.find((o) => o.value === type);
};

export const getOccasionLabel = (type: OccasionType): string => {
  return getOccasionTypeOption(type)?.label ?? type;
};

export const getOccasionColor = (type: OccasionType): string => {
  return getOccasionTypeOption(type)?.color ?? '#64748B';
};

export const getOccasionIcon = (type: OccasionType): string => {
  return getOccasionTypeOption(type)?.icon ?? 'calendar';
};
