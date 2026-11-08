---
description: Thiết kế và code một màn hình UI mới ngay trong Antigravity, không cần qua Stitch
---

# /add-ui-screen - Thêm màn hình UI mới

Dùng: `/add-ui-screen <tên + mô tả màn hình>`
(ví dụ: "màn hình Thống kê: biểu đồ % uống đúng giờ 7 ngày gần nhất")

> Từ giờ UI mới làm trực tiếp ở đây, không cần quay lại Stitch.

1. **Nghiên cứu phong cách**: xem `design/stitch/`, `src/theme/`, `src/components/`,
   `design/DESIGN_NOTES.md` để nắm màu, font, bo góc, kiểu nút, kiểu card hiện có.

2. **Mô tả bố cục bằng chữ** (wireframe dạng text) cho chủ dự án xem trước:
   ```
   [Header: tiêu đề + nút quay lại]
   [Card tổng quan]
   [Danh sách ...]
   [Nút chính ở đáy]
   ```
   Chủ dự án là designer nên có thể chỉnh ngay ở bước này. Màn hình nhỏ thì bỏ qua bước duyệt.

3. **Code màn hình**
   - Tạo file trong `app/` (Expo Router), tách phần dùng lại ra `src/components/`
   - Chỉ dùng token từ `src/theme/`, không hard-code màu / cỡ chữ
   - Vùng bấm >= 48dp, chữ >= 16sp, có `accessibilityLabel` cho nút icon
   - Có đủ 3 trạng thái: đang tải, lỗi, rỗng
   - Nếu có biểu đồ: dùng thư viện nhẹ, đã phổ biến (hỏi trước khi thêm)

4. **Kiểm tra giao diện**: màn hình nhỏ 360dp và lớn; chữ to theo cài đặt hệ thống không vỡ layout;
   nội dung dài không tràn.

5. **Ghi lại** quyết định thiết kế mới vào `design/DESIGN_NOTES.md`
   (ví dụ "màu cảnh báo sắp hết thuốc: #E8A33D") để các màn sau nhất quán.

6. **Báo cáo**: mô tả màn hình đã làm, file đã tạo, cách mở màn hình đó để xem.
   Hỏi chủ dự án muốn chỉnh gì (màu, khoảng cách, cỡ chữ...) - chỉnh nhanh theo phản hồi.
