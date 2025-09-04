import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import BottomBar from '../components/main/BottomBar';
import SwipeCard from '../components/main/SwipeCard';
import { CyberGradient } from '../components/shared/CyberGradient';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/userContext';
import { ensureUserExists, getCurrentSessionUser } from '../services/session';

export default function MainScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('User');
  const { setUser } = useUser();
  const { showToast } = useToast();

  const welcomeOpacity = useSharedValue(0);
  const nameOpacity = useSharedValue(0);
  const emojiOpacity = useSharedValue(0);

  useEffect(() => {
    welcomeOpacity.value = withDelay(100, withTiming(1, { duration: 500 }));
    nameOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    emojiOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));

    const init = async () => {
      const sessionUser = await getCurrentSessionUser();
      if (!sessionUser) return;
      setUser(sessionUser);
      const { id, email, user_metadata } = sessionUser;
      const name = user_metadata?.name || 'User';
      const photo = user_metadata?.avatar_url;

      if (!email) {
        showToast('Email is missing from user metadata', 'error');
        return;
      }

      const userRecord = await ensureUserExists(id, email, name, photo);
      if (userRecord) {
        setUserId(userRecord.user_id);
        setUserName(userRecord.name || 'User');
      }
    };

    init();
  }, []);

  const welcomeStyle = useAnimatedStyle(() => ({
    opacity: welcomeOpacity.value,
  }));

  const nameStyle = useAnimatedStyle(() => ({
    opacity: nameOpacity.value,
  }));

  const emojiStyle = useAnimatedStyle(() => ({
    opacity: emojiOpacity.value,
  }));

  if (!userId) return null;

  return (
    <CyberGradient>
      <SafeAreaView style={styles.container}>
        <Animated.Text style={[styles.welcomeText, welcomeStyle]}>
          Welcome Back,
        </Animated.Text>
        <Animated.Text style={[styles.userName, nameStyle]}>
          {userName}
        </Animated.Text>
        <Animated.Text style={[styles.emoji, emojiStyle]}>
          👋
        </Animated.Text>

        <SwipeCard userId={userId} />
      </SafeAreaView>
      <BottomBar />
    </CyberGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 80,
  },
  userName: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 20,
  },
});