import { useUser } from '@/src/context/userContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gradients } from '../../constants/constants';
import SignOut from '../auth/SignOut';
import GradButton from '../shared/GradButton';
import BottomModalSheet from './BottomModalSheet';
import { ProfileIcon } from './profileIcon';

type BottomBarProps = {
  style?: ViewStyle;
};

export default function BottomBar({ style }: BottomBarProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const {user} = useUser();
  return (
    <SafeAreaView style={[styles.container, style]} edges={['bottom']}>
      <LinearGradient
        colors={Gradients.bg}
        style={styles.bar}
      >
        <ProfileIcon />
        <GradButton text="More" gradientColors={Gradients.more} onPress={() => setModalVisible(true)} />
        <SignOut />
      </LinearGradient>
      <BottomModalSheet userId={user?.id} visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});