import { supabase } from '../../lib/supabase';
import { Medication } from '../../types';

export interface CreateMedicationInput {
  name: string;
  dosage?: string;
  notes?: string;
  color?: string;
  stock?: number;
  low_stock_threshold?: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Lấy danh sách toàn bộ thuốc đang hoạt động
 */
export async function getMedications(): Promise<Medication[]> {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Lỗi tải danh sách thuốc: ${error.message}`);
  }

  return (data as Medication[]) || [];
}

/**
 * Lấy chi tiết một loại thuốc theo ID
 */
export async function getMedicationById(id: string): Promise<Medication | null> {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Không tìm thấy thuốc: ${error.message}`);
  }

  return data as Medication;
}

/**
 * Thêm một loại thuốc mới vào tủ thuốc
 */
export async function createMedication(input: CreateMedicationInput): Promise<Medication> {
  const { data, error } = await supabase
    .from('medications')
    .insert([
      {
        name: input.name.trim(),
        dosage: input.dosage?.trim() || null,
        notes: input.notes?.trim() || null,
        color: input.color || '#003C90',
        stock: input.stock ?? null,
        low_stock_threshold: input.low_stock_threshold ?? 5,
        start_date: input.start_date || new Date().toISOString().split('T')[0],
        end_date: input.end_date || null,
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Lỗi tạo thuốc: ${error.message}`);
  }

  return data as Medication;
}

/**
 * Cập nhật thông tin thuốc
 */
export async function updateMedication(
  id: string,
  updates: Partial<CreateMedicationInput> & { is_active?: boolean }
): Promise<Medication> {
  const { data, error } = await supabase
    .from('medications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Lỗi cập nhật thuốc: ${error.message}`);
  }

  return data as Medication;
}

/**
 * Xoá thuốc (hoặc chuyển sang trạng thái ngưng dùng is_active = false)
 */
export async function deactivateMedication(id: string): Promise<void> {
  const { error } = await supabase
    .from('medications')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    throw new Error(`Lỗi huỷ kích hoạt thuốc: ${error.message}`);
  }
}

/**
 * Trừ số lượng thuốc tồn kho khi uống 1 liều
 */
export async function decrementStock(id: string, amount: number = 1): Promise<void> {
  const current = await getMedicationById(id);
  if (!current || current.stock === null || current.stock === undefined) return;

  const newStock = Math.max(0, Number(current.stock) - amount);
  await supabase.from('medications').update({ stock: newStock }).eq('id', id);
}

