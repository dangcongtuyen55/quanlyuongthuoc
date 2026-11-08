import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, rounded, typography } from '../theme';

interface StatusBadgeProps {
  status: 'taken' | 'skipped' | 'missed' | 'pending';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'taken':
        return {
          bg: colors.secondaryContainer,
          text: colors.onSecondaryContainer,
          label: 'Đã uống',
        };
      case 'skipped':
        return {
          bg: colors.surfaceContainerHighest,
          text: colors.onSurfaceVariant,
          label: 'Đã bỏ qua',
        };
      case 'missed':
        return {
          bg: colors.errorContainer,
          text: colors.onErrorContainer,
          label: 'Chưa uống',
        };
      case 'pending':
        return {
          bg: colors.primaryFixed,
          text: colors.onPrimaryFixedVariant,
          label: 'Chờ uống',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: rounded.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    fontWeight: '700',
  },
});

