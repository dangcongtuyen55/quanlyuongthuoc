import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography } from '../../src/theme';
import { Platform } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.outline,
        tabBarStyle: {
          backgroundColor: colors.surfaceContainerLowest,
          borderTopColor: colors.surfaceContainerHigh,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          ...typography.labelSm,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hôm nay',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-check" size={26} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Tủ thuốc',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="pill" size={26} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Lịch sử',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-box-outline" size={26} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog-outline" size={26} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}

