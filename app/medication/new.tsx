import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, rounded } from '../../src/theme';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { Header } from '../../src/components/Header';
import { createMedication } from '../../src/features/medications/api';
import { createSchedule } from '../../src/features/schedules/api';
import { scheduleMedicationReminder } from '../../src/lib/notifications';
import { useQueryClient } from '@tanstack/react-query';

export default function NewMedicationScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('1 viên');
  const [stock, setStock] = useState('30');
  const [notes, setNotes] = useState('');
  const [medType, setMedType] = useState('Viên nén');
  const [mealTiming, setMealTiming] = useState('Sau khi ăn');
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['08:00']);
  const [loading, setLoading] = useState(false);

  const availableSlots = [
    { label: 'Sáng', time: '08:00', icon: 'weather-sunny' },
    { label: 'Trưa', time: '12:30', icon: 'white-balance-sunny' },
    { label: 'Tối', time: '19:00', icon: 'weather-night' },
  ];

  const medTypes = [
    { label: 'Viên nén', icon: 'pill' },
    { label: 'Siro / Nước', icon: 'flask-outline' },
    { label: 'Khác', icon: 'dots-horizontal-circle-outline' },
  ];

  const mealOptions = [
    { label: 'Sau khi ăn', desc: 'Tốt cho dạ dày', icon: 'silverware-fork-knife' },
    { label: 'Trước khi ăn', desc: 'Uống lúc đói', icon: 'clock-outline' },
    { label: 'Trong bữa ăn', desc: 'Cùng thức ăn', icon: 'food-apple-outline' },
  ];

  const toggleSlot = (time: string) => {
    if (selectedTimes.includes(time)) {
      if (selectedTimes.length === 1) {
        Alert.alert('Lưu ý', 'Thuốc cần ít nhất 1 khung giờ uống trong ngày.');
        return;
      }
      setSelectedTimes(selectedTimes.filter((t) => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên thuốc.');
      return;
    }

    try {
      setLoading(true);

      // Ghép thông tin cách dùng vào ghi chú
      const fullNotes = [
        notes.trim(),
        mealTiming ? `Cách dùng: ${mealTiming}` : '',
        medType ? `Dạng: ${medType}` : '',
      ]
        .filter(Boolean)
        .join(' • ');

      // 1. Tạo thuốc trong Supabase
      const newMed = await createMedication({
        name: name.trim(),
        dosage: dosage.trim() || '1 liều',
        stock: stock ? parseInt(stock, 10) : undefined,
        notes: fullNotes || undefined,
        low_stock_threshold: 5,
      });

      // 2. Tạo lịch uống tương ứng cho mỗi khung giờ đã chọn
      for (const time of selectedTimes) {
        const schedule = await createSchedule({
          medication_id: newMed.id,
          time_of_day: time,
          dose_amount: 1,
        });

        // 3. Đặt chuông nhắc nhở cục bộ trên máy
        try {
          await scheduleMedicationReminder(schedule, newMed);
        } catch {
          // Bỏ qua lỗi đặt chuông nếu chưa có quyền
        }
      }

      // Làm mới dữ liệu cache
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['schedules'] });

      Alert.alert('Thành công', 'Đã thêm thuốc mới và đặt lịch nhắc nhở!', [
        {
          text: 'Đồng ý',
          onPress: () => router.back(),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể lưu thuốc lúc này.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Thêm Thuốc Mới"
        showBack
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Banner giới thiệu */}
          <Card variant="tonal" style={styles.infoBanner}>
            <View style={styles.bannerIcon}>
              <MaterialCommunityIcons
                name="medical-bag"
                size={28}
                color={colors.primary}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.bannerTitle}>Thêm thuốc vào tủ thuốc</Text>
              <Text style={styles.bannerSubtitle}>
                Điền thông tin bên dưới để ứng dụng reo chuông đúng giờ
              </Text>
            </View>
          </Card>

          {/* Tên thuốc */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Tên thuốc <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Panadol, Amlodipine 5mg..."
              placeholderTextColor={colors.outline}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Dạng thuốc (Chips theo Stitch) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dạng thuốc</Text>
            <View style={styles.typeGrid}>
              {medTypes.map((t) => {
                const isSelected = medType === t.label;
                return (
                  <TouchableOpacity
                    key={t.label}
                    onPress={() => setMedType(t.label)}
                    style={[
                      styles.typeChip,
                      isSelected && styles.typeChipActive,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={t.icon as any}
                      size={24}
                      color={isSelected ? colors.onPrimary : colors.primary}
                    />
                    <Text
                      style={[
                        styles.typeChipText,
                        isSelected && styles.typeChipTextActive,
                      ]}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Liều lượng mỗi lần */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Liều lượng mỗi lần uống</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: 1 viên, 5ml, 1 gói..."
              placeholderTextColor={colors.outline}
              value={dosage}
              onChangeText={setDosage}
            />
          </View>

          {/* Cách dùng (Trước / Sau ăn theo Stitch) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cách dùng</Text>
            <View style={styles.mealList}>
              {mealOptions.map((opt) => {
                const isSelected = mealTiming === opt.label;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    onPress={() => setMealTiming(opt.label)}
                    style={[
                      styles.mealCard,
                      isSelected && styles.mealCardActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.mealIconBox,
                        isSelected && styles.mealIconBoxActive,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={opt.icon as any}
                        size={22}
                        color={isSelected ? colors.onPrimary : colors.primary}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text
                        style={[
                          styles.mealTitle,
                          isSelected && styles.mealTitleActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                      <Text style={styles.mealDesc}>{opt.desc}</Text>
                    </View>
                    {isSelected && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={22}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Số lượng tồn kho (để cảnh báo sắp hết) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số lượng thuốc có trong vỉ/hộp</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: 30"
              keyboardType="numeric"
              placeholderTextColor={colors.outline}
              value={stock}
              onChangeText={setStock}
            />
          </View>

          {/* Chọn khung giờ uống */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Khung giờ uống trong ngày</Text>
            <View style={styles.timeSlotRow}>
              {availableSlots.map((slot) => {
                const isSelected = selectedTimes.includes(slot.time);
                return (
                  <TouchableOpacity
                    key={slot.time}
                    onPress={() => toggleSlot(slot.time)}
                    style={[
                      styles.timeSlotChip,
                      isSelected && styles.timeSlotChipActive,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={slot.icon as any}
                      size={20}
                      color={isSelected ? colors.onPrimary : colors.primary}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextActive,
                      ]}
                    >
                      {slot.label} ({slot.time})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Ghi chú thêm */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ghi chú thêm (tuỳ chọn)</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
              placeholder="Ví dụ: Uống kèm nhiều nước..."
              placeholderTextColor={colors.outline}
              multiline
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* Nút lưu */}
          <Button
            title="Lưu Thuốc & Đặt Lịch Nhắc"
            onPress={handleSave}
            loading={loading}
            icon={
              <MaterialCommunityIcons
                name="check"
                size={24}
                color={colors.onPrimary}
              />
            }
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: rounded.xl,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    ...typography.labelLg,
    color: colors.onSurface,
  },
  bannerSubtitle: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurface,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    borderRadius: rounded.xl,
    height: 56,
    paddingHorizontal: spacing.md,
    ...typography.bodyLg,
    color: colors.onSurface,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  typeChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: rounded.xl,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
  },
  typeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeChipText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: 6,
  },
  typeChipTextActive: {
    color: colors.onPrimary,
  },
  mealList: {
    gap: 8,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: rounded.xl,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
  },
  mealCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFixed,
  },
  mealIconBox: {
    width: 40,
    height: 40,
    borderRadius: rounded.full,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealIconBoxActive: {
    backgroundColor: colors.primary,
  },
  mealTitle: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  mealTitleActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  mealDesc: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
  timeSlotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: rounded.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surfaceContainerLowest,
  },
  timeSlotChipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    ...typography.labelSm,
    color: colors.primary,
  },
  chipTextActive: {
    color: colors.onPrimary,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});
