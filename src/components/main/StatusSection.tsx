import { fetchAppliedEntries } from '@/src/services/apply-WFH-Leave/get_leave_wfh';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const StatusSection = ({ userId }: { userId: string }) => {
  const [appliedLeaves, setAppliedLeaves] = useState<any[]>([]);
  const [appliedWFH, setAppliedWFH] = useState<any[]>([]);

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
  }, [userId]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Applied Leaves</Text>
      {appliedLeaves.length === 0 ? (
        <Text>No upcoming leaves</Text>
      ) : (
        appliedLeaves.map((leave, index) => (
          <View key={index} style={styles.item}>
            <Text>{leave.date}</Text>
            <Text>Status: {leave.status}</Text>
          </View>
        ))
      )}

      <Text style={styles.title}>Applied WFH</Text>
      {appliedWFH.length === 0 ? (
        <Text>No upcoming WFH entries</Text>
      ) : (
        appliedWFH.map((wfh, index) => (
          <View key={index} style={styles.item}>
            <Text>{wfh.date}</Text>
            <Text>Status: {wfh.status}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 200,
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  item: {
    marginVertical: 5,
  },
});

export default StatusSection;
