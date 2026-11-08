---
name: android-apk-release
description: Build và ký file APK Android để cài trực tiếp (sideload) bằng Expo EAS hoặc build local, kèm cấu hình bảo mật cho bản release. Dùng khi cần ra file APK, tạo keystore, bật R8/proguard, cấu hình app.json, hoặc test trên máy thật.
---

# Skill: Build APK để cài trực tiếp

App không lên Google Play nên chỉ cần **APK ký bằng keystore của mình**.
Điều quan trọng nhất: **giữ keystore an toàn và dùng cùng 1 keystore cho mọi bản cập nhật**.
Nếu mất keystore hoặc đổi keystore, máy sẽ không cho cập nhật đè lên bản cũ (phải gỡ rồi cài lại, mất dữ liệu local).

## Chọn cách build
**Cách A - EAS Build (khuyên dùng, dễ nhất):**
- Cần tài khoản expo.dev (miễn phí, có giới hạn lượt build)
- Không cần cài Android Studio
- EAS có thể tự tạo và giữ keystore giúp; **nhớ tải keystore về backup** (`eas credentials`)

**Cách B - Build local:**
- Cần Android Studio + JDK, chạy `npx expo prebuild` rồi `./gradlew assembleRelease`
- Toàn quyền, không giới hạn lượt, nhưng cài đặt phức tạp hơn

Mặc định dùng **Cách A**. Hỏi chủ dự án nếu muốn đổi.

## Cấu hình `eas.json`
```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "apk" }
    }
  }
}
```
- `development`: bản có menu debug, dùng khi đang code (cần cho test thông báo thật).
- `preview` / `production`: bản dùng thật. Mặc định EAS ra `.aab` (cho Google Play) nên
  **phải đặt `buildType: "apk"`**.

Lệnh:
```
npm i -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview      # ra APK dùng thật
eas build -p android --profile development  # ra APK debug để dev
```
Build xong EAS cho link tải APK -> tải về điện thoại -> cài (cho phép "Cài ứng dụng không rõ nguồn").

## Cấu hình `app.json` (các mục liên quan)
- `android.package`: đặt tên gói cố định, ví dụ `com.ahxian.thuoc` (**không đổi sau khi đã cài**).
- `android.versionCode`: tăng 1 mỗi bản build mới (bắt buộc để cài đè cập nhật).
- `version`: số phiên bản hiển thị, ví dụ `1.0.0`.
- `android.permissions`: chỉ liệt kê quyền cần thiết (xem rule bảo mật).
- `android.allowBackup`: đặt **false** để dữ liệu app không bị adb backup lấy ra.
- `plugins`: `expo-notifications` (cấu hình icon + màu thông báo), `expo-secure-store`,
  `expo-local-authentication`.
- Icon thông báo Android phải là ảnh **trắng trong suốt** (đơn sắc), nếu không sẽ hiện ô vuông trắng.

## Bảo mật cho bản release
- Bật R8/minify để làm rối code (dùng `expo-build-properties`:
  `android.enableProguardInReleaseBuilds: true`, `enableShrinkResourcesInReleaseBuilds: true`).
- Chỉ cho HTTPS (`usesCleartextTraffic: false`).
- Xoá `console.log` debug.
- Không để `.env` chứa bí mật; chỉ URL + anon key.
- Nhớ: R8 chỉ làm khó đọc code chứ **không giấu được** key trong APK -> dựa vào RLS (xem skill
  `supabase-secure-backend`).
- Keystore và mật khẩu keystore: **không commit**, backup ở nơi an toàn (trình quản lý mật khẩu / ổ cá nhân).
- Khi phát file APK cho ai (hoặc cho chính mình qua link) dùng kênh riêng tư; đừng đăng công khai.
- Kiểm tra chữ ký: `apksigner verify --print-certs app.apk`.

## Quy trình ra bản mới
1. Sửa code, test trên máy thật
2. Tăng `versionCode` (và `version` nếu cần)
3. `npm audit`, `npx tsc --noEmit`, `npm run lint`
4. `eas build -p android --profile preview`
5. Tải APK, cài đè lên bản cũ trên điện thoại
6. Chạy lại checklist test nhắc thuốc (skill `medication-reminders`)
7. Ghi vào `CHANGELOG.md` những gì đã đổi

## Lỗi hay gặp
- **Cài đè báo "App not installed"**: khác keystore, hoặc `versionCode` không tăng.
- **Thông báo không hiện**: chưa cấp quyền POST_NOTIFICATIONS, chưa tạo channel, hoặc máy
  đang chặn do tối ưu pin.
- **Thông báo trễ giờ**: thiếu quyền báo thức chính xác (`SCHEDULE_EXACT_ALARM`).
- **Biểu tượng thông báo là ô vuông trắng**: icon không phải ảnh trắng trong suốt.
- **Build EAS ra .aab**: quên `buildType: "apk"`.
- **Màn hình trắng khi mở**: thiếu biến môi trường lúc build (kiểm tra EAS secrets / `.env`).
