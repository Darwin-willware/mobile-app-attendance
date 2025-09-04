import { useToast } from '@/src/context/ToastContext';
import { applyRequest } from '@/src/services/apply-WFH-Leave/apply_leave_wfh';
import { ApplyResult, BottomModalSheetProps, RequestType } from '@/src/types/models';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Gradients } from '../../constants/constants';

export default function BottomModalSheet({ visible, onClose, userId }: BottomModalSheetProps) {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const formattedDate = selectedDate?.toISOString().split('T')[0];

  const handleApply = async (type: RequestType) => {
    if (!formattedDate || !userId) return;

    setLoading(true);
    const result: ApplyResult = await applyRequest(userId, formattedDate, type);

    if ('conflict' in result) {
      Alert.alert(
        'Conflict Detected',
        `You have already applied for ${result.conflict.toUpperCase()} on this date. Do you want to change it to ${type.toUpperCase()}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes',
            onPress: async () => {
              const forcedResult: ApplyResult = await applyRequest(userId, formattedDate, type, true);

              if ('success' in forcedResult) {
                showToast(
                  forcedResult.success ? 'Applied successfully' : forcedResult.message,
                  forcedResult.success ? 'success' : 'error'
                );
                if (forcedResult.success) onClose();
              }
            },
          },
        ]
      );
    } else {
      if ('success' in result) {
        showToast(
          result.success ? 'Applied successfully' : result.message,
          result.success ? 'success' : 'error'
        );
        if (result.success) onClose();
      }
    }

    setLoading(false);
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <Pressable style={styles.overlay} onPress={onClose} />

        <LinearGradient colors={Gradients.bg} style={styles.sheet}>
          <Text style={styles.title}>Apply for Leave or WFH</Text>

          <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
            <Text style={styles.dateText}>
              {selectedDate ? selectedDate.toDateString() : 'Select a Date'}
            </Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={tomorrow}
          />

          {loading ? (
            <ActivityIndicator color="#fff" style={{ marginVertical: 10 }} />
          ) : (
            <>
              <LinearGradient colors={Gradients.checkOut} style={styles.actionButton}>
                <TouchableOpacity onPress={() => handleApply('leave')}>
                  <Text style={styles.buttonText}>Apply Leave</Text>
                </TouchableOpacity>
              </LinearGradient>

              <LinearGradient colors={Gradients.checkIn} style={styles.actionButton}>
                <TouchableOpacity onPress={() => handleApply('wfh')}>
                  <Text style={styles.buttonText}>Apply WFH</Text>
                </TouchableOpacity>
              </LinearGradient>
            </>
          )}

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  dateButton: {
    backgroundColor: '#ffffff20',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  dateText: {
    color: '#fff',
    textAlign: 'center',
  },
  actionButton: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  closeText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 10,
  },
});