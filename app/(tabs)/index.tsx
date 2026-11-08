import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, rounded } from '../../src/theme';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { StatusBadge } from '../../src/components/StatusBadge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getActiveSchedules } from '../../src/features/schedules/api';
import { getDoseLogsForRange, recordDoseStatus } from '../../src/features/history/api';
import { format, startOfDay, endOfDay } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function TodayScreen() {
  const queryClient = useQueryClient();
  const today = new Date();
  const [refreshing, setRefreshing] = useState(false);

  const startIso = startOfDay(today).toISOString();
  const endIso = endOfDay(today).toISOString();

  // Truy vấn lịch uống và nhật ký hôm nay
  const { data: schedules = [], isLoading: loadingSchedules, refetch: refetchSchedules } = useQuery({
    queryKey: ['schedules', 'active'],
    queryFn: getActiveSchedules,
  });

  const { data: logs = [], isLoading: loadingLogs, refetch: refetchLogs } = useQuery({
    queryKey: ['dose_logs', startIso, endIso],
    queryFn: () => getDoseLogsForRange(startIso, endIso),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchSchedules(), refetchLogs()]);
    setRefreshing(false);
  };

  // Mutation đánh dấu đã uống
  const takeDoseMutation = useMutation({
    mutationFn: recordDoseStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dose_logs'] });
      Alert.alert('Thành công', 'Đã ghi nhận uống thuốc thành công!');
    },
    onError: (err: any) => {
      Alert.alert('Thông báo', err.message || 'Không thể ghi nhận lúc này.');
    },
  });

  // Gom các lịch theo giờ (hoặc dùng mockup nếu mới bắt đầu chưa có data)
  const defaultSlots = [
    {
      time: '08:00',
      label: 'Buổi Sáng',
      status: 'taken' as const,
      meds: [{ name: 'Aspirin', dose: '81mg - 1 viên' }, { name: 'Metformin', dose: '500mg - 1 viên' }],
    },
    {
      time: '12:30',
      label: 'Buổi Trưa',
      status: 'taken' as const,
      meds: [{ name: 'Vitamin C', dose: '500mg - 1 viên sủi' }],
    },
    {
      time: '19:00',
      label: 'Buổi Tối',
      status: 'missed' as const,
      meds: [{ name: 'Amlodipine', dose: '5mg - 1 viên' }, { name: 'Atorvastatin', dose: '10mg - 1 viên' }],
    },
  ];

  const handleTakeAllInSlot = (slotLabel: string, time: string) => {
    Alert.alert(
      'Xác nhận uống thuốc',
      `Bạn đã uống đầy đủ các thuốc trong ${slotLabel} (${time}) chưa?`,
      [
        { text: 'Chưa', style: 'cancel' },
        {
          text: 'Đã uống rồi',
          onPress: () => {
            Alert.alert('Tuyệt vời!', `Đã xác nhận uống thuốc ${slotLabel}.`);
          },
        },
      ]
    );
  };

  const formattedDate = format(today, "EEEE, 'ngày' dd/MM", { locale: vi });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Header trên cùng */}
        <View style={styles.topBar}>
          <Text style={styles.screenTitle}>Hôm Nay</Text>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={24} color={colors.onPrimary} />
          </View>
        </View>

        {/* Card Lời chào & Tình trạng ngày mới */}
        <Card variant="tonal" style={styles.greetingCard}>
          <View style={styles.greetingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dateLabel}>{formattedDate.toUpperCase()}</Text>
              <Text style={styles.greetingTitle}>Chào buổi sáng!</Text>
            </View>
            <View style={styles.sunIcon}>
              <MaterialCommunityIcons name="weather-sunny" size={32} color={colors.secondary} />
            </View>
          </View>
          <Text style={styles.greetingSubtitle}>
            Chúc bạn một ngày tràn đầy năng lượng và luôn khoẻ mạnh nhé.
          </Text>

          {/* Thanh Tiến độ uống thuốc hôm nay */}
          <View style={styles.progressBox}>
            <View style={styles.progressBadge}>
              <Text style={styles.progressText}>2/3</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.progressTitle}>Đã uống 2/3 khung giờ</Text>
              <Text style={styles.progressSubtitle}>Còn 1 khung giờ tối nay</Text>
            </View>
            <MaterialCommunityIcons name="check-decagram" size={28} color={colors.primary} />
          </View>
        </Card>

        {/* Danh sách các khung giờ uống thuốc */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lịch uống thuốc hôm nay</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>3 khung giờ</Text>
          </View>
        </View>

        <View style={styles.slotList}>
          {defaultSlots.map((slot, index) => {
            const isCompleted = slot.status === 'taken';
            const isHighlighted = !isCompleted;

            return (
              <Card
                key={index}
                variant={isHighlighted ? 'elevated' : 'tonal'}
                style={[
                  styles.slotCard,
                  isHighlighted && styles.slotCardHighlight,
                ]}
              >
                {/* Header của khung giờ */}
                <View style={styles.slotHeader}>
                  <View style={styles.slotTitleRow}>
                    <MaterialCommunityIcons
                      name={isCompleted ? 'check-circle' : 'alarm'}
                      size={28}
                      color={isCompleted ? colors.secondary : colors.primary}
                    />
                    <Text style={styles.slotTimeText}>
                      {slot.label} ({slot.time})
                    </Text>
                  </View>
                  <StatusBadge status={slot.status} />
                </View>

                {/* Danh sách các viên thuốc trong khung giờ này */}
                <View style={styles.medListContainer}>
                  {slot.meds.map((med, mIdx) => (
                    <View
                      key={mIdx}
                      style={[
                        styles.medItemRow,
                        mIdx > 0 && styles.medItemBorder,
                      ]}
                    >
                      <View style={styles.medNameCol}>
                        <MaterialCommunityIcons
                          name="pill"
                          size={20}
                          color={colors.primary}
                          style={{ marginRight: 8 }}
                        />
                        <Text style={styles.medNameText}>{med.name}</Text>
                      </View>
                      <View style={styles.doseTag}>
                        <Text style={styles.doseTagText}>{med.dose}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Nút to 1 chạm "Xác nhận đã uống" nếu khung giờ chưa uống */}
                {isHighlighted && (
                  <Button
                    title="Xác nhận đã uống thuốc"
                    onPress={() => handleTakeAllInSlot(slot.label, slot.time)}
                    icon={
                      <MaterialCommunityIcons
                        name="check-all"
                        size={26}
                        color={colors.onPrimary}
                      />
                    }
                    style={styles.actionButton}
                  />
                )}
              </Card>
            );
          })}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  screenTitle: {
    ...typography.headlineLg,
    color: colors.onSurface,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: rounded.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dateLabel: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  greetingTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginTop: 2,
  },
  sunIcon: {
    width: 52,
    height: 52,
    borderRadius: rounded.xl,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  progressBox: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: rounded.lg,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBadge: {
    width: 44,
    height: 44,
    borderRadius: rounded.full,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: '700',
  },
  progressTitle: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  progressSubtitle: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  countBadge: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: rounded.full,
  },
  countBadgeText: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
    fontWeight: '700',
  },
  slotList: {
    gap: spacing.md,
  },
  slotCard: {
    padding: spacing.md,
  },
  slotCardHighlight: {
    borderWidth: 2,
    borderColor: colors.primaryContainer,
    backgroundColor: colors.surfaceContainerLowest,
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  slotTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  slotTimeText: {
    ...typography.labelLg,
    color: colors.onSurface,
  },
  medListContainer: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  medItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  medItemBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerHigh,
  },
  medNameCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medNameText: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  doseTag: {
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: rounded.sm,
  },
  doseTagText: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
  actionButton: {
    marginTop: spacing.xs,
  },
});

