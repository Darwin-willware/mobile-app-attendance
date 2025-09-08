// components/main/LeaveTable.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const LeaveTable = ({ availableLeaves, leavesTaken }:{availableLeaves:number,leavesTaken:number}) => {
  return (
    <View style={styles.tableContainer}>
      <Text style={styles.title}>Leave Summary</Text>
      <View style={styles.row}>
        <Text style={styles.cell}>Available Leaves</Text>
        <Text style={styles.cell}>{availableLeaves}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cell}>Leaves Taken</Text>
        <Text style={styles.cell}>{leavesTaken}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  cell: {
    fontSize: 16,
  },
});

export default LeaveTable;
