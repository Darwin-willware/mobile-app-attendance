import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import BottomBar from '../components/main/BottomBar';
import LeaveTable from '../components/main/LeaveTable';
import StatusSection from '../components/main/StatusSection';
import SwipeCard from '../components/main/SwipeCard';
import TopCard from '../components/main/TopView';
import { CyberGradient } from '../components/shared/CyberGradient';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/userContext';
import { ensureUserExists, getCurrentSessionUser } from '../services/session';
import { getUserDetails } from '../services/users';
import { GetUserDetailsParams } from '../types/models';

const screenHeight = Dimensions.get('window').height;

export default function MainScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any>('User');
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
        fetchUserDetails({userId:userRecord.user_id});
      }
    };

    init();
  }, []);

const fetchUserDetails = async(userId:GetUserDetailsParams) =>{
  const res = await getUserDetails(userId);
setUserDetails(res);
}

  if (!userId) return null;

  return (
    <CyberGradient>
      <SafeAreaView style={styles.container}>
        <View style={{ height: '70%' }}>
          <TopCard userName={userDetails?.name} />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <LeaveTable availableLeaves={userDetails?.leaves_available} leavesTaken={userDetails?.leaves_taken} />
            <StatusSection userId={userId} />
          </ScrollView>
        </View>
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
    alignItems: 'stretch',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 60
  },
  scrollContent: {
    paddingBottom: 10,
  }
});