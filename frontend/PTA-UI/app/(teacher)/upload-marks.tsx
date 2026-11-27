import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { mockStudents } from '@/services/mockData';
import { BottomLandscape } from '@/components/ui/BottomLandscape';

const subjects = ['Mathematics', 'English', 'Science'];
export default function UploadMarksScreen() {
  const [subject, setSubject] = useState(subjects[0]);
  const [marks, setMarks] = useState('');
  const [studentId, setStudentId] = useState(mockStudents.find(student => student.grade === 'Grade 4')?.id ?? '');
  const student = mockStudents.find(item => item.id === studentId);
  const save = () => {
    const score = Number(marks);
    if (!student || !marks.trim() || !Number.isFinite(score) || score < 0 || score > 100) { Alert.alert('Check the marks', 'Enter a score from 0 to 100 and choose a student.'); return; }
    Alert.alert('Marks saved', `${score}/100 for ${student.name} • ${subject}`);
    setMarks('');
  };
  return <View style={styles.container}><SafeAreaView style={styles.safeArea}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <View style={styles.header}><View><Text style={styles.eyebrow}>ACADEMIC RECORDS</Text><Text style={styles.title}>Upload marks</Text></View><View style={styles.headerIcon}><Ionicons name="ribbon" size={22} color="#2563EB" /></View></View>
    <View style={styles.examCard}><View style={styles.examIcon}><Ionicons name="document-text" size={20} color="#2563EB" /></View><View><Text style={styles.examLabel}>CURRENT ASSESSMENT</Text><Text style={styles.examTitle}>Midterm Examinations 2026</Text></View></View>
    <Text style={styles.label}>Subject</Text><View style={styles.subjectRow}>{subjects.map(item => <TouchableOpacity key={item} onPress={() => setSubject(item)} style={[styles.subjectChip, subject === item && styles.subjectSelected]}><Text style={[styles.subjectText, subject === item && styles.subjectTextSelected]}>{item}</Text></TouchableOpacity>)}</View>
    <Text style={styles.label}>Student</Text><View style={styles.studentOptions}>{mockStudents.filter(item => item.grade === 'Grade 4').map(item => <TouchableOpacity key={item.id} onPress={() => setStudentId(item.id)} style={[styles.studentOption, studentId === item.id && styles.studentOptionSelected]}><View style={styles.avatar}><Text style={styles.avatarText}>{item.name.split(' ').map(part => part[0]).join('')}</Text></View><View style={{ flex: 1 }}><Text style={styles.studentName}>{item.name}</Text><Text style={styles.studentMeta}>Roll no. {item.rollNo}</Text></View><Ionicons name={studentId === item.id ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={studentId === item.id ? '#2563EB' : '#CBD5E1'} /></TouchableOpacity>)}</View>
    <Text style={styles.label}>Score <Text style={styles.labelHint}>out of 100</Text></Text><View style={styles.scoreInput}><TextInput value={marks} onChangeText={setMarks} keyboardType="number-pad" placeholder="Enter marks" placeholderTextColor="#94A3B8" style={styles.input} maxLength={3}/><Text style={styles.outOf}>/ 100</Text></View>
    <Text style={styles.helper}>The score will be added to the selected student’s midterm record.</Text>
    <TouchableOpacity style={styles.submitButton} onPress={save}><Text style={styles.submitText}>Save marks</Text><Ionicons name="arrow-forward" size={18} color="#FFFFFF" /></TouchableOpacity>
  </ScrollView></SafeAreaView><BottomLandscape /></View>;
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' }, safeArea: { flex: 1 }, content: { padding: 20, paddingBottom: 32 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }, eyebrow: { color: '#2563EB', fontSize: 11, fontWeight: '800', letterSpacing: 1 }, title: { color: '#1E293B', fontSize: 28, fontWeight: '800', marginTop: 4 }, headerIcon: { width: 46, height: 46, borderRadius: 16, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  examCard: { backgroundColor: '#EFF6FF', padding: 15, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 22 }, examIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }, examLabel: { color: '#60A5FA', fontSize: 10, fontWeight: '800', letterSpacing: 1 }, examTitle: { color: '#1E3A8A', fontSize: 14, fontWeight: '800', marginTop: 4 }, label: { color: '#1E293B', fontSize: 14, fontWeight: '800', marginBottom: 10, marginTop: 3 }, labelHint: { color: '#94A3B8', fontSize: 12, fontWeight: '500' }, subjectRow: { flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' }, subjectChip: { backgroundColor: '#FFFFFF', paddingHorizontal: 13, paddingVertical: 10, borderRadius: 13, borderWidth: 1, borderColor: '#ECE6DA' }, subjectSelected: { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' }, subjectText: { color: '#64748B', fontSize: 12, fontWeight: '700' }, subjectTextSelected: { color: '#2563EB' }, studentOptions: { gap: 9, marginBottom: 19 }, studentOption: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11, borderWidth: 1, borderColor: '#ECE6DA' }, studentOptionSelected: { borderColor: '#93C5FD', backgroundColor: '#F8FBFF' }, avatar: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#2563EB', fontWeight: '800' }, studentName: { color: '#1E293B', fontSize: 13, fontWeight: '800' }, studentMeta: { color: '#94A3B8', fontSize: 11, marginTop: 4 }, scoreInput: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#ECE6DA', borderRadius: 15, minHeight: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }, input: { flex: 1, color: '#1E293B', fontSize: 15 }, outOf: { color: '#94A3B8', fontSize: 13, fontWeight: '700' }, helper: { color: '#94A3B8', fontSize: 11, marginTop: 9, marginBottom: 20 }, submitButton: { backgroundColor: '#3B82F6', borderRadius: 16, minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, submitText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});
