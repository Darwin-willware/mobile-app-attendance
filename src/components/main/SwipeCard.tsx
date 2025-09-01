import { toast } from '@backpackapp-io/react-native-toast';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ColorValue, Dimensions, StyleSheet, Text, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gradients, Lat, Long, SSID } from '../../constants/constants';
import { checkIn, checkOut, convertUTCToIST, getTodayCheckInStatus } from '../../services/users';
import { validateUserPresence } from '../../services/wifi/checkIn-validator';
import { Status } from '../../types/models';

const { width } = Dimensions.get('window');



const SwipeCard = ({ userId }: { userId: string }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [totalHours, setTotalHours] = useState<string | null>(null);
  const [Loading, setLoading] = useState<boolean>(false);
  const [onWifi, setOnWifi] = useState<boolean>(false);
  const translateX = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        setLoading(true); // Start loading

        const presence = await validateUserPresence(Lat, Long, SSID);
        setOnWifi(presence.isInLocation || presence.isOnWiFi);
        if (!onWifi) {
          toast.error('Please connect to office Wi-Fi');
          setLoading(false);
          return;
        }
        try {
          const todayStatus = await getTodayCheckInStatus(userId);

          if (todayStatus?.check_in_time && !todayStatus?.check_out_time) {
            setStatus('checkedin');
            setCheckInTime(convertUTCToIST(todayStatus.check_in_time));
          } else if (todayStatus?.check_in_time && todayStatus?.check_out_time) {
            setStatus('checkedout');
            setCheckInTime(convertUTCToIST(todayStatus.check_in_time));
            setCheckOutTime(convertUTCToIST(todayStatus.check_out_time));
            setTotalHours(todayStatus.total_hours);
            toast.success(`You have already checked out. Total working hours: ${todayStatus.total_hours}`);
          } else {
            setStatus('idle');
          }
        } catch (error) {

        }

        setLoading(false); // End loading
      };

      init();
    }, [userId])
  );


  const updateStatus = async (newStatus: Status) => {
    if (!onWifi) {
      toast.error('Please connect to office Wi-Fi');
      return;
    }
    if (status === 'checkedin' && newStatus === 'checkedin') {
      toast.error('You have already checked in for today');
      return;
    }

    if (status === 'checkedout') {
      toast.error('You have already checked out for today');
      return;
    }

    setStatus(newStatus);

    try {
      if (newStatus === 'checkedin') {
        const result = await checkIn(userId);

        if (!result) {
          toast.error('No response from server');
          return;
        }

        if ('error' in result) {
          toast.error(result.error);
        } else {
          setCheckInTime(convertUTCToIST(result.check_in_time));
          toast.success('Checked In');
        }
      } else if (newStatus === 'checkedout') {
        const result = await checkOut(userId);

        if (!result) {
          toast.error('No response from server');
          return;
        }

        if ('error' in result) {
          toast.error(result.error);
        } else {
          setCheckOutTime(convertUTCToIST(result.check_out_time));
          setTotalHours(result.total_hours);
          toast.success('Checked Out');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onEnd: (event) => {
      if (event.translationX > 50) {
        runOnJS(updateStatus)('checkedin');
      } else if (event.translationX < -50) {
        runOnJS(updateStatus)('checkedout');
      } else {
        runOnJS(updateStatus)('idle');
      }
      translateX.value = withSpring(0);
    },
    onActive: (event) => {
      translateX.value = event.translationX;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const getGradientColors = (): readonly [ColorValue, ColorValue] => {
    switch (status) {
      case 'checkedin':
        return Gradients.checkIn;
      case 'checkedout':
        return Gradients.checkOut;
      default:
        return Gradients.defaultCard;
    }
  };

  const getCardText = () => {
    switch (status) {
      case 'checkedin':
        return `🧑‍💻 Checked In\nTime: ${checkInTime}\nSwipe left to check out`;
      case 'checkedout':
        return `🤷‍♂️ You have already checked out\n🕒 Check-In: ${checkInTime}\n🌙 Check-Out: ${checkOutTime}\n⏱️ Total Hours: ${totalHours}`;
      default:
        return '🌞 Start your day\nSwipe right to check in';
    }
  };

  return (
    <View style={styles.container}>
      {Loading ? (
        <ActivityIndicator size="large" color="#007AFF"></ActivityIndicator>
      ) : (
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <LinearGradient colors={getGradientColors()} style={styles.gradient}>
              <Text style={styles.text}>{getCardText()}</Text>
            </LinearGradient>
          </Animated.View>
        </PanGestureHandler>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.8,
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default SwipeCard;