import { Gradients } from '@/src/constants/constants';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const LeaveTable = ({
  availableLeaves,
  leavesTaken,
}: {
  availableLeaves: number;
  leavesTaken: number;
}) => {
  const renderChip = (label: string, value: number, color: string) => (
    <View style={styles.row}>
      <View style={[styles.chip, { backgroundColor: color }]}>
        <Text style={styles.chipText}>{label}</Text>
      </View>
      <View style={[styles.chip, { backgroundColor: '#ffffff30' }]}>
        <Text style={styles.chipText}>{value}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={Gradients.checkOut} style={styles.container}>
      <Text style={styles.title}>Leave Summary</Text>
      {renderChip('Available Leaves', availableLeaves, '#4CAF50')}
      {renderChip('Leaves Taken', leavesTaken, '#F44336')}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 10,
    padding: 15,
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LeaveTable;
