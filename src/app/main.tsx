import { toast } from '@backpackapp-io/react-native-toast';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import BottomBar from '../components/main/BottomBar';
import SwipeCard from '../components/main/SwipeCard';
import { CyberGradient } from '../components/shared/CyberGradient';
import { useUser } from '../context/userContext';
import { ensureUserExists, getCurrentSessionUser } from '../services/session';

export default function MainScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('User');
  const { setUser } = useUser();

  useEffect(() => {
    const init = async () => {
      const sessionUser = await getCurrentSessionUser();
      if (!sessionUser) return;
      setUser(sessionUser);
      const { id, email, user_metadata } = sessionUser;
      const name = user_metadata?.name || 'User';
      const photo = user_metadata?.avatar_url;

      if (!email) {
        toast.error('Email is missing from user metadata');
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

  if (!userId) return null;

  return (
    <CyberGradient>
      <SafeAreaView style={styles.container} >

        <Animatable.Text animation="fadeInLeft" delay={100} style={styles.welcomeText}>
          Welcome Back,
        </Animatable.Text>
        <Animatable.Text animation="fadeInRight" delay={300} style={styles.userName}>
          {userName}
        </Animatable.Text>
        <Animatable.Text animation="fadeInUp" delay={500} style={styles.emoji}>
          👋
        </Animatable.Text>

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
    marginTop: 80
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