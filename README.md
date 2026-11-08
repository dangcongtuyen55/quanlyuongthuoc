# Ứng Dụng Quản Lý & Nhắc Uống Thuốc

Ứng dụng Android cá nhân giúp theo dõi thuốc, đặt lịch uống và tự động reo chuông nhắc nhở **cục bộ trên máy** (chạy tốt kể cả khi mất mạng hoặc tắt Wi-Fi).

---

## 📱 Điểm nổi bật
- **Giao diện thân thiện cho người lớn tuổi**: Chữ to rõ (tối thiểu 16sp), nút bấm lớn (56dp) dễ bấm 1 chạm. Thiết kế trích xuất chuẩn mực từ Google Stitch.
- **Nhắc thuốc không phụ thuộc server**: Đặt thông báo báo thức chính xác trực tiếp trên Android qua `expo-notifications`.
- **Bảo mật tuyệt đối**: Dữ liệu lưu trữ trên Supabase với Row Level Security (RLS) bảo vệ từng tài khoản riêng biệt. Token đăng nhập lưu an toàn bằng Android Keystore (`expo-secure-store`). Hỗ trợ mở khoá bằng vân tay / khuôn mặt.
- **Cảnh báo sắp hết thuốc**: Tự động đếm lùi số viên còn lại và cảnh báo khi thuốc sắp hết trong tủ.

---

## 🛠️ Công nghệ sử dụng
- **React Native + Expo SDK 52** (TypeScript, Expo Router v4)
- **Supabase** (PostgreSQL + RLS + Auth)
- **expo-notifications** (Báo thức & Chuông nhắc cục bộ)
- **expo-secure-store** & **expo-local-authentication** (Bảo mật & Sinh trắc học)
- **@tanstack/react-query** (Quản lý trạng thái dữ liệu & cache)

---

## 🚀 Hướng dẫn chạy thử dự án (Dành cho chủ dự án)

### 1. Bước 1: Thiết lập cơ sở dữ liệu Supabase (Làm trên Web)
1. Đăng nhập vào trang quản trị [Supabase Dashboard](https://supabase.com/dashboard).
2. Chọn project của bạn -> vào mục **SQL Editor**.
3. Mở file `supabase/migrations/0001_init.sql` trong dự án này, copy toàn bộ nội dung và dán vào SQL Editor trên Supabase, sau đó nhấn **Run**.
4. Vào mục **Authentication -> Users**: nhấn **Add User** để tạo tài khoản email/mật khẩu cá nhân của bạn.
5. *(Quan trọng về bảo mật)*: Vào **Authentication -> Providers -> Email** hoặc **Sign In / Up**, tắt tuỳ chọn **"Allow new users to sign up"** để người lạ không thể tự đăng ký tài khoản vào hệ thống của bạn.

### 2. Bước 2: Cài đặt và chạy App
Mở terminal tại thư mục dự án và chạy:
```bash
# 1. Cài đặt các thư viện
npm install

# 2. Khởi động môi trường phát triển
npx expo start
```
- Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại Android để xem trước giao diện.
*(Lưu ý: Để test tính năng chuông báo thức chính xác khi đóng hoàn toàn ứng dụng, cần build bản APK hoặc Expo Development Build).*

---

## 📦 Hướng dẫn đóng gói file APK cài trực tiếp vào máy
Dự án đã được cấu hình sẵn file `eas.json` và `app.json` để tạo file APK:

```bash
# Đăng nhập tài khoản Expo (nếu chưa có, tạo miễn phí trên expo.dev)
npx eas-cli login

# Tạo file APK trực tiếp qua EAS Build
npx eas-cli build -p android --profile preview
```
Sau khi hoàn tất, hệ thống sẽ cấp link tải trực tiếp file `.apk` để bạn cài vào điện thoại Android.
