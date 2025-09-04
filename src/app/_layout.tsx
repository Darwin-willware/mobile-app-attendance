import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '../context/ToastContext';
import { UserProvider } from '../context/userContext';
import supabase from '../lib/supabase';

export default function RootLayout() {
  const [isAuthChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  // Check session on app launch
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      const session = data?.session;

      setLoggedIn(!!session?.user);
      setAuthChecked(true);

      const currentSegment = segments[0]?.toString();
      const isPublicRoute = !currentSegment || currentSegment === 'index';

      if (!session?.user && !isPublicRoute) {
        router.replace('/');
      } else if (session?.user && isPublicRoute) {
        router.replace('/main');
      }
    };

    checkSession();
  }, [segments]);

  // Listen to auth state changes
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);

      const currentSegment = segments[0]?.toString();
      const isPublicRoute = !currentSegment || currentSegment === 'index';

      if (!session?.user && !isPublicRoute) {
        router.replace('/');
      } else if (session?.user && isPublicRoute) {
        router.replace('/main');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [segments]);

  if (!isAuthChecked) return null;

  return (
    <ToastProvider>
      <UserProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={styles.root}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="main" />
            </Stack>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </UserProvider>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});