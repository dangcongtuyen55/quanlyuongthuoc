---
trigger: always_on
description: Tổng quan dự án app nhắc uống thuốc - luôn áp dụng
---

# Dự án: App quản lý & nhắc uống thuốc

## Mục tiêu
App Android cá nhân, dùng để:
- Thêm / sửa / xoá thuốc (tên, liều lượng, ghi chú, số lượng còn lại)
- Đặt lịch uống (nhiều giờ trong ngày, chọn thứ trong tuần)
- Nhắc uống thuốc bằng **thông báo local** (chạy được cả khi không có mạng)
- Ghi lại lịch sử: đã uống / bỏ qua / quên
- Cảnh báo khi thuốc sắp hết

App chỉ cài bằng **file APK** (sideload). **Không** đưa lên Google Play / App Store.

## Công nghệ (cố định, không tự đổi)
- **React Native + Expo** (TypeScript), dùng Expo Dev Build / EAS Build để ra APK
- **Expo Router** cho điều hướng
- **Supabase** (Auth + Postgres + RLS) làm database
- **expo-notifications** cho nhắc thuốc (local notification)
- **expo-secure-store** để lưu token đăng nhập
- State: Zustand hoặc React Query (chọn 1, giữ nhất quán)
- Ngôn ngữ giao diện: **Tiếng Việt**

## Vì sao Supabase mà không phải Firebase
- Dữ liệu thuốc dạng bảng (thuốc - lịch - nhật ký) hợp với Postgres hơn
- Row Level Security (RLS) bảo vệ dữ liệu ngay ở database
- Chủ dự án đã quen Supabase ở các dự án khác

## Nguyên tắc nhắc thuốc
Việc nhắc **không phụ thuộc server**. Lịch được lưu trên Supabase để đồng bộ,
nhưng thông báo luôn được đặt local trên máy. Đọc skill `medication-reminders`.

## Về người dùng (chủ dự án)
- Xuất thân designer, **không phải coder chuyên nghiệp**
- Cần giải thích ngắn gọn, dễ hiểu; comment trong code bằng tiếng Việt
- Khi gặp lỗi: giải thích nguyên nhân bằng lời thường trước, rồi mới sửa

## Về UI
- UI ban đầu thiết kế ở **Google Stitch**, file export để trong `design/stitch/`
- Khi cần **thêm màn hình / UI mới: làm trực tiếp tại đây**, bám theo design
  tokens đã lấy từ Stitch (xem rule `03-ui-design.md`). **Không cần quay lại Stitch.**
