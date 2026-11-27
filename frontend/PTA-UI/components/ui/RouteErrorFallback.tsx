import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ErrorBoundaryProps } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export function RouteErrorFallback({ retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}><Ionicons name="alert-circle-outline" size={34} color="#D97706" /></View>
      <Text style={styles.title}>This page hit a problem</Text>
      <Text style={styles.message}>Your information is safe. Try loading the page again.</Text>
      <Pressable accessibilityRole="button" onPress={retry} style={styles.button}>
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2', alignItems: 'center', justifyContent: 'center', padding: 28 },
  icon: { width: 72, height: 72, borderRadius: 24, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  title: { color: '#1E293B', fontSize: 21, fontWeight: '800', textAlign: 'center' },
  message: { color: '#64748B', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8, maxWidth: 300 },
  button: { backgroundColor: '#F59E0B', borderRadius: 14, paddingHorizontal: 24, paddingVertical: 13, marginTop: 22 },
  buttonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
});
