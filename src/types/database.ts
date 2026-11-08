export type DoseStatus = 'taken' | 'skipped' | 'missed';

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string | null;
  notes: string | null;
  color: string | null;
  stock: number | null;
  low_stock_threshold: number | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  user_id: string;
  medication_id: string;
  time_of_day: string; // Định dạng "HH:mm" (ví dụ: "08:00")
  days_of_week: number[]; // 1: Thứ 2 ... 7: Chủ Nhật
  dose_amount: number;
  enabled: boolean;
  created_at: string;
  // Join quan hệ
  medication?: Medication;
}

export interface DoseLog {
  id: string;
  user_id: string;
  medication_id: string;
  schedule_id: string | null;
  scheduled_at: string; // ISO string thời điểm cần uống
  taken_at: string | null; // ISO string thời điểm thực tế uống
  status: DoseStatus;
  created_at: string;
  // Join quan hệ
  medication?: Medication;
  schedule?: Schedule;
}

/**
 * Cấu trúc gom nhóm lịch uống theo khung giờ trong ngày (cho màn hình Hôm nay)
 */
export interface TimeSlotGroup {
  time: string; // "08:00"
  label: string; // "Buổi Sáng"
  items: {
    schedule: Schedule;
    medication: Medication;
    log?: DoseLog;
  }[];
  isAllTaken: boolean;
  isPending: boolean;
}

