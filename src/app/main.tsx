import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import BottomBar from '../components/main/BottomBar';
import LeaveTable from '../components/main/LeaveTable';
import StatusSection from '../components/main/StatusSection';
import SwipeCard from '../components/main/SwipeCard';
import TopCard from '../components/main/TopView';
import { CyberGradient } from '../components/shared/CyberGradient';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/userContext';
import { ensureUserExists, getCurrentSessionUser } from '../services/session';

export default function MainScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('User');
  const { setUser } = useUser();
  const { showToast } = useToast();



  useEffect(() => {


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



  if (!userId) return null;

  return (
    <CyberGradient>
      <SafeAreaView style={styles.container}>
        <TopCard userName={userName} />
        <LeaveTable availableLeaves={15} leavesTaken={12} />
        <SwipeCard userId={userId} />
        <StatusSection userId={userId} />
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
  }
});