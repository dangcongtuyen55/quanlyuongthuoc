import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { colors, typography, spacing, rounded } from '../../src/theme';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { signInWithEmail } from '../../src/features/auth/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmail(email.trim(), password.trim());
    } catch (error: any) {
      Alert.alert(
        'Đăng nhập thất bại',
        error?.message || 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert(
          'Sinh trắc học',
          'Thiết bị chưa cài đặt vân tay hoặc khuôn mặt. Hãy đăng nhập bằng mật khẩu trước.'
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Xác thực vân tay để mở app Nhắc Uống Thuốc',
        cancelLabel: 'Huỷ',
        fallbackLabel: 'Dùng mật khẩu',
      });

      if (result.success) {
        // Sau khi xác thực sinh trắc học thành công trên máy
        Alert.alert('Thành công', 'Đã xác thực danh tính thành công.');
      }
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể mở khoá sinh trắc học: ' + err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo & Tiêu đề chào mừng */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={40}
                color={colors.primary}
              />
            </View>
            <Text style={styles.title}>Đăng nhập Quản lý</Text>
            <Text style={styles.subtitle}>
              Ứng dụng quản lý & nhắc uống thuốc an toàn cho gia đình
            </Text>
          </View>

          {/* Khung thẻ đăng nhập */}
          <Card variant="elevated" style={styles.formCard}>
            {/* Trường Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email hoặc Tài khoản</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={22}
                  color={colors.onSurfaceVariant}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập email của bạn..."
                  placeholderTextColor={colors.outline}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Trường Mật khẩu */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons
                  name="key-outline"
                  size={22}
                  color={colors.onSurfaceVariant}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu..."
                  placeholderTextColor={colors.outline}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {/* Nút Đăng nhập */}
            <Button
              title="Đăng nhập hệ thống"
              onPress={handleLogin}
              loading={loading}
              icon={
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={24}
                  color={colors.onPrimary}
                />
              }
              style={styles.loginButton}
            />

            {/* Nút Sinh trắc học */}
            <Button
              title="Mở nhanh bằng Vân tay / Khuôn mặt"
              variant="outline"
              onPress={handleBiometricLogin}
              icon={
                <MaterialCommunityIcons
                  name="fingerprint"
                  size={26}
                  color={colors.primary}
                />
              }
              style={styles.bioButton}
            />
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerNote}>
              Dữ liệu được lưu trữ an toàn & đồng bộ với Supabase
            </Text>
          </View>
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
    flexGrow: 1,
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: rounded.full,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.headlineLg,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 320,
  },
  formCard: {
    padding: spacing.lg,
    borderRadius: rounded.xxl,
    backgroundColor: colors.surfaceContainerLowest,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurface,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.xl,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.md,
    height: 56,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.bodyLg,
    color: colors.onSurface,
  },
  loginButton: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  bioButton: {
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerNote: {
    ...typography.caption,
    color: colors.outline,
    textAlign: 'center',
  },
});

