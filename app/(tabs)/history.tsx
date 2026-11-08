import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, rounded } from '../../src/theme';
import { Card } from '../../src/components/Card';
import { StatusBadge } from '../../src/components/StatusBadge';

export default function HistoryScreen() {
  const historyItems = [
    {
      date: 'Hôm nay, 24/10',
      logs: [
        { time: '12:30', name: 'Vitamin C 500mg', status: 'taken' as const },
        { time: '08:00', name: 'Aspirin 81mg', status: 'taken' as const },
        { time: '08:00', name: 'Metformin 500mg', status: 'taken' as const },
      ],
    },
    {
      date: 'Hôm qua, 23/10',
      logs: [
        { time: '19:00', name: 'Amlodipine 5mg', status: 'taken' as const },
        { time: '12:30', name: 'Vitamin C 500mg', status: 'skipped' as const },
        { time: '08:00', name: 'Aspirin 81mg', status: 'taken' as const },
      ],
    },
    {
      date: 'Thứ Bảy, 22/10',
      logs: [
        { time: '19:00', name: 'Amlodipine 5mg', status: 'taken' as const },
        { time: '08:00', name: 'Metformin 500mg', status: 'taken' as const },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <Text style={styles.screenTitle}>Lịch Sử Uống Thuốc</Text>
        </View>

        {/* Card Tỷ lệ hoàn thành */}
        <Card variant="tonal" style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.circleProgress}>
              <Text style={styles.percentText}>92%</Text>
              <Text style={styles.percentSub}>Tuân thủ</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.summaryTitle}>Đều đặn 7 ngày qua</Text>
              <Text style={styles.summaryDesc}>
                Bạn duy trì thói quen uống thuốc rất tốt! Tiếp tục phát huy nhé.
              </Text>
            </View>
          </View>
        </Card>

        {/* Danh sách nhật ký theo từng ngày */}
        {historyItems.map((group, gIdx) => (
          <View key={gIdx} style={styles.dayGroup}>
            <Text style={styles.dayTitle}>{group.date}</Text>
            <Card variant="elevated" style={styles.logCard}>
              {group.logs.map((item, lIdx) => (
                <View
                  key={lIdx}
                  style={[
                    styles.logRow,
                    lIdx > 0 && styles.logBorder,
                  ]}
                >
                  <View style={styles.timeCol}>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 12 }}>
                    <Text style={styles.medNameText}>{item.name}</Text>
                  </View>
                  <StatusBadge status={item.status} />
                </View>
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  topBar: {
    marginBottom: spacing.md,
  },
  screenTitle: {
    ...typography.headlineLg,
    color: colors.onSurface,
  },
  summaryCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleProgress: {
    width: 72,
    height: 72,
    borderRadius: rounded.full,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    ...typography.headlineMd,
    color: colors.onSecondaryContainer,
    fontWeight: '800',
  },
  percentSub: {
    ...typography.caption,
    color: colors.onSecondaryContainer,
    fontSize: 10,
    marginTop: -2,
  },
  summaryTitle: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
  },
  summaryDesc: {
    ...typography.bodyMd,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 20,
  },
  dayGroup: {
    marginBottom: spacing.md,
  },
  dayTitle: {
    ...typography.labelLg,
    color: colors.onSurface,
    marginBottom: 8,
  },
  logCard: {
    padding: 0,
    overflow: 'hidden',
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
  },
  logBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerHigh,
  },
  timeCol: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: rounded.sm,
  },
  timeText: {
    ...typography.labelSm,
    color: colors.primary,
  },
  medNameText: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
});

