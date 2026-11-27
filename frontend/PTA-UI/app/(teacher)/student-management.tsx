import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { mockStudents } from '@/services/mockData';
import { BottomLandscape } from '@/components/ui/BottomLandscape';

const classRoster = mockStudents.filter(student => student.grade === 'Grade 4');

export default function StudentManagementScreen() {
  const [query, setQuery] = useState('');
  const students = useMemo(() => classRoster.filter(student => student.name.toLowerCase().includes(query.toLowerCase()) || student.rollNo.includes(query)), [query]);
  return <View style={styles.container}><SafeAreaView style={styles.safeArea}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <View style={styles.header}><View><Text style={styles.eyebrow}>YOUR CLASSROOM</Text><Text style={styles.title}>Students</Text></View><TouchableOpacity accessibilityRole="button" style={styles.addButton}><Ionicons name="add" size={22} color="#FFFFFF" /></TouchableOpacity></View>
    <View style={styles.classCard}><View style={styles.classIcon}><Ionicons name="people" size={21} color="#8B5CF6" /></View><View style={{ flex: 1 }}><Text style={styles.className}>Grade 4 • Section B</Text><Text style={styles.classMeta}>{classRoster.length} students in your roster</Text></View><Ionicons name="chevron-down" size={18} color="#64748B" /></View>
    <View style={styles.searchBox}><Ionicons name="search" size={19} color="#94A3B8" /><TextInput value={query} onChangeText={setQuery} placeholder="Search name or roll number" placeholderTextColor="#94A3B8" style={styles.searchInput} /></View>
    <View style={styles.sectionRow}><Text style={styles.sectionTitle}>Class roster</Text><Text style={styles.resultCount}>{students.length} students</Text></View>
    {students.map(student => <View key={student.id} style={styles.studentCard}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{student.name.split(' ').map(part => part[0]).join('')}</Text></View>
      <View style={{ flex: 1 }}><Text style={styles.studentName}>{student.name}</Text><Text style={styles.studentMeta}>Roll no. {student.rollNo} • Section {student.section}</Text><Text style={styles.parentText}>Parent: {student.parent.name}</Text></View>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={`More actions for ${student.name}`} style={styles.moreButton}><Ionicons name="ellipsis-vertical" size={18} color="#64748B" /></TouchableOpacity>
    </View>)}
    {students.length === 0 && <View style={styles.empty}><Ionicons name="search-outline" size={28} color="#94A3B8"/><Text style={styles.emptyText}>No students found</Text></View>}
    <View style={styles.infoCard}><Ionicons name="information-circle-outline" size={18} color="#8B5CF6"/><Text style={styles.infoText}>Student details are managed by the school administrator.</Text></View>
  </ScrollView></SafeAreaView><BottomLandscape /></View>;
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' }, safeArea: { flex: 1 }, content: { padding: 20, paddingBottom: 32 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }, eyebrow: { color: '#8B5CF6', fontSize: 11, fontWeight: '800', letterSpacing: 1 }, title: { color: '#1E293B', fontSize: 28, fontWeight: '800', marginTop: 4 }, addButton: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
  classCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#ECE6DA' }, classIcon: { width: 42, height: 42, backgroundColor: '#F5F3FF', borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, className: { color: '#1E293B', fontWeight: '800', fontSize: 14 }, classMeta: { color: '#94A3B8', fontSize: 11, marginTop: 4 }, searchBox: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#ECE6DA', borderRadius: 15, height: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 9, marginTop: 16 }, searchInput: { flex: 1, color: '#1E293B', fontSize: 13 }, sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 10 }, sectionTitle: { color: '#1E293B', fontSize: 18, fontWeight: '800' }, resultCount: { color: '#64748B', fontSize: 12, fontWeight: '600' },
  studentCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#ECE6DA' }, avatar: { width: 46, height: 46, borderRadius: 16, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#7C3AED', fontWeight: '800' }, studentName: { color: '#1E293B', fontSize: 14, fontWeight: '800' }, studentMeta: { color: '#64748B', fontSize: 11, marginTop: 4 }, parentText: { color: '#94A3B8', fontSize: 11, marginTop: 4 }, moreButton: { padding: 7 }, infoCard: { backgroundColor: '#F5F3FF', padding: 13, borderRadius: 14, flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8 }, infoText: { color: '#6D5AA8', fontSize: 11, flex: 1 }, empty: { alignItems: 'center', padding: 32, gap: 8 }, emptyText: { color: '#64748B', fontSize: 13 },
});
