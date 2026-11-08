---
name: supabase-secure-backend
description: Thiết kế database Supabase an toàn cho app thuốc - schema, RLS, đăng nhập, lưu session an toàn trên Android, đồng bộ offline. Dùng khi tạo bảng, viết migration, viết policy, làm đăng nhập, hoặc gọi API Supabase từ app.
---

# Skill: Supabase an toàn cho app thuốc

## Bước 1: Tạo project Supabase (chủ dự án làm tay)
1. Tạo project mới trên supabase.com
2. Vào **Authentication -> Providers -> Email**: bật email + password
3. Tạo tài khoản của chủ bằng app (hoặc Dashboard -> Authentication -> Users -> Add user)
4. Sau khi có tài khoản: **Authentication -> Sign In / Providers -> tắt "Allow new users to sign up"**
   (app cá nhân, không cho người lạ tạo tài khoản)
5. Lấy `Project URL` và `anon / publishable key` bỏ vào `.env` (xem rule bảo mật)

## Bước 2: Schema (đặt trong `supabase/migrations/0001_init.sql`)

```sql
-- Thuốc
create table public.medications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  dosage text,                       -- ví dụ "500mg - 1 viên"
  notes text,
  color text,                        -- màu hiển thị trong app
  stock numeric,                     -- số lượng còn lại (tuỳ chọn)
  low_stock_threshold numeric,       -- ngưỡng cảnh báo sắp hết
  start_date date,
  end_date date,                     -- null = uống dài hạn
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Lịch uống: mỗi dòng = 1 giờ uống của 1 thuốc
create table public.schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  medication_id uuid not null references public.medications(id) on delete cascade,
  time_of_day time not null,                       -- "08:00"
  days_of_week smallint[] not null default '{1,2,3,4,5,6,7}', -- 1=Thứ 2 ... 7=CN
  dose_amount numeric default 1,                   -- số viên mỗi lần
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- Nhật ký uống thuốc
create table public.dose_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  medication_id uuid not null references public.medications(id) on delete cascade,
  schedule_id uuid references public.schedules(id) on delete set null,
  scheduled_at timestamptz not null,               -- giờ lẽ ra phải uống
  taken_at timestamptz,
  status text not null check (status in ('taken','skipped','missed')),
  created_at timestamptz not null default now(),
  unique (schedule_id, scheduled_at)               -- tránh ghi trùng
);

create index on public.schedules (user_id, medication_id);
create index on public.dose_logs (user_id, scheduled_at desc);

-- BẬT RLS CHO MỌI BẢNG (bắt buộc)
alter table public.medications enable row level security;
alter table public.schedules  enable row level security;
alter table public.dose_logs  enable row level security;

-- Policy: chỉ chủ dòng dữ liệu mới thấy / sửa
create policy "own medications" on public.medications
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "own schedules" on public.schedules
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "own dose_logs" on public.dose_logs
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Tự cập nhật updated_at
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
create trigger medications_touch before update on public.medications
  for each row execute function public.touch_updated_at();
```

Chỉ cấp quyền cho role `authenticated`; **không** có policy cho `anon`.
Sau khi chạy SQL, kiểm tra trong Dashboard: mỗi bảng phải hiện "RLS enabled".

## Bước 3: Client Supabase (`src/lib/supabase.ts`)
- Tạo client **một lần duy nhất** ở file này.
- Dùng adapter `expo-secure-store` cho `auth.storage`, bật `autoRefreshToken`, `persistSession`,
  `detectSessionInUrl: false`.
- Lưu ý: SecureStore giới hạn kích thước value (~2KB trên một số máy). Nếu session quá lớn,
  chia nhỏ (chunk) hoặc mã hoá bằng khoá lưu trong SecureStore rồi để data ở AsyncStorage.
- Lắng nghe `AppState`: khi app về foreground thì `supabase.auth.startAutoRefresh()`,
  khi vào nền thì `stopAutoRefresh()`.

## Bước 4: Quy tắc gọi API
- Mọi truy vấn đi qua `src/features/<tên>/api.ts`.
- Luôn xử lý lỗi (`const { data, error } = ...; if (error) throw ...`).
- Không tin dữ liệu: validate bằng `zod` trước khi ghi.
- Không bao giờ `select('*')` bừa; chọn cột cần thiết.

## Bước 5: Offline & đồng bộ
- Nhắc thuốc chạy local nên không phụ thuộc mạng.
- Dữ liệu: cache bằng React Query (persist) để mở app khi không mạng vẫn xem được.
- Ghi log "Đã uống" khi offline -> đưa vào hàng đợi, gửi lại khi có mạng (dùng `upsert` với
  khoá unique `(schedule_id, scheduled_at)` để không bị trùng).

## Khi cần chức năng cần khoá bí mật
Dùng **Supabase Edge Function** (khoá bí mật nằm ở server secrets), app chỉ gọi function đó.

## Kiểm tra bảo mật (làm trước khi dùng thật)
- Dùng tab SQL Editor chạy thử với role `anon`: phải **không** đọc được bảng nào.
- Đăng nhập tài khoản thứ 2 (nếu tạo thử) phải **không** thấy dữ liệu tài khoản 1.
- Chạy "Security Advisor" trong Supabase Dashboard và xử lý hết cảnh báo.
- Đặt lịch **sao lưu** (Supabase có backup hằng ngày ở gói trả phí; gói free thì tự export định kỳ).
