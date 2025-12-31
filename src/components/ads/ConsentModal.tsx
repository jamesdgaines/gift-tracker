import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
} from 'react-native';
import { useTheme } from '@/theme';
import { Button } from '@/components/common';
import { setUserConsent } from '@/services/ads';
import { CONSENT_CONFIG } from '@/constants/adConfig';

interface ConsentModalProps {
  visible: boolean;
  onComplete: (consented: boolean) => void;
  testID?: string;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  visible,
  onComplete,
  testID,
}) => {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConsent = useCallback(async (consented: boolean) => {
    setIsSubmitting(true);
    try {
      await setUserConsent(consented);
      onComplete(consented);
    } catch (error) {
      console.error('Failed to save consent:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onComplete]);

  const handlePrivacyPolicy = useCallback(async () => {
    try {
      await Linking.openURL(CONSENT_CONFIG.privacyPolicyUrl);
    } catch {
      // Handle error silently
    }
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      testID={testID}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Privacy & Personalization
            </Text>

            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              We use advertising to keep this app free. To provide a better experience,
              we'd like to show you personalized ads based on your interests.
            </Text>

            <View style={styles.infoSection}>
              <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                What this means:
              </Text>
              <Text style={[styles.infoItem, { color: theme.colors.textSecondary }]}>
                {'\u2022'} We may collect and share your advertising identifier
              </Text>
              <Text style={[styles.infoItem, { color: theme.colors.textSecondary }]}>
                {'\u2022'} Ads may be tailored to your interests
              </Text>
              <Text style={[styles.infoItem, { color: theme.colors.textSecondary }]}>
                {'\u2022'} You can change this choice anytime in Settings
              </Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                If you decline:
              </Text>
              <Text style={[styles.infoItem, { color: theme.colors.textSecondary }]}>
                {'\u2022'} You'll still see ads, but they won't be personalized
              </Text>
              <Text style={[styles.infoItem, { color: theme.colors.textSecondary }]}>
                {'\u2022'} No data will be collected for ad personalization
              </Text>
            </View>

            <TouchableOpacity onPress={handlePrivacyPolicy}>
              <Text style={[styles.privacyLink, { color: theme.colors.primary }]}>
                Read our Privacy Policy
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.buttons}>
            <Button
              testID={`${testID}-accept`}
              title="Accept Personalized Ads"
              onPress={() => handleConsent(true)}
              loading={isSubmitting}
              fullWidth
            />
            <Button
              testID={`${testID}-decline`}
              title="Decline"
              onPress={() => handleConsent(false)}
              variant="outline"
              disabled={isSubmitting}
              fullWidth
              style={styles.declineButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  scrollView: {
    flexGrow: 0,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoItem: {
    fontSize: 14,
    lineHeight: 22,
    paddingLeft: 4,
  },
  privacyLink: {
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  buttons: {
    padding: 24,
    paddingTop: 0,
  },
  declineButton: {
    marginTop: 12,
  },
});

export default ConsentModal;
