import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getServerStatus,
  retryServerConnection,
  ServerStatusSnapshot,
  subscribeToServerStatus,
} from '@/services/serverStatus';
import { checkApiServerAvailability } from '@/services/parentApi';

export function ServerStatusNotice() {
  const [status, setStatus] = useState<ServerStatusSnapshot>(getServerStatus());
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const unsubscribe = subscribeToServerStatus(setStatus);
    void checkApiServerAvailability();
    return unsubscribe;
  }, []);

  if (!status.isDown) return null;

  return (
    <View accessibilityRole="alert" style={[styles.notice, { top: insets.top + 8 }]}>
      <View style={styles.icon}><Ionicons name="cloud-offline-outline" size={21} color="#B91C1C" /></View>
      <View style={styles.copy}>
        <Text style={styles.title}>Server unavailable</Text>
        <Text style={styles.message}>{status.message}</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={retryServerConnection} disabled={status.isChecking} style={styles.retry}>
        {status.isChecking
          ? <ActivityIndicator size="small" color="#B91C1C" />
          : <Text style={styles.retryText}>Retry</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    position: 'absolute', left: 12, right: 12, zIndex: 1000, elevation: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12,
    borderRadius: 16, borderWidth: 1, borderColor: '#FECACA', backgroundColor: '#FFF7F7',
    shadowColor: '#7F1D1D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10,
  },
  icon: { width: 38, height: 38, borderRadius: 13, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1 }, title: { color: '#991B1B', fontSize: 13, fontWeight: '800' },
  message: { color: '#7F1D1D', fontSize: 11, marginTop: 3 },
  retry: { minWidth: 48, minHeight: 38, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' },
  retryText: { color: '#B91C1C', fontWeight: '800', fontSize: 12 },
});
