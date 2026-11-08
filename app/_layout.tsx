import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { supabase } from '../src/lib/supabase';
import {
  setupNotificationChannels,
  ACTION_TAKE,
  ACTION_SNOOZE,
  scheduleSnoozeReminder,
  rescheduleAllReminders,
} from '../src/lib/notifications';
import { getActiveSchedules } from '../src/features/schedules/api';
import { recordDoseStatus } from '../src/features/history/api';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../src/theme';
import { Session } from '@supabase/supabase-js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 phút
    },
  },
});

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Khởi tạo kênh thông báo Android và các nút hành động
    setupNotificationChannels().catch(() => {});

    // 2. Lắng nghe tương tác của người dùng trên thông báo (kể cả khi không mở app)
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const actionId = response.actionIdentifier;
        const data = response.notification.request.content.data as any;

        if (actionId === ACTION_TAKE && data?.medicationId) {
          // Bấm nút "✓ Đã uống" ngay từ thanh thông báo
          const now = new Date();
          const scheduledAt = now.toISOString();
          try {
            await recordDoseStatus({
              medicationId: data.medicationId,
              scheduleId: data.scheduleId || null,
              scheduledAt,
              status: 'taken',
            });
            queryClient.invalidateQueries({ queryKey: ['dose_logs'] });
          } catch {
            // Lưu ngoại tuyến hoặc thử lại sau
          }
        } else if (actionId === ACTION_SNOOZE) {
          // Bấm nút "⏰ Nhắc lại sau 15 phút"
          const title = response.notification.request.content.title || '';
          const body = response.notification.request.content.body || '';
          await scheduleSnoozeReminder(title, body, data || {});
        }
      }
    );

    // 3. Lắng nghe trạng thái đăng nhập từ Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
      if (session) {
        // Đồng bộ lại chuông nhắc khi mở app
        getActiveSchedules()
          .then((schedules) => rescheduleAllReminders(schedules))
          .catch(() => {});
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        getActiveSchedules()
          .then((schedules) => rescheduleAllReminders(schedules))
          .catch(() => {});
      }
    });

    return () => {
      responseListener.remove();
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Chưa đăng nhập -> chuyển hướng về màn đăng nhập
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Đã đăng nhập -> chuyển về màn hình chính
      router.replace('/(tabs)');
    }
  }, [session, segments, isLoading]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen
            name="medication/new"
            options={{ presentation: 'modal', headerShown: false }}
          />
          <Stack.Screen
            name="medication/[id]"
            options={{ presentation: 'card', headerShown: false }}
          />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

