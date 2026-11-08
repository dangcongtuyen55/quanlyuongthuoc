-- ============================================================
-- Migration: 0001_init.sql
-- Mô tả: Khởi tạo bảng thuốc, lịch uống và nhật ký uống thuốc
-- Kèm theo Row Level Security (RLS) bảo vệ dữ liệu cá nhân
-- ============================================================

-- 1. Bảng danh mục Thuốc (medications)
create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,                                          -- Tên thuốc, ví dụ: "Amlodipine 5mg"
  dosage text,                                                 -- Liều lượng, ví dụ: "1 viên"
  notes text,                                                  -- Ghi chú, ví dụ: "Uống sau ăn no"
  color text,                                                  -- Màu phân biệt trong app
  stock numeric,                                               -- Số lượng thuốc còn lại trong vỉ/hộp
  low_stock_threshold numeric default 5,                       -- Ngưỡng báo sắp hết thuốc
  start_date date default current_date,                        -- Ngày bắt đầu uống
  end_date date,                                               -- Ngày kết thúc (null = uống dài hạn)
  is_active boolean not null default true,                     -- Đang còn uống hay đã ngưng
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Bảng Lịch uống thuốc (schedules)
-- Mỗi dòng tương ứng 1 khung giờ uống của 1 loại thuốc
create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  medication_id uuid not null references public.medications(id) on delete cascade,
  time_of_day time not null,                                   -- Giờ uống trên đồng hồ (ví dụ "08:00")
  days_of_week smallint[] not null default '{1,2,3,4,5,6,7}',  -- Thứ trong tuần (1: Thứ 2 ... 7: CN)
  dose_amount numeric default 1,                               -- Số viên / liều mỗi lần uống
  enabled boolean not null default true,                       -- Bật / tắt nhắc giờ này
  created_at timestamptz not null default now()
);

-- 3. Bảng Nhật ký uống thuốc (dose_logs)
-- Ghi lại trạng thái từng liều: đã uống / bỏ qua / quên
create table if not exists public.dose_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  medication_id uuid not null references public.medications(id) on delete cascade,
  schedule_id uuid references public.schedules(id) on delete set null,
  scheduled_at timestamptz not null,                           -- Thời điểm lẽ ra phải uống (dùng so sánh)
  taken_at timestamptz,                                        -- Thời điểm người dùng ấn "Đã uống"
  status text not null check (status in ('taken','skipped','missed')),
  created_at timestamptz not null default now(),
  unique (schedule_id, scheduled_at)                           -- Tránh ghi đè trùng 1 lần uống
);

-- Tạo Index để truy vấn nhanh danh sách hôm nay và tìm kiếm thuốc
create index if not exists idx_schedules_user_med on public.schedules (user_id, medication_id);
create index if not exists idx_dose_logs_user_scheduled on public.dose_logs (user_id, scheduled_at desc);

-- ============================================================
-- BẢO MẬT: BẬT ROW LEVEL SECURITY (RLS) CHO TẤT CẢ CÁC BẢNG
-- Anon key nằm trong APK nên RLS là bức tường duy nhất bảo vệ dữ liệu.
-- ============================================================
alter table public.medications enable row level security;
alter table public.schedules  enable row level security;
alter table public.dose_logs  enable row level security;

-- Policy cho bảng medications: Chỉ chủ tài khoản mới được xem, thêm, sửa, xoá
create policy "Chỉ chủ tài khoản thao tác medications" on public.medications
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Policy cho bảng schedules: Chỉ chủ tài khoản thao tác lịch
create policy "Chỉ chủ tài khoản thao tác schedules" on public.schedules
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Policy cho bảng dose_logs: Chỉ chủ tài khoản xem và ghi nhật ký
create policy "Chỉ chủ tài khoản thao tác dose_logs" on public.dose_logs
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Hàm & Trigger tự động cập nhật thời gian sửa đổi (updated_at)
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists medications_touch on public.medications;
create trigger medications_touch
  before update on public.medications
  for each row execute function public.touch_updated_at();

