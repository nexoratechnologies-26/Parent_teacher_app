import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';

interface ClayCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
  bordered?: boolean;
}

export const ClayCard: React.FC<ClayCardProps> = ({
  children,
  style,
  elevated = false,
  bordered = true,
}) => {
  return (
    <View
      style={[
        styles.card,
        bordered && styles.bordered,
        elevated ? Shadows.cardElevated : Shadows.card,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: 16,
  },
  bordered: {
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
});
