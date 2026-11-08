import { AppState } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

/**
 * Adapter lưu trữ Session an toàn vào Android Keystore bằng expo-secure-store
 * Xử lý an toàn: nếu kích thước dữ liệu lớn hơn 2KB, SecureStore có thể báo lỗi,
 * nên có cơ chế bắt lỗi để không làm crash app.
 */
const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      // Trong trường hợp SecureStore không đọc được
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      // Trường hợp ghi thất bại
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      // Bỏ qua lỗi xoá
    }
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  // Cảnh báo nếu thiếu cấu hình Supabase
  console.warn('Thiếu cấu hình EXPO_PUBLIC_SUPABASE_URL hoặc EXPO_PUBLIC_SUPABASE_ANON_KEY trong .env');
}

/**
 * Khởi tạo Supabase Client duy nhất cho toàn bộ app
 * Sử dụng anon key và xác thực RLS từ Supabase
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Quản lý tự động làm mới token theo trạng thái App (Foreground / Background)
// Giúp tiết kiệm pin và đảm bảo session luôn hợp lệ khi người dùng mở lại app
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
