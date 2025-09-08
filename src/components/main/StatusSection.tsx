import { Gradients } from '@/src/constants/constants';
import { useStatusRefresh } from '@/src/context/StatusRefreshContext';
import { fetchAppliedEntries } from '@/src/services/apply-WFH-Leave/get_leave_wfh';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const StatusSection = ({ userId }: { userId: string }) => {
  const [appliedLeaves, setAppliedLeaves] = useState<any[]>([]);
  const [appliedWFH, setAppliedWFH] = useState<any[]>([]);
 const {refreshKey} = useStatusRefresh();
  useEffect(() => {
    const fetchData = async () => {
      const leaves = await fetchAppliedEntries(userId, 'applied_leaves');
      const wfh = await fetchAppliedEntries(userId, 'applied_wfh');
      setAppliedLeaves(leaves);
      setAppliedWFH(wfh);
    };

    if (userId) {
      fetchData();
    }
  }, [userId,refreshKey]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return '#4CAF50'; 
      case 'requested':
        return '#2196F3'; 
      case 'rejected':
        return '#F44336'; 
      default:
        return '#999';
    }
  };

  const renderChip = (label: string, backgroundColor: string) => (
    <View style={[styles.chip, { backgroundColor }]}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );

  return (
    <LinearGradient colors={Gradients.defaultCard} style={styles.gradient}>
      
        <Text style={[styles.title, { color: '#00F5FF' }]}>Applied Leaves</Text>
        {appliedLeaves.length === 0 ? (
          <Text style={styles.empty}>No Leaves Applied</Text>
        ) : (
          appliedLeaves.map((leave, index) => (
            <View key={index} style={styles.row}>
              {renderChip(leave.date, '#ffffff30')}
              {renderChip(leave.status, getStatusColor(leave.status))}
            </View>
          ))
        )}

        <Text style={[styles.title, { color: '#FFB347' }]}>Applied WFH</Text>
        {appliedWFH.length === 0 ? (
          <Text style={styles.empty}>No WFH Applied</Text>
        ) : (
          appliedWFH.map((wfh, index) => (
            <View key={index} style={styles.row}>
              {renderChip(wfh.date, '#ffffff30')}
              {renderChip(wfh.status, getStatusColor(wfh.status))}
            </View>
          ))
        )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 12,
    marginVertical: 10,
    padding: 15,
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent:'space-between'
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  empty: {
    color: '#ccc',
    fontStyle: 'italic',
    marginBottom: 10,
  },
});

export default StatusSection;
