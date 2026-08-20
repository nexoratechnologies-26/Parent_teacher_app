import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>page not exist</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go back</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FAF7F2', // Matching the app's theme background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B', // Matching text theme
  },
  link: {
    marginTop: 20,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
});
