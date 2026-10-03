import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://sbwhdfqxurstvmsgsnjh.supabase.co';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNid2hkZnF4dXJzdHZtc2dzbmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwNDA0OTIsImV4cCI6MjEwNjYxNjQ5Mn0.S1EXE_UNzsJVS6jYAJq-EO_znRVdTl5H4ZZL7xH7dJQ';

// Cross-platform storage adapter (localStorage on Web, SecureStore on Mobile)
const ExpoStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    }
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      return;
    }
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Ignore secure store errors on unmounted storage
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      return;
    }
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Ignore
    }
  },
};

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes('placeholder') &&
      !supabaseAnonKey.includes('placeholder')
  );
};

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      storage: ExpoStorageAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
  }
);
