import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, rounded } from '../../src/theme';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { useQuery } from '@tanstack/react-query';
import { getMedications } from '../../src/features/medications/api';

export default function MedicationsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { data: dbMeds = [], isLoading, refetch } = useQuery({
    queryKey: ['medications'],
    queryFn: getMedications,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Mockup mặc định nếu chưa có thuốc từ database
  const sampleMeds = [
    {
      id: 'sample-1',
      name: 'Amlodipine 5mg',
      dosage: '1 viên / ngày (buổi tối)',
      notes: 'Uống sau bữa ăn tối, ổn định huyết áp',
      stock: 14,
      low_stock_threshold: 5,
    },
    {
      id: 'sample-2',
      name: 'Metformin 500mg',
      dosage: '1 viên / lần (sáng, tối)',
      notes: 'Hỗ trợ kiểm soát đường huyết',
      stock: 4, // sắp hết
      low_stock_threshold: 5,
    },
    {
      id: 'sample-3',
      name: 'Aspirin 81mg',
      dosage: '1 viên / ngày (buổi sáng)',
      notes: 'Bảo vệ tim mạch',
      stock: 30,
      low_stock_threshold: 5,
    },
  ];

  const displayList = dbMeds.length > 0 ? dbMeds : sampleMeds;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Tiêu đề & Nút thêm nhanh */}
        <View style={styles.topBar}>
          <Text style={styles.screenTitle}>Tủ Thuốc Của Tôi</Text>
          <TouchableOpacity
            style={styles.addButtonIcon}
            onPress={() => router.push('/medication/new')}
            accessibilityRole="button"
            accessibilityLabel="Thêm thuốc mới"
          >
            <MaterialCommunityIcons name="plus" size={26} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>

        {/* Banner Tổng quan */}
        <Card variant="tonal" style={styles.bannerCard}>
          <View style={styles.bannerRow}>
            <View style={styles.bannerIcon}>
              <MaterialCommunityIcons
                name="medical-bag"
                size={28}
                color={colors.primary}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.bannerTitle}>Tủ thuốc gia đình</Text>
              <Text style={styles.bannerSubtitle}>
                Đang theo dõi {displayList.length} loại thuốc hoạt động
              </Text>
            </View>
          </View>
          <Button
            title="+ Thêm thuốc mới"
            onPress={() => router.push('/medication/new')}
            style={styles.bannerButton}
          />
        </Card>

        {/* Danh sách các loại thuốc */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Danh sách thuốc</Text>
        </View>

        <View style={styles.medList}>
          {displayList.map((item) => {
            const isLowStock =
              item.stock !== null &&
              item.stock !== undefined &&
              item.stock <= (item.low_stock_threshold || 5);

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => router.push(`/medication/${item.id}`)}
              >
                <Card variant="elevated" style={styles.medCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.pillIconBox}>
                      <MaterialCommunityIcons
                        name="pill"
                        size={24}
                        color={colors.primary}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.medName}>{item.name}</Text>
                      <Text style={styles.medDosage}>{item.dosage || '1 liều'}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color={colors.outline}
                    />
                  </View>

                  {item.notes ? (
                    <Text style={styles.medNotes}>
                      <Text style={{ fontWeight: '600' }}>Ghi chú: </Text>
                      {item.notes}
                    </Text>
                  ) : null}

                  {/* Cảnh báo số lượng thuốc còn lại */}
                  <View style={styles.stockRow}>
                    <View style={styles.stockBadge}>
                      <MaterialCommunityIcons
                        name="package-variant-closed"
                        size={16}
                        color={colors.onSurfaceVariant}
                      />
                      <Text style={styles.stockText}>
                        Còn lại: {item.stock !== null ? `${item.stock} viên` : 'Chưa nhập'}
                      </Text>
                    </View>

                    {isLowStock && (
                      <View style={styles.lowStockWarning}>
                        <MaterialCommunityIcons
                          name="alert-circle-outline"
                          size={16}
                          color={colors.error}
                        />
                        <Text style={styles.lowStockText}>Sắp hết thuốc</Text>
                      </View>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
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
  addButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: rounded.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
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
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  bannerSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  bannerButton: {
    minHeight: 48,
  },
  listHeader: {
    marginBottom: spacing.sm,
  },
  listTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  medList: {
    gap: spacing.md,
  },
  medCard: {
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillIconBox: {
    width: 44,
    height: 44,
    borderRadius: rounded.lg,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medName: {
    ...typography.labelLg,
    color: colors.onSurface,
  },
  medDosage: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  medNotes: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
    backgroundColor: colors.surfaceContainerLow,
    padding: 8,
    borderRadius: rounded.md,
    marginTop: spacing.sm,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerHigh,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockText: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
  },
  lowStockWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.errorContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: rounded.full,
  },
  lowStockText: {
    ...typography.caption,
    color: colors.onErrorContainer,
    fontWeight: '700',
  },
});

