import { GiftCategory, GiftPriority, GiftSource, GiftStatus, RelationshipCategory } from '@/types';

export interface CategoryOption<T extends string> {
  value: T;
  label: string;
  icon?: string;
  color?: string;
}

export const GIFT_CATEGORIES: CategoryOption<GiftCategory>[] = [
  { value: GiftCategory.CLOTHING, label: 'Clothing', icon: 'shirt', color: '#6366F1' },
  { value: GiftCategory.ELECTRONICS, label: 'Electronics', icon: 'laptop', color: '#3B82F6' },
  { value: GiftCategory.BOOKS, label: 'Books', icon: 'book', color: '#8B5CF6' },
  { value: GiftCategory.EXPERIENCES, label: 'Experiences', icon: 'ticket', color: '#EC4899' },
  { value: GiftCategory.HOMEMADE, label: 'Homemade', icon: 'heart', color: '#F43F5E' },
  { value: GiftCategory.HOME_DECOR, label: 'Home & Decor', icon: 'home', color: '#14B8A6' },
  { value: GiftCategory.JEWELRY, label: 'Jewelry', icon: 'gem', color: '#F59E0B' },
  { value: GiftCategory.TOYS_GAMES, label: 'Toys & Games', icon: 'gamepad', color: '#10B981' },
  { value: GiftCategory.SPORTS_OUTDOORS, label: 'Sports & Outdoors', icon: 'activity', color: '#22C55E' },
  { value: GiftCategory.BEAUTY, label: 'Beauty', icon: 'sparkles', color: '#F472B6' },
  { value: GiftCategory.FOOD_DRINK, label: 'Food & Drink', icon: 'utensils', color: '#FB923C' },
  { value: GiftCategory.GIFT_CARD, label: 'Gift Card', icon: 'credit-card', color: '#64748B' },
  { value: GiftCategory.OTHER, label: 'Other', icon: 'package', color: '#94A3B8' },
];

export const GIFT_PRIORITIES: CategoryOption<GiftPriority>[] = [
  { value: GiftPriority.LOW, label: 'Low', color: '#94A3B8' },
  { value: GiftPriority.MEDIUM, label: 'Medium', color: '#3B82F6' },
  { value: GiftPriority.HIGH, label: 'High', color: '#F59E0B' },
  { value: GiftPriority.MUST_HAVE, label: 'Must Have', color: '#EF4444' },
];

export const GIFT_STATUSES: CategoryOption<GiftStatus>[] = [
  { value: GiftStatus.IDEA, label: 'Idea', color: '#94A3B8' },
  { value: GiftStatus.PURCHASED, label: 'Purchased', color: '#3B82F6' },
  { value: GiftStatus.WRAPPED, label: 'Wrapped', color: '#8B5CF6' },
  { value: GiftStatus.HIDDEN, label: 'Hidden', color: '#F59E0B' },
  { value: GiftStatus.GIVEN, label: 'Given', color: '#22C55E' },
  { value: GiftStatus.RETURNED, label: 'Returned', color: '#EF4444' },
];

export const GIFT_SOURCES: CategoryOption<GiftSource>[] = [
  { value: GiftSource.MENTIONED, label: 'They Mentioned It' },
  { value: GiftSource.WISHLIST, label: 'From Wishlist' },
  { value: GiftSource.ONLINE, label: 'Saw Online' },
  { value: GiftSource.RECOMMENDATION, label: 'Recommendation' },
  { value: GiftSource.STORE, label: 'Saw in Store' },
  { value: GiftSource.OTHER, label: 'Other' },
];

export const RELATIONSHIPS: CategoryOption<RelationshipCategory>[] = [
  { value: RelationshipCategory.FAMILY, label: 'Family', icon: 'users', color: '#EC4899' },
  { value: RelationshipCategory.FRIEND, label: 'Friend', icon: 'user-plus', color: '#3B82F6' },
  { value: RelationshipCategory.COWORKER, label: 'Coworker', icon: 'briefcase', color: '#14B8A6' },
  { value: RelationshipCategory.PARTNER, label: 'Partner', icon: 'heart', color: '#F43F5E' },
  { value: RelationshipCategory.OTHER, label: 'Other', icon: 'user', color: '#94A3B8' },
];

export const getCategoryOption = <T extends string>(
  categories: CategoryOption<T>[],
  value: T
): CategoryOption<T> | undefined => {
  return categories.find((cat) => cat.value === value);
};

export const getCategoryLabel = <T extends string>(
  categories: CategoryOption<T>[],
  value: T
): string => {
  return getCategoryOption(categories, value)?.label ?? value;
};

export const getCategoryColor = <T extends string>(
  categories: CategoryOption<T>[],
  value: T
): string => {
  return getCategoryOption(categories, value)?.color ?? '#94A3B8';
};
