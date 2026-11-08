import { supabase } from '../../lib/supabase';
import { DoseLog, DoseStatus } from '../../types';
import { decrementStock } from '../medications/api';

/**
 * Lấy danh sách nhật ký uống thuốc trong một khoảng thời gian (startOfDay -> endOfDay)
 */
export async function getDoseLogsForRange(startDateIso: string, endDateIso: string): Promise<DoseLog[]> {
  const { data, error } = await supabase
    .from('dose_logs')
    .select(`
      *,
      medication:medications (*),
      schedule:schedules (*)
    `)
    .gte('scheduled_at', startDateIso)
    .lte('scheduled_at', endDateIso)
    .order('scheduled_at', { ascending: true });

  if (error) {
    throw new Error(`Lỗi tải nhật ký: ${error.message}`);
  }

  return (data as DoseLog[]) || [];
}

/**
 * Ghi nhận hoặc cập nhật trạng thái liều thuốc
 * Dùng upsert với (schedule_id, scheduled_at) để tránh tạo trùng bản ghi
 */
export async function recordDoseStatus({
  medicationId,
  scheduleId,
  scheduledAt,
  status,
  doseAmount = 1,
}: {
  medicationId: string;
  scheduleId: string | null;
  scheduledAt: string;
  status: DoseStatus;
  doseAmount?: number;
}): Promise<DoseLog> {
  const takenAt = status === 'taken' ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from('dose_logs')
    .upsert(
      {
        medication_id: medicationId,
        schedule_id: scheduleId,
        scheduled_at: scheduledAt,
        taken_at: takenAt,
        status,
      },
      {
        onConflict: 'schedule_id, scheduled_at',
      }
    )
    .select(`
      *,
      medication:medications (*)
    `)
    .single();

  if (error) {
    throw new Error(`Lỗi ghi nhận uống thuốc: ${error.message}`);
  }

  // Nếu đánh dấu là "đã uống", trừ số lượng tồn kho (nếu có theo dõi)
  if (status === 'taken') {
    try {
      await decrementStock(medicationId, doseAmount);
    } catch {
      // Không làm gián đoạn nếu cập nhật kho lỗi
    }
  }

  return data as DoseLog;
}

