---
description: Rà soát bảo mật toàn dự án trước khi dùng thật hoặc trước khi build bản mới
---

# /security-audit - Rà soát bảo mật

Đối chiếu với rule `01-security.md`. Chỉ **báo cáo và đề xuất sửa**, không tự sửa những thứ
đụng tới database hoặc khoá mà chưa hỏi.

1. **Tìm bí mật bị lộ**
   - Tìm trong code và lịch sử git: `service_role`, `secret`, `password`, `private_key`, chuỗi JWT dài
   - Kiểm tra `.gitignore` có `.env`, `*.keystore`, `*.jks`
   - Kiểm tra mọi biến `EXPO_PUBLIC_*` chỉ chứa thứ công khai được

2. **Database / RLS**
   - Đọc toàn bộ `supabase/migrations/`: mọi bảng có `enable row level security` chưa?
   - Mọi policy đều dựa trên `auth.uid()`? Có policy nào `using (true)` hoặc cấp cho `anon` không?
   - Cột `user_id` có `default auth.uid()` và policy có `with check`?
   - Nhắc chủ dự án: chạy **Security Advisor** trong Supabase Dashboard và xác nhận
     đã tắt đăng ký công khai.

3. **Lưu trữ trên máy**
   - Token lưu bằng SecureStore (không phải AsyncStorage)?
   - Có log dữ liệu nhạy cảm không?
   - `allowBackup` đã `false`?

4. **Mạng**: có chỗ nào dùng `http://` hoặc tắt kiểm tra SSL?

5. **Quyền Android**: liệt kê quyền trong `app.json` / manifest, đánh dấu cái nào không cần thiết.

6. **Thư viện**: `npm audit`; liệt kê thư viện lạ / lâu không cập nhật.

7. **Khoá app**: có xác thực sinh trắc / PIN chưa? Có che màn hình "recent apps" chưa?

8. **Báo cáo** dạng bảng: Mục | Tình trạng (Ổn / Cần sửa / Hỏi chủ dự án) | Ghi chú | Đề xuất.
   Xếp mục nghiêm trọng lên đầu. Viết dễ hiểu cho người không chuyên.
