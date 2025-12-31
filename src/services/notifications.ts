import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Occasion } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  SCHEDULED_NOTIFICATIONS: '@notifications/scheduled',
  NOTIFICATION_SETTINGS: '@notifications/settings',
};

// Notification types
export type NotificationType = 'occasionReminder' | 'budgetWarning' | 'giftPurchaseReminder';

interface ScheduledNotification {
  id: string;
  type: NotificationType;
  occasionId?: string;
  personId?: string;
  scheduledFor: string;
  title: string;
  body: string;
}

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Check if notifications are enabled
export const areNotificationsEnabled = async (): Promise<boolean> => {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
};

// Schedule an occasion reminder
export const scheduleOccasionReminder = async (
  occasion: Occasion,
  reminderDays: number,
  personName: string
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    const occasionDate = new Date(occasion.date);

    // For recurring occasions, get the next occurrence
    const now = new Date();
    if (occasion.isRecurring) {
      occasionDate.setFullYear(now.getFullYear());
      if (occasionDate < now) {
        occasionDate.setFullYear(now.getFullYear() + 1);
      }
    }

    // Calculate reminder date
    const reminderDate = new Date(occasionDate);
    reminderDate.setDate(reminderDate.getDate() - reminderDays);

    // Don't schedule if reminder date is in the past
    if (reminderDate <= now) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${occasion.name} Coming Up!`,
        body: `${personName}'s ${occasion.name} is in ${reminderDays} day${reminderDays > 1 ? 's' : ''}. Have you prepared gifts?`,
        data: {
          type: 'occasionReminder',
          occasionId: occasion.id,
          personId: occasion.personId,
        },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
      },
    });

    // Store scheduled notification info
    await saveScheduledNotification({
      id: notificationId,
      type: 'occasionReminder',
      occasionId: occasion.id,
      personId: occasion.personId,
      scheduledFor: reminderDate.toISOString(),
      title: `${occasion.name} Coming Up!`,
      body: `${personName}'s ${occasion.name} is in ${reminderDays} days`,
    });

    return notificationId;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
};

// Schedule all reminders for an occasion
export const scheduleOccasionReminders = async (
  occasion: Occasion,
  personName: string
): Promise<string[]> => {
  const scheduledIds: string[] = [];

  // reminderDays is a single number, schedule one reminder
  const id = await scheduleOccasionReminder(occasion, occasion.reminderDays, personName);
  if (id) {
    scheduledIds.push(id);
  }

  return scheduledIds;
};

// Cancel a scheduled notification
export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    await removeScheduledNotification(notificationId);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
};

// Cancel all notifications for an occasion
export const cancelOccasionNotifications = async (occasionId: string): Promise<void> => {
  try {
    const scheduled = await getScheduledNotifications();
    const occasionNotifications = scheduled.filter(
      (n) => n.occasionId === occasionId
    );

    for (const notification of occasionNotifications) {
      await cancelNotification(notification.id);
    }
  } catch (error) {
    console.error('Failed to cancel occasion notifications:', error);
  }
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(STORAGE_KEYS.SCHEDULED_NOTIFICATIONS);
  } catch (error) {
    console.error('Failed to cancel all notifications:', error);
  }
};

// Get all scheduled notifications
export const getScheduledNotifications = async (): Promise<ScheduledNotification[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.SCHEDULED_NOTIFICATIONS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save a scheduled notification
const saveScheduledNotification = async (
  notification: ScheduledNotification
): Promise<void> => {
  try {
    const scheduled = await getScheduledNotifications();
    scheduled.push(notification);
    await AsyncStorage.setItem(
      STORAGE_KEYS.SCHEDULED_NOTIFICATIONS,
      JSON.stringify(scheduled)
    );
  } catch (error) {
    console.error('Failed to save scheduled notification:', error);
  }
};

// Remove a scheduled notification from storage
const removeScheduledNotification = async (notificationId: string): Promise<void> => {
  try {
    const scheduled = await getScheduledNotifications();
    const filtered = scheduled.filter((n) => n.id !== notificationId);
    await AsyncStorage.setItem(
      STORAGE_KEYS.SCHEDULED_NOTIFICATIONS,
      JSON.stringify(filtered)
    );
  } catch (error) {
    console.error('Failed to remove scheduled notification:', error);
  }
};

// Reschedule all occasion reminders (call after app update or data restore)
export const rescheduleAllReminders = async (
  occasions: Occasion[],
  getPersonName: (personId: string) => string
): Promise<void> => {
  // Cancel all existing notifications
  await cancelAllNotifications();

  // Reschedule for all occasions
  for (const occasion of occasions) {
    const personName = occasion.personId ? getPersonName(occasion.personId) : 'Someone';
    await scheduleOccasionReminders(occasion, personName);
  }
};

// Schedule a budget warning notification
export const scheduleBudgetWarning = async (
  personName: string,
  spent: number,
  budget: number
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    // Schedule for immediate delivery
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Budget Alert',
        body: `You've spent $${spent.toFixed(0)} of your $${budget.toFixed(0)} budget for ${personName}.`,
        data: {
          type: 'budgetWarning',
        },
        sound: true,
      },
      trigger: null, // Immediate delivery
    });

    return notificationId;
  } catch (error) {
    console.error('Failed to schedule budget warning:', error);
    return null;
  }
};

// Add notification listeners
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
): Notifications.EventSubscription => {
  return Notifications.addNotificationReceivedListener(callback);
};

export const addNotificationResponseReceivedListener = (
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.EventSubscription => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

export default {
  requestNotificationPermissions,
  areNotificationsEnabled,
  scheduleOccasionReminder,
  scheduleOccasionReminders,
  cancelNotification,
  cancelOccasionNotifications,
  cancelAllNotifications,
  getScheduledNotifications,
  rescheduleAllReminders,
  scheduleBudgetWarning,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
};
