import { supabase } from '../../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

/**
 * Đăng nhập bằng Email và Mật khẩu
 */
export async function signInWithEmail(email: string, password: string): Promise<{ session: Session | null; user: User | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { session: data.session, user: data.user };
}

/**
 * Đăng xuất khỏi hệ thống
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Lấy phiên đăng nhập hiện tại
 */
export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message);
  }
  return data.session;
}

/**
 * Lấy thông tin user hiện tại
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  return user;
}

