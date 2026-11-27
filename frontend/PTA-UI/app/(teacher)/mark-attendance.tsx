import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { mockStudents } from '@/services/mockData';
import { BottomLandscape } from '@/components/ui/BottomLandscape';

const classRoster = mockStudents.filter((student) => student.grade === 'Grade 4');

export default function MarkAttendanceScreen() {
  const [statuses, setStatuses] = useState<Record<string, boolean>>({});
  const presentCount = useMemo(() => classRoster.filter((student) => statuses[student.id] !== false).length, [statuses]);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View><Text style={styles.eyebrow}>GRADE 4 • SECTION B</Text><Text style={styles.title}>Attendance</Text></View>
            <View style={styles.headerIcon}><Ionicons name="calendar" size={22} color="#059669" /></View>
          </View>
          <View style={styles.dateCard}>
            <View style={styles.dateIcon}><Ionicons name="today-outline" size={20} color="#059669" /></View>
            <View style={{ flex: 1 }}><Text style={styles.dateLabel}>TODAY</Text><Text style={styles.dateText}>{today}</Text></View>
            <Text style={styles.countText}>{presentCount}/{mockStudents.length} present</Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}><Text style={styles.summaryValue}>{presentCount}</Text><Text style={styles.summaryLabel}>Present</Text></View>
            <View style={styles.summaryCard}><Text style={[styles.summaryValue, { color: '#EF4444' }]}>{classRoster.length - presentCount}</Text><Text style={styles.summaryLabel}>Absent</Text></View>
            <View style={styles.summaryCard}><Text style={[styles.summaryValue, { color: '#64748B' }]}>{classRoster.length}</Text><Text style={styles.summaryLabel}>Students</Text></View>
          </View>
          <Text style={styles.sectionTitle}>Class roster</Text>
          {classRoster.map((student) => {
            const isPresent = statuses[student.id] !== false;
            return <View key={student.id} style={styles.studentCard}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{student.name.split(' ').map(part => part[0]).join('')}</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.studentName}>{student.name}</Text><Text style={styles.studentMeta}>Roll no. {student.rollNo} • Grade 4-B</Text></View>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Mark ${student.name} ${isPresent ? 'absent' : 'present'}`} onPress={() => setStatuses(current => ({ ...current, [student.id]: !isPresent }))} style={[styles.statusButton, isPresent ? styles.presentButton : styles.absentButton]}>
                <Ionicons name={isPresent ? 'checkmark-circle' : 'close-circle'} size={17} color={isPresent ? '#059669' : '#DC2626'} />
                <Text style={[styles.statusText, { color: isPresent ? '#059669' : '#DC2626' }]}>{isPresent ? 'Present' : 'Absent'}</Text>
              </TouchableOpacity>
            </View>;
          })}
          <TouchableOpacity style={styles.submitButton} onPress={() => Alert.alert('Attendance saved', 'Today’s attendance has been recorded.') }>
            <Text style={styles.submitText}>Save attendance</Text><Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.note}>Attendance changes are saved for today’s class register.</Text>
        </ScrollView>
      </SafeAreaView>
      <BottomLandscape />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' }, safeArea: { flex: 1 }, content: { padding: 20, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }, eyebrow: { color: '#059669', fontSize: 11, fontWeight: '800', letterSpacing: 1 }, title: { color: '#1E293B', fontSize: 28, fontWeight: '800', marginTop: 4 }, headerIcon: { width: 46, height: 46, borderRadius: 16, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center' },
  dateCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#ECE6DA' }, dateIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center' }, dateLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '800', letterSpacing: 1 }, dateText: { color: '#1E293B', fontSize: 15, fontWeight: '700', marginTop: 3 }, countText: { color: '#059669', fontSize: 12, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', gap: 10, marginVertical: 18 }, summaryCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#ECE6DA' }, summaryValue: { color: '#059669', fontSize: 22, fontWeight: '800' }, summaryLabel: { color: '#64748B', fontSize: 12, marginTop: 3 }, sectionTitle: { fontSize: 18, color: '#1E293B', fontWeight: '800', marginBottom: 10 },
  studentCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 13, marginBottom: 10, borderWidth: 1, borderColor: '#ECE6DA' }, avatar: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#B45309', fontWeight: '800' }, studentName: { color: '#1E293B', fontSize: 14, fontWeight: '700' }, studentMeta: { color: '#94A3B8', fontSize: 11, marginTop: 4 }, statusButton: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 12, paddingHorizontal: 9, paddingVertical: 8 }, presentButton: { backgroundColor: '#ECFDF5' }, absentButton: { backgroundColor: '#FEF2F2' }, statusText: { fontSize: 11, fontWeight: '700' },
  submitButton: { backgroundColor: '#10B981', marginTop: 12, borderRadius: 16, minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, submitText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 }, note: { color: '#94A3B8', textAlign: 'center', fontSize: 11, marginTop: 12 },
});
