import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, rounded } from '../../src/theme';
import { Button } from '../../src/components/Button';
import { Header } from '../../src/components/Header';
import {
  getMedicationById,
  updateMedication,
  deactivateMedication,
} from '../../src/features/medications/api';
import { useQueryClient } from '@tanstack/react-query';

export default function MedicationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [stock, setStock] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && !id.startsWith('sample')) {
      getMedicationById(id).then((med) => {
        if (med) {
          setName(med.name);
          setDosage(med.dosage || '');
          setStock(med.stock !== null ? String(med.stock) : '');
          setNotes(med.notes || '');
        }
      });
    } else {
      // Mockup data nếu bấm vào item mẫu
      setName('Amlodipine 5mg');
      setDosage('1 viên / ngày (buổi tối)');
      setStock('14');
      setNotes('Uống sau bữa ăn tối, ổn định huyết áp');
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Lưu ý', 'Tên thuốc không được để trống.');
      return;
    }

    try {
      setLoading(true);
      if (id && !id.startsWith('sample')) {
        await updateMedication(id, {
          name: name.trim(),
          dosage: dosage.trim() || undefined,
          stock: stock ? parseInt(stock, 10) : undefined,
          notes: notes.trim() || undefined,
        });
        queryClient.invalidateQueries({ queryKey: ['medications'] });
      }

      Alert.alert('Thành công', 'Đã cập nhật thông tin thuốc.', [
        { text: 'Đồng ý', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể cập nhật lúc này.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Ngưng dùng thuốc',
      'Bạn có chắc chắn muốn ngưng sử dụng và xoá thuốc này khỏi danh sách nhắc không?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Ngưng dùng',
          style: 'destructive',
          onPress: async () => {
            try {
              if (id && !id.startsWith('sample')) {
                await deactivateMedication(id);
                queryClient.invalidateQueries({ queryKey: ['medications'] });
              }
              Alert.alert('Đã xoá', 'Đã ngưng sử dụng thuốc thành công.', [
                { text: 'Đồng ý', onPress: () => router.back() },
              ]);
            } catch (err: any) {
              Alert.alert('Lỗi', err.message);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Chi Tiết Thuốc"
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên thuốc</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Liều lượng mỗi lần</Text>
            <TextInput
              style={styles.input}
              value={dosage}
              onChangeText={setDosage}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số viên còn lại (kho thuốc)</Text>
            <TextInput
              style={styles.input}
              value={stock}
              keyboardType="numeric"
              onChangeText={setStock}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ghi chú</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
              multiline
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          <Button
            title="Lưu Thay Đổi"
            onPress={handleUpdate}
            loading={loading}
            style={styles.updateButton}
          />

          <Button
            title="Ngưng Dùng Thuốc Này"
            variant="danger"
            onPress={handleDelete}
            icon={
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={22}
                color={colors.onError}
              />
            }
            style={styles.deleteButton}
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
  updateButton: {
    marginTop: spacing.lg,
  },
  deleteButton: {
    marginTop: spacing.md,
  },
});

