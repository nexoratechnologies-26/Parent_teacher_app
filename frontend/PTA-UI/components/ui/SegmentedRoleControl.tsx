import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';

export type RoleType = 'PARENT' | 'TEACHER' | 'ADMIN';

interface SegmentedRoleControlProps {
  selectedRole: RoleType;
  onSelectRole: (role: RoleType) => void;
  style?: StyleProp<ViewStyle>;
  showAdmin?: boolean;
}

export const SegmentedRoleControl: React.FC<SegmentedRoleControlProps> = ({
  selectedRole,
  onSelectRole,
  style,
  showAdmin = false,
}) => {
  const roles: { key: RoleType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'PARENT', label: 'Parent', icon: 'people' },
    { key: 'TEACHER', label: 'Teacher', icon: 'school' },
    ...(showAdmin ? [{ key: 'ADMIN' as RoleType, label: 'Admin', icon: 'shield-checkmark' as keyof typeof Ionicons.glyphMap }] : []),
  ];

  return (
    <View style={[styles.container, style]}>
      {roles.map((role) => {
        const isSelected = selectedRole === role.key;

        if (isSelected) {
          return (
            <TouchableOpacity
              key={role.key}
              style={[styles.segment, styles.selectedSegmentWrapper]}
              activeOpacity={0.9}
              onPress={() => onSelectRole(role.key)}
            >
              <LinearGradient
                colors={['#FFC727', '#F59E0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradientSegment, Shadows.primaryButton]}
              >
                <Ionicons name={role.icon} size={18} color="#FFFFFF" style={styles.icon} />
                <Text style={styles.selectedText}>{role.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={role.key}
            style={styles.segment}
            activeOpacity={0.7}
            onPress={() => onSelectRole(role.key)}
          >
            <Ionicons name={role.icon} size={18} color="#64748B" style={styles.icon} />
            <Text style={styles.unselectedText}>{role.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F3EDE2',
    borderRadius: BorderRadius.full,
    padding: 4,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E6DDD0',
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  selectedSegmentWrapper: {
    paddingVertical: 0,
  },
  gradientSegment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: BorderRadius.full,
  },
  icon: {
    marginRight: 6,
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  unselectedText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '600',
  },
});
