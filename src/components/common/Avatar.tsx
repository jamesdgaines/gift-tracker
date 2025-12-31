import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme, AvatarSizeKey } from '@/theme';

export interface AvatarProps {
  testID?: string;
  uri?: string | null;
  name?: string;
  size?: AvatarSizeKey;
  onPress?: () => void;
  style?: ViewStyle;
  borderColor?: string;
  showBorder?: boolean;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getColorFromName = (name: string): string => {
  const colors = [
    '#F87171', // red
    '#FB923C', // orange
    '#FBBF24', // amber
    '#34D399', // emerald
    '#22D3EE', // cyan
    '#60A5FA', // blue
    '#A78BFA', // violet
    '#F472B6', // pink
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  testID,
  uri,
  name = '',
  size = 'md',
  onPress,
  style,
  borderColor,
  showBorder = false,
}) => {
  const theme = useTheme();
  const avatarSize = theme.avatarSize[size];
  const fontSize = avatarSize * 0.4;

  const containerStyles: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    overflow: 'hidden',
    backgroundColor: getColorFromName(name),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: showBorder ? 2 : 0,
    borderColor: borderColor || theme.colors.background,
  };

  const renderContent = () => {
    if (uri) {
      return (
        <Image
          source={{ uri }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={`${name}'s photo`}
        />
      );
    }

    return (
      <Text
        style={[
          styles.initials,
          {
            fontSize,
            color: '#FFFFFF',
          },
        ]}
      >
        {getInitials(name) || '?'}
      </Text>
    );
  };

  if (onPress) {
    return (
      <TouchableOpacity
        testID={testID}
        onPress={onPress}
        style={[containerStyles, style]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${name} avatar`}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <View testID={testID} style={[containerStyles, style]} accessibilityLabel={`${name} avatar`}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontWeight: '600',
  },
});

export default Avatar;
