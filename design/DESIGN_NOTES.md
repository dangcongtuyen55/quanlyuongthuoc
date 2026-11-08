# Ghi chú Thiết kế & Design Tokens (App Quản lý & Nhắc Uống Thuốc)

## 1. Nguồn gốc thiết kế
- Dựa trên hệ thống thiết kế Accessible Healthcare System xuất từ Google Stitch (`design/stitch/`).
- Tối ưu đặc biệt cho người lớn tuổi, người bệnh cần uống thuốc đúng giờ, và người thân quản lý.

## 2. Bảng màu chuẩn (Material 3 Tonal Palette)
- **Primary (`#003C90` / `#0F52BA` - Sapphire Blue)**: Thể hiện độ tin cậy, y khoa chuẩn mực, dùng cho nút bấm chính và điểm nhấn quan trọng.
- **Secondary (`#006D3D` / `#2E8B57` - Sea Green)**: Biểu thị trạng thái an tâm, đã uống thuốc, hoàn thành nhiệm vụ.
- **Background (`#F7F9FB` - Warm White)**: Màu nền sáng ấm chống chói mắt, giảm mỏi mắt khi đọc lâu so với màu trắng tinh `#FFFFFF`.
- **Surface Containers (`#FFFFFF`, `#F2F4F6`, `#ECEEF0`)**: Phân lớp độ cao thẻ (Card) mềm mại, rõ ràng.
- **Error / Warning (`#BA1A1A` / `#FFDAD6`)**: Báo thuốc sắp hết, liều bị bỏ lỡ hoặc quên uống.
- **Text (`#191C1E`)**: Đạt độ tương phản WCAG AAA, phân biệt rõ nét trên nền sáng.

## 3. Quy chuẩn Typography & Kích thước chạm
- Cỡ chữ nội dung tối thiểu: **16sp** (`bodyMd`), đề xuất **18sp** (`bodyLg`).
- Tiêu đề: **22sp - 28sp - 36sp** (`headlineMd`, `headlineLg`, `headlineXl`).
- Chiều cao nút bấm chính: tối thiểu **56dp** để bấm 1 chạm dễ dàng không trượt.
- Vùng chạm tối thiểu (Touch Target): **48x48dp**.
- Bo góc (Border Radius): **12dp - 16dp - 24dp** (thân thiện, gần gũi, xoá bỏ cảm giác gắt của bệnh viện).

## 4. Các màn hình đã dựng
1. **Hôm nay (`app/(tabs)/index.tsx`)**:
   - Lời chào buổi sáng & tiến độ hoàn thành trong ngày (ví dụ: "Đã uống 2/3 khung giờ").
   - Các khung giờ Sáng (08:00), Trưa (12:30), Tối (19:00).
   - Nút lớn 1 chạm "Xác nhận đã uống thuốc".
2. **Tủ thuốc (`app/(tabs)/medications.tsx`)**:
   - Danh sách thuốc đang điều trị, liều lượng và ghi chú.
   - Theo dõi số lượng tồn kho & cảnh báo khi sắp hết thuốc.
   - Thêm thuốc mới (`app/medication/new.tsx`).
3. **Lịch sử (`app/(tabs)/history.tsx`)**:
   - Tỷ lệ tuân thủ điều trị theo tuần (92%).
   - Nhật ký theo từng ngày (Đã uống / Đã bỏ qua / Quên).
4. **Cài đặt (`app/(tabs)/settings.tsx`)**:
   - Thiết lập giờ mặc định 3 buổi (Sáng, Trưa, Tối).
   - Kiểm tra chuông báo & quyền thông báo chính xác.
   - Hướng dẫn cấu hình tiết kiệm pin chống bị máy tắt ngầm.
   - Khoá ứng dụng bằng vân tay / PIN sinh trắc học.
   - Đăng xuất tài khoản an toàn.
5. **Đăng nhập (`app/(auth)/login.tsx`)**:
   - Đăng nhập bảo mật qua Supabase Auth + hỗ trợ vân tay.

