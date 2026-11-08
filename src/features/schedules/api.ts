import { supabase } from '../../lib/supabase';
import { Schedule } from '../../types';

export interface CreateScheduleInput {
  medication_id: string;
  time_of_day: string; // "08:00"
  days_of_week?: number[];
  dose_amount?: number;
  enabled?: boolean;
}

/**
 * Lấy tất cả lịch uống đang bật kèm thông tin thuốc
 */
export async function getActiveSchedules(): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select(`
      *,
      medication:medications (*)
    `)
    .eq('enabled', true)
    .order('time_of_day', { ascending: true });

  if (error) {
    throw new Error(`Lỗi tải lịch uống: ${error.message}`);
  }

  return (data as Schedule[]) || [];
}

/**
 * Thêm một khung giờ uống mới cho thuốc
 */
export async function createSchedule(input: CreateScheduleInput): Promise<Schedule> {
  const { data, error } = await supabase
    .from('schedules')
    .insert([
      {
        medication_id: input.medication_id,
        time_of_day: input.time_of_day,
        days_of_week: input.days_of_week || [1, 2, 3, 4, 5, 6, 7],
        dose_amount: input.dose_amount ?? 1,
        enabled: input.enabled ?? true,
      },
    ])
    .select(`
      *,
      medication:medications (*)
    `)
    .single();

  if (error) {
    throw new Error(`Lỗi tạo lịch uống: ${error.message}`);
  }

  return data as Schedule;
}

/**
 * Cập nhật lịch uống
 */
export async function updateSchedule(
  id: string,
  updates: Partial<CreateScheduleInput>
): Promise<Schedule> {
  const { data, error } = await supabase
    .from('schedules')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      medication:medications (*)
    `)
    .single();

  if (error) {
    throw new Error(`Lỗi cập nhật lịch: ${error.message}`);
  }

  return data as Schedule;
}

/**
 * Xoá một lịch uống
 */
export async function deleteSchedule(id: string): Promise<void> {
  const { error } = await supabase.from('schedules').delete().eq('id', id);
  if (error) {
    throw new Error(`Lỗi xoá lịch uống: ${error.message}`);
  }
}

