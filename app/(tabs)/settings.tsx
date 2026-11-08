import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, rounded } from '../../src/theme';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { signOut } from '../../src/features/auth/api';
import { requestNotificationPermissions } from '../../src/lib/notifications';

export default function SettingsScreen() {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleTestNotification = async () => {
    const granted = await requestNotificationPermissions();
    if (!granted) {
      Alert.alert(
        'Quyền thông báo',
        'Vui lòng cấp quyền thông báo trong Cài đặt của điện thoại để nhận nhắc nhở đúng giờ.'
      );
      return;
    }

    Alert.alert(
      'Kiểm tra thông báo',
      'Đã bật quyền thông báo thành công! Nhắc nhở sẽ reo chuông đúng giờ.'
    );
  };

  const handleBatteryGuide = () => {
    Alert.alert(
      'Để nhắc thuốc chạy ổn định',
      'Trên một số dòng điện thoại (Xiaomi, Oppo, Samsung...), hệ thống có thể tắt ứng dụng chạy nền.\n\n' +
        'Cách khắc phục:\n' +
        '1. Vào Cài đặt máy -> Ứng dụng -> Nhắc Uống Thuốc\n' +
        '2. Chọn Tiết kiệm pin / Pin -> chọn "Không hạn chế"\n' +
        '3. Bật quyền "Tự khởi chạy" (Auto-start) nếu có.'
    );
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất tài khoản không?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (e: any) {
            Alert.alert('Lỗi', e.message);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <Text style={styles.screenTitle}>Cài Đặt</Text>
        </View>

        {/* Khung giờ mặc định các buổi trong ngày (từ Stitch nh_c_nh) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Giờ các buổi trong ngày</Text>
        </View>

        <Card variant="elevated" style={styles.groupCard}>
          <View style={styles.timeRow}>
            <View style={styles.timeIconWrap}>
              <MaterialCommunityIcons
                name="weather-sunny"
                size={24}
                color="#B45309"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemTitle}>Buổi sáng</Text>
              <Text style={styles.itemSubtitle}>Sau bữa ăn sáng</Text>
            </View>
            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeText}>08:00</Text>
            </View>
          </View>

          <View style={[styles.timeRow, styles.rowBorder]}>
            <View style={styles.timeIconWrap}>
              <MaterialCommunityIcons
                name="white-balance-sunny"
                size={24}
                color="#C2410C"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemTitle}>Buổi trưa</Text>
              <Text style={styles.itemSubtitle}>Trong bữa ăn trưa</Text>
            </View>
            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeText}>12:30</Text>
            </View>
          </View>

          <View style={[styles.timeRow, styles.rowBorder]}>
            <View style={styles.timeIconWrap}>
              <MaterialCommunityIcons
                name="weather-night"
                size={24}
                color="#4338CA"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemTitle}>Buổi tối</Text>
              <Text style={styles.itemSubtitle}>Sau bữa cơm tối</Text>
            </View>
            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeText}>19:00</Text>
            </View>
          </View>
        </Card>

        {/* Cài đặt Thông báo & Báo thức */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Thông báo & Chuông nhắc</Text>
        </View>

        <Card variant="elevated" style={styles.groupCard}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Âm thanh chuông báo</Text>
              <Text style={styles.itemSubtitle}>Rung và phát chuông khi đến giờ</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ true: colors.primary, false: colors.outlineVariant }}
            />
          </View>

          <TouchableOpacity
            style={[styles.settingRow, styles.rowBorder]}
            onPress={handleTestNotification}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Kiểm tra quyền thông báo</Text>
              <Text style={styles.itemSubtitle}>Bảo đảm máy cho phép báo thức chính xác</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, styles.rowBorder]}
            onPress={handleBatteryGuide}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Hướng dẫn chống tắt ngầm (Pin)</Text>
              <Text style={styles.itemSubtitle}>Giúp chuông luôn reo kể cả khi khoá máy</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>
        </Card>

        {/* Bảo mật */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bảo mật cá nhân</Text>
        </View>

        <Card variant="elevated" style={styles.groupCard}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Khoá app bằng Vân tay / PIN</Text>
              <Text style={styles.itemSubtitle}>Yêu cầu xác thực khi mở ứng dụng</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ true: colors.primary, false: colors.outlineVariant }}
            />
          </View>
        </Card>

        {/* Nút Đăng xuất */}
        <Button
          title="Đăng xuất tài khoản"
          variant="outline"
          onPress={handleLogout}
          icon={<MaterialCommunityIcons name="logout" size={22} color={colors.primary} />}
          style={styles.logoutButton}
        />
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
  sectionHeader: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.labelLg,
    color: colors.onSurfaceVariant,
  },
  groupCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: rounded.xl,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerHigh,
  },
  timeIconWrap: {
    width: 42,
    height: 42,
    borderRadius: rounded.lg,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  itemSubtitle: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  timeBadge: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: rounded.md,
  },
  timeBadgeText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: '700',
  },
  logoutButton: {
    marginTop: spacing.xl,
  },
});

