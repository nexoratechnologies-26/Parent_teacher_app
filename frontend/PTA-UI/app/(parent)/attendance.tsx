import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Shadows, BorderRadius, Spacing } from '@/constants/theme';
import { BottomLandscape } from '@/components/ui/BottomLandscape';
import { parentApi } from '@/services/parentApi';
import { MonthlyAttendanceResponse, DailyAttendanceRecord } from '@/services/types';

const { width } = Dimensions.get('window');

export default function ParentAttendanceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ studentId?: string }>();

  const studentId = params.studentId || 'stu_01';

  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 12)); // August 2026
  const [attendanceData, setAttendanceData] = useState<MonthlyAttendanceResponse | null>(null);
  const [selectedDay, setSelectedDay] = useState<DailyAttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const fetchAttendance = useCallback(async () => {
    try {
      const data = await parentApi.getAttendance(studentId, month, year);
      setAttendanceData(data);

      // Default selected day: current day or 1st record
      const todayStr = `${year}-${String(month).padStart(2, '0')}-12`;
      const foundToday = data.monthlyRecords.find((r) => r.date === todayStr);
      setSelectedDay(foundToday || data.monthlyRecords[0] || null);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentId, month, year]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance();
  };

  const handlePrevMonth = () => {
    setLoading(true);
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setLoading(true);
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Calendar rendering helpers
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0 is Sun
  // Convert to Mon (0) to Sun (6)
  const startOffset = (firstDayOfMonth + 6) % 7;

  const totalDays = new Date(year, month, 0).getDate();
  const calendarCells: (DailyAttendanceRecord | null)[] = [];

  // Padding cells before first day
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push(null);
  }

  // Day cells
  if (attendanceData) {
    attendanceData.monthlyRecords.forEach((record) => {
      calendarCells.push(record);
    });
  }

  if (loading && !attendanceData) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading Attendance Records...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
          }
        >
          {/* Top Bar */}
          <View style={styles.topNav}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={[styles.navButton, Shadows.soft]}
            >
              <Ionicons name="arrow-back" size={20} color="#1E293B" />
            </TouchableOpacity>

            <Text style={styles.navTitle}>Attendance</Text>

            <TouchableOpacity
              onPress={fetchAttendance}
              activeOpacity={0.7}
              style={[styles.navButton, Shadows.soft]}
            >
              <Ionicons name="refresh" size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>

          {/* Month Navigator */}
          <View style={[styles.monthSelector, Shadows.soft]}>
            <TouchableOpacity
              onPress={handlePrevMonth}
              activeOpacity={0.7}
              style={styles.monthArrowButton}
            >
              <Ionicons name="chevron-back" size={20} color="#1E293B" />
            </TouchableOpacity>

            <View style={styles.monthCenter}>
              <Ionicons name="calendar" size={18} color="#10B981" style={{ marginRight: 6 }} />
              <Text style={styles.monthTitle}>
                {attendanceData?.monthName} {year}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleNextMonth}
              activeOpacity={0.7}
              style={styles.monthArrowButton}
            >
              <Ionicons name="chevron-forward" size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>

          {/* Attendance KPI Summary Card */}
          <View style={[styles.summaryCard, Shadows.cardElevated]}>
            {/* Left circular percentage gauge */}
            <View style={styles.scoreGaugeContainer}>
              <View style={styles.scoreGauge}>
                <Text style={styles.scorePercent}>
                  {attendanceData?.attendancePercentage ?? 96}%
                </Text>
                <Text style={styles.scoreLabel}>Present</Text>
              </View>
            </View>

            {/* Right 3 status metric badges */}
            <View style={styles.metricsContainer}>
              {/* Present */}
              <View style={[styles.metricItem, styles.presentMetric]}>
                <View style={[styles.metricDot, { backgroundColor: '#10B981' }]} />
                <View>
                  <Text style={styles.metricCount}>{attendanceData?.presentDays ?? 0} Days</Text>
                  <Text style={styles.metricName}>Present</Text>
                </View>
              </View>

              {/* Absent */}
              <View style={[styles.metricItem, styles.absentMetric]}>
                <View style={[styles.metricDot, { backgroundColor: '#EF4444' }]} />
                <View>
                  <Text style={styles.metricCount}>{attendanceData?.absentDays ?? 0} Days</Text>
                  <Text style={styles.metricName}>Absent</Text>
                </View>
              </View>

              {/* Holidays */}
              <View style={[styles.metricItem, styles.holidayMetric]}>
                <View style={[styles.metricDot, { backgroundColor: '#F59E0B' }]} />
                <View>
                  <Text style={styles.metricCount}>{attendanceData?.holidayDays ?? 0} Days</Text>
                  <Text style={styles.metricName}>Holidays</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Interactive Calendar Card */}
          <View style={[styles.calendarCard, Shadows.soft]}>
            {/* Days of Week Header */}
            <View style={styles.weekdaysHeader}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <Text key={idx} style={styles.weekdayText}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {calendarCells.map((record, index) => {
                if (!record) {
                  return <View key={`empty_${index}`} style={styles.calendarDayCell} />;
                }

                const dayNum = parseInt(record.date.split('-')[2], 10);
                const isSelected = selectedDay?.date === record.date;

                let cellStyle = styles.cellDefault;
                let textStyle = styles.dayNumberDefault;

                if (record.status === 'PRESENT') {
                  cellStyle = styles.cellPresent;
                  textStyle = styles.dayNumberPresent;
                } else if (record.status === 'ABSENT') {
                  cellStyle = styles.cellAbsent;
                  textStyle = styles.dayNumberAbsent;
                } else if (record.status === 'HOLIDAY') {
                  cellStyle = styles.cellHoliday;
                  textStyle = styles.dayNumberHoliday;
                } else {
                  cellStyle = styles.cellWeekend;
                  textStyle = styles.dayNumberWeekend;
                }

                return (
                  <TouchableOpacity
                    key={record.date}
                    activeOpacity={0.7}
                    onPress={() => setSelectedDay(record)}
                    style={[
                      styles.calendarDayCell,
                      cellStyle,
                      isSelected && styles.cellSelectedRing,
                    ]}
                  >
                    <Text style={[styles.dayNumber, textStyle]}>{dayNum}</Text>
                    {record.status === 'PRESENT' && (
                      <View style={styles.statusDotPresent} />
                    )}
                    {record.status === 'ABSENT' && (
                      <View style={styles.statusDotAbsent} />
                    )}
                    {record.status === 'HOLIDAY' && (
                      <View style={styles.statusDotHoliday} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Selected Date Detail Inspection Card */}
          {selectedDay && (
            <View style={[styles.dayDetailCard, Shadows.soft]}>
              <View style={styles.dayDetailHeader}>
                <View style={styles.dayDetailDateWrapper}>
                  <Ionicons name="calendar-outline" size={18} color="#10B981" style={{ marginRight: 6 }} />
                  <Text style={styles.dayDetailDate}>
                    {selectedDay.dayOfWeek}, {selectedDay.date}
                  </Text>
                </View>

                {/* Status Pill */}
                {selectedDay.status === 'PRESENT' && (
                  <View style={[styles.pill, styles.pillPresent]}>
                    <Ionicons name="checkmark-circle" size={14} color="#15803D" style={{ marginRight: 4 }} />
                    <Text style={styles.pillTextPresent}>Present</Text>
                  </View>
                )}
                {selectedDay.status === 'ABSENT' && (
                  <View style={[styles.pill, styles.pillAbsent]}>
                    <Ionicons name="close-circle" size={14} color="#B91C1C" style={{ marginRight: 4 }} />
                    <Text style={styles.pillTextAbsent}>Absent</Text>
                  </View>
                )}
                {selectedDay.status === 'HOLIDAY' && (
                  <View style={[styles.pill, styles.pillHoliday]}>
                    <Ionicons name="sparkles" size={14} color="#B45309" style={{ marginRight: 4 }} />
                    <Text style={styles.pillTextHoliday}>Holiday</Text>
                  </View>
                )}
                {selectedDay.status === 'WEEKEND' && (
                  <View style={[styles.pill, styles.pillWeekend]}>
                    <Text style={styles.pillTextWeekend}>Weekend</Text>
                  </View>
                )}
              </View>

              {/* Note / Checkin Details */}
              <View style={styles.dayDetailBody}>
                {selectedDay.status === 'PRESENT' && (
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color="#64748B" />
                    <Text style={styles.detailText}>
                      Checked in at <Text style={styles.boldText}>{selectedDay.checkInTime || '8:30 AM'}</Text>
                    </Text>
                  </View>
                )}
                {selectedDay.status === 'ABSENT' && (
                  <View style={styles.detailRow}>
                    <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
                    <Text style={styles.detailText}>
                      Reason: <Text style={styles.boldText}>{selectedDay.reason || 'Medical Leave'}</Text>
                    </Text>
                  </View>
                )}
                {selectedDay.status === 'HOLIDAY' && (
                  <View style={styles.detailRow}>
                    <Ionicons name="flag-outline" size={16} color="#F59E0B" />
                    <Text style={styles.detailText}>
                      Occasion: <Text style={styles.boldText}>{selectedDay.reason || 'Public Holiday'}</Text>
                    </Text>
                  </View>
                )}
                {selectedDay.status === 'WEEKEND' && (
                  <View style={styles.detailRow}>
                    <Ionicons name="sunny-outline" size={16} color="#64748B" />
                    <Text style={styles.detailText}>No school on weekends.</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Legend Guide */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.legendLabel}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendLabel}>Absent</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.legendLabel}>Holiday</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: '#CBD5E1' }]} />
              <Text style={styles.legendLabel}>Weekend</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Atmospheric Bottom Decoration */}
      <BottomLandscape />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 95,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ECE5D8',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#EFE8DC',
    marginBottom: 16,
  },
  monthArrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F5EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xxl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EFE8DC',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreGaugeContainer: {
    marginRight: 16,
  },
  scoreGauge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#F0FDF4',
    borderWidth: 6,
    borderColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
  },
  scorePercent: {
    fontSize: 22,
    fontWeight: '900',
    color: '#15803D',
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
    marginTop: -2,
  },
  metricsContainer: {
    flex: 1,
    justifyContent: 'space-around',
    height: 88,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
  },
  presentMetric: {
    backgroundColor: '#F0FDF4',
  },
  absentMetric: {
    backgroundColor: '#FEF2F2',
  },
  holidayMetric: {
    backgroundColor: '#FFFBEB',
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  metricCount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  metricName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xxl,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#EFE8DC',
    marginBottom: 16,
  },
  weekdaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1ECE1',
    marginBottom: 8,
  },
  weekdayText: {
    width: (width - 68) / 7,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDayCell: {
    width: (width - 68) / 7,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
    borderRadius: 12,
    position: 'relative',
  },
  cellDefault: {
    backgroundColor: 'transparent',
  },
  cellPresent: {
    backgroundColor: '#DCFCE7',
  },
  cellAbsent: {
    backgroundColor: '#FEE2E2',
  },
  cellHoliday: {
    backgroundColor: '#FEF3C7',
  },
  cellWeekend: {
    backgroundColor: '#F8FAFC',
  },
  cellSelectedRing: {
    borderWidth: 2,
    borderColor: '#0284C7',
    transform: [{ scale: 1.05 }],
  },
  dayNumber: {
    fontSize: 13,
    fontWeight: '700',
  },
  dayNumberDefault: {
    color: '#334155',
  },
  dayNumberPresent: {
    color: '#15803D',
  },
  dayNumberAbsent: {
    color: '#B91C1C',
  },
  dayNumberHoliday: {
    color: '#B45309',
  },
  dayNumberWeekend: {
    color: '#94A3B8',
  },
  statusDotPresent: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#16A34A',
    marginTop: 2,
  },
  statusDotAbsent: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DC2626',
    marginTop: 2,
  },
  statusDotHoliday: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D97706',
    marginTop: 2,
  },
  dayDetailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EFE8DC',
    marginBottom: 14,
  },
  dayDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayDetailDateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayDetailDate: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
  },
  pillPresent: {
    backgroundColor: '#DCFCE7',
  },
  pillTextPresent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  pillAbsent: {
    backgroundColor: '#FEE2E2',
  },
  pillTextAbsent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B91C1C',
  },
  pillHoliday: {
    backgroundColor: '#FEF3C7',
  },
  pillTextHoliday: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  pillWeekend: {
    backgroundColor: '#F1F5F9',
  },
  pillTextWeekend: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  dayDetailBody: {
    backgroundColor: '#FAF7F2',
    borderRadius: BorderRadius.lg,
    padding: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    color: '#475569',
    marginLeft: 6,
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.full,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#ECE5D8',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
});
