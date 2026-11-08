---
description: Thêm một tính năng mới vào app theo quy trình lập kế hoạch - làm - kiểm tra
---

# /add-feature - Thêm tính năng

Dùng: `/add-feature <mô tả tính năng>` (ví dụ: "thêm màn hình thống kê tuân thủ uống thuốc theo tuần")

1. **Hiểu yêu cầu**: viết lại tính năng bằng 3-5 dòng. Nếu còn điểm mơ hồ ảnh hưởng lớn,
   hỏi tối đa 3 câu (không hỏi lan man).

2. **Lập kế hoạch ngắn**, gồm:
   - Màn hình / component nào thêm hoặc sửa
   - Có cần đổi database không? (nếu có: viết file migration mới **đánh số tiếp theo**,
     có RLS đầy đủ, **không sửa file migration cũ**)
   - Có ảnh hưởng thông báo nhắc không? (nếu có đọc skill `medication-reminders`)
   - Có chạm vào dữ liệu nhạy cảm / quyền mới không? (nếu có đối chiếu rule `01-security.md`)
   Cho chủ dự án duyệt kế hoạch nếu tính năng lớn; nhỏ thì làm luôn.

3. **Làm UI (nếu có)**: bám rule `03-ui-design.md`, dùng lại component sẵn có,
   tự thiết kế trong Antigravity (không cần Stitch). Có đủ trạng thái: đang tải / lỗi / rỗng.

4. **Làm logic**: gọi Supabase qua `features/*/api.ts`, validate bằng zod, comment tiếng Việt.

5. **Kiểm tra**
   - `npx tsc --noEmit` và `npm run lint` phải sạch
   - Tự duyệt lại luồng: người dùng bấm gì -> chuyện gì xảy ra -> dữ liệu đi đâu
   - Nếu có đụng thông báo: chạy checklist test trong skill `medication-reminders`

6. **Ghi lại**: thêm dòng vào `CHANGELOG.md`; nếu có quyết định thiết kế mới ghi vào
   `design/DESIGN_NOTES.md`.

7. **Báo cáo** theo mẫu (Đã làm gì / File đổi / Cách kiểm tra / Việc chủ dự án cần làm tay).
