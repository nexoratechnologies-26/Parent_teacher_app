import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Colors, BorderRadius } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'success',
  icon,
  style,
  textStyle,
}) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: '#EAF8EE',
          borderColor: '#C6EED4',
          textColor: '#15803D',
        };
      case 'warning':
        return {
          backgroundColor: '#FFF7ED',
          borderColor: '#FED7AA',
          textColor: '#C2410C',
        };
      case 'error':
        return {
          backgroundColor: '#FEF2F2',
          borderColor: '#FECACA',
          textColor: '#B91C1C',
        };
      case 'info':
        return {
          backgroundColor: '#EFF6FF',
          borderColor: '#BFDBFE',
          textColor: '#1D4ED8',
        };
      default:
        return {
          backgroundColor: '#F1F5F9',
          borderColor: '#E2E8F0',
          textColor: '#475569',
        };
    }
  };

  const badgeConfig = getBadgeStyle();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: badgeConfig.backgroundColor,
          borderColor: badgeConfig.borderColor,
        },
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.text, { color: badgeConfig.textColor }, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
  },
});
