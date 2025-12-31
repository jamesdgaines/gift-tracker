export { usePeopleStore, selectAllPeople, selectPeopleCount } from './peopleStore';
export {
  useGiftsStore,
  selectAllGifts,
  selectGiftsCount,
} from './giftsStore';
export {
  useOccasionsStore,
  selectAllOccasions,
  selectOccasionsCount,
  getNextOccurrence,
  getDaysUntil,
} from './occasionsStore';
export {
  useSettingsStore,
  selectTheme,
  selectNotificationsEnabled,
  selectDefaultCurrency,
  selectAdsConsent,
  selectAdState,
} from './settingsStore';
