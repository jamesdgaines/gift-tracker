import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { useTheme } from '@/theme';
import { shouldShowBannerAd, getAdUnitId } from '@/services/ads';
import { BANNER_SIZES, AD_UX_GUIDELINES } from '@/constants/adConfig';

interface BannerAdProps {
  screenName: string;
  size?: 'standard' | 'large' | 'mediumRectangle';
  testID?: string;
}

export const BannerAd: React.FC<BannerAdProps> = ({
  screenName,
  size = 'standard',
  testID,
}) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkVisibility = () => {
      const shouldShow = shouldShowBannerAd(screenName);
      setIsVisible(shouldShow);
    };

    checkVisibility();
  }, [screenName]);

  if (!isVisible) {
    return null;
  }

  const getBannerSize = () => {
    switch (size) {
      case 'large':
        return BANNER_SIZES.LARGE;
      case 'mediumRectangle':
        return BANNER_SIZES.MEDIUM_RECTANGLE;
      default:
        return BANNER_SIZES.STANDARD;
    }
  };

  const bannerSize = getBannerSize();
  const adUnitId = getAdUnitId('banner');

  // Placeholder implementation - actual ad would use react-native-google-mobile-ads
  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          height: typeof bannerSize === 'object' ? bannerSize.height : 50,
          marginTop: AD_UX_GUIDELINES.BANNER_SAFE_AREA_PX,
          backgroundColor: theme.colors.backgroundSecondary,
        },
      ]}
    >
      {isLoading ? (
        <Text style={[styles.loadingText, { color: theme.colors.textTertiary }]}>
          Loading ad...
        </Text>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.textTertiary }]}>
            Ad failed to load
          </Text>
        </View>
      ) : (
        <View style={styles.adPlaceholder}>
          <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
            Advertisement
          </Text>
          <Text style={[styles.debugText, { color: theme.colors.textTertiary }]}>
            {__DEV__ ? `Unit: ${adUnitId.slice(-8)}` : ''}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  loadingText: {
    fontSize: 12,
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
  },
  adPlaceholder: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  debugText: {
    fontSize: 9,
    marginTop: 2,
  },
});

export default BannerAd;
