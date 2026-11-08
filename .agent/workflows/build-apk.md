---
description: Kiểm tra trước release và build file APK để cài trực tiếp lên điện thoại
---

# /build-apk - Build APK

Đọc skill `android-apk-release` trước khi làm.

1. **Kiểm tra trước build**
   - `npx tsc --noEmit`, `npm run lint`, `npm audit` -> báo kết quả; lỗi nghiêm trọng thì dừng
   - Tìm `console.log` còn sót chứa dữ liệu nhạy cảm và xoá
   - Chắc chắn `.env` không bị commit và không chứa `service_role` key
   - Chạy workflow `/security-audit` nếu đây là lần build đầu hoặc có đổi lớn

2. **Tăng phiên bản**: tăng `android.versionCode` thêm 1; cập nhật `version` nếu cần.

3. **Hướng dẫn chủ dự án chạy lệnh** (cần đăng nhập Expo nên chủ dự án tự chạy trong terminal):
   ```
   eas login
   eas build -p android --profile preview
   ```
   Giải thích bằng lời thường từng bước nếu đây là lần đầu (tạo keystore, trả lời các câu hỏi của EAS).

4. **Nhắc backup keystore**: `eas credentials` -> tải keystore về cất kỹ (xem skill).

5. **Hướng dẫn cài**: tải APK từ link EAS về điện thoại -> mở file -> cho phép cài từ nguồn này
   -> cài. Lần sau cài đè lên bản cũ.

6. **Checklist sau khi cài** (nhờ chủ dự án thử trên máy thật):
   - Mở app, đăng nhập được
   - Cấp quyền thông báo + báo thức chính xác
   - Đặt nhắc sau 2 phút, tắt hẳn app -> có nhắc đúng giờ?
   - Bấm "Đã uống" từ thông báo -> có ghi log?
   - Tắt mạng thử một lượt

7. Ghi `CHANGELOG.md` cho phiên bản này.
