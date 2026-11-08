---
trigger: always_on
description: Quy tắc UI - bám theo thiết kế Stitch, tự làm UI mới trong Antigravity
---

# Quy tắc UI

## Nguồn thiết kế
- UI gốc được làm ở **Google Stitch** và export vào `design/stitch/`
  (ảnh màn hình, HTML/CSS hoặc code Stitch xuất ra).
- Việc đầu tiên khi bắt đầu: đọc `design/stitch/` và **trích design tokens**
  (màu, font, bo góc, khoảng cách, đổ bóng) vào `src/theme/`.
- **Từ giờ UI mới do Antigravity tự làm**, không cần quay lại Stitch.
  Màn hình mới phải trông như cùng một bộ với màn hình Stitch đã có.

## Cách làm một màn hình mới (khi không có sẵn thiết kế)
1. Xem lại các màn hình trong `design/stitch/` và `src/components/` để lấy phong cách.
2. Dùng lại component có sẵn trước, chỉ tạo component mới khi thật sự cần.
3. Ghi lại các quyết định thiết kế mới (màu mới, kiểu nút mới...) vào `design/DESIGN_NOTES.md`
   để sau này nhất quán.
4. Nếu màn hình đó lớn / phức tạp, mô tả bố cục bằng chữ cho chủ dự án duyệt trước khi code.

## Nguyên tắc thiết kế cho app thuốc
- **Dễ đọc, dễ bấm**: chữ tối thiểu 16sp, vùng bấm tối thiểu 48x48dp.
- Độ tương phản đạt WCAG AA. Hỗ trợ cả người lớn tuổi dùng được.
- Hành động quan trọng nhất ở màn hình "Hôm nay": nút **Đã uống** to, dễ bấm 1 chạm.
- Không chỉ dựa vào màu để phân biệt trạng thái (đã uống / bỏ qua / quên): thêm icon hoặc chữ.
- Hỗ trợ **dark mode** nếu Stitch có thiết kế; nếu không thì để sau.
- Animation nhẹ, tôn trọng cài đặt "giảm chuyển động" của hệ thống.

## Kỹ thuật
- Dùng StyleSheet hoặc NativeWind (chọn 1 và giữ nguyên, không trộn).
- Icon dùng 1 bộ duy nhất (ví dụ `@expo/vector-icons` hoặc `lucide-react-native`).
- Font load bằng `expo-font`; ghi tên font vào theme.
- Kiểm tra bố cục trên màn hình nhỏ (360dp) và lớn (tablet) trước khi báo xong.
- Hỗ trợ accessibility: có `accessibilityLabel` cho nút chỉ có icon.

## Việc cần làm lúc bắt đầu
Nếu chưa có `src/theme/`, hãy tạo từ design Stitch rồi báo lại cho chủ dự án xem
bảng màu và font đã trích để xác nhận.
