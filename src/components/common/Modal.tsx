import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ModalProps {
  testID?: string;
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  fullScreen?: boolean;
  bottomSheet?: boolean;
  scrollable?: boolean;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  contentStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  testID,
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnBackdropPress = true,
  fullScreen = false,
  bottomSheet = false,
  scrollable = false,
  headerRight,
  footer,
  contentStyle,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const getModalContainerStyle = (): ViewStyle => {
    if (fullScreen) {
      return {
        flex: 1,
        margin: 0,
        borderRadius: 0,
      };
    }

    if (bottomSheet) {
      return {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        maxHeight: '90%',
        paddingBottom: insets.bottom,
      };
    }

    return {
      marginHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      maxHeight: '80%',
    };
  };

  const renderContent = () => {
    const content = (
      <View
        style={[
          styles.content,
          { padding: theme.spacing.md },
          contentStyle,
        ]}
      >
        {children}
      </View>
    );

    if (scrollable) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      );
    }

    return content;
  };

  return (
    <RNModal
      testID={testID}
      visible={visible}
      transparent
      animationType={bottomSheet ? 'slide' : 'fade'}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback
        onPress={closeOnBackdropPress ? onClose : undefined}
        accessible={false}
      >
        <View
          style={[
            styles.backdrop,
            { backgroundColor: theme.colors.overlay },
            bottomSheet && styles.backdropBottomSheet,
          ]}
        >
          <TouchableWithoutFeedback accessible={false}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={[
                styles.modalContainer,
                { backgroundColor: theme.colors.surface },
                getModalContainerStyle(),
              ]}
            >
              {(title || showCloseButton || headerRight) && (
                <View
                  style={[
                    styles.header,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.border,
                      paddingHorizontal: theme.spacing.md,
                      paddingVertical: theme.spacing.sm,
                    },
                  ]}
                >
                  {showCloseButton && (
                    <TouchableOpacity
                      onPress={onClose}
                      style={styles.closeButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      accessibilityLabel="Close modal"
                      accessibilityRole="button"
                    >
                      <Text
                        style={{
                          fontSize: theme.fontSize.xl,
                          color: theme.colors.textSecondary,
                        }}
                      >
                        ×
                      </Text>
                    </TouchableOpacity>
                  )}

                  <Text
                    style={[
                      styles.title,
                      {
                        color: theme.colors.text,
                        fontSize: theme.fontSize.lg,
                        fontWeight: theme.fontWeight.semibold,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {title}
                  </Text>

                  {headerRight ? (
                    <View style={styles.headerRight}>{headerRight}</View>
                  ) : (
                    <View style={styles.headerRightPlaceholder} />
                  )}
                </View>
              )}

              {renderContent()}

              {footer && (
                <View
                  style={[
                    styles.footer,
                    {
                      borderTopWidth: 1,
                      borderTopColor: theme.colors.border,
                      padding: theme.spacing.md,
                    },
                  ]}
                >
                  {footer}
                </View>
              )}
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropBottomSheet: {
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 32,
    alignItems: 'flex-end',
  },
  headerRightPlaceholder: {
    width: 32,
  },
  content: {
    flexGrow: 1,
  },
  footer: {},
});

export default Modal;
