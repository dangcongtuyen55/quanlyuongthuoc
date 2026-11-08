---
name: medication-reminders
description: Cách đặt, huỷ và đồng bộ thông báo nhắc uống thuốc trên Android bằng expo-notifications. Dùng khi làm tính năng lịch uống, nhắc thuốc, nút "Đã uống", cảnh báo sắp hết thuốc, hoặc khi thông báo không bật đúng giờ.
---

# Skill: Nhắc uống thuốc

## Nguyên tắc cốt lõi
1. **Thông báo là local**, đặt ngay trên máy bằng `expo-notifications`. Không dùng push từ server
   (server chết hoặc mất mạng thì vẫn phải nhắc được).
2. Supabase chỉ lưu **dữ liệu lịch** để đồng bộ/sao lưu. Mỗi lần dữ liệu lịch thay đổi,
   app đặt lại toàn bộ thông báo từ dữ liệu đó (hàm `rescheduleAll`).
3. Một nguồn sự thật duy nhất: bảng `schedules`. Thông báo chỉ là bản "dẫn xuất".

## Thiết lập Android
- Tạo **notification channel** riêng (importance HIGH, có âm thanh, rung):
  `setNotificationChannelAsync('medication', {...})` - phải tạo trước khi đặt thông báo.
- Xin quyền `POST_NOTIFICATIONS` lúc người dùng vào app lần đầu (Android 13+),
  giải thích lý do bằng 1 màn hình thân thiện trước khi hiện hộp thoại hệ thống.
- Để nhắc **đúng giờ** cần quyền báo thức chính xác (`SCHEDULE_EXACT_ALARM`). Từ Android 12+
  người dùng có thể phải bật tay trong Cài đặt. App cần:
  - phát hiện chưa có quyền
  - hiện hướng dẫn + nút mở thẳng trang cài đặt
- **Tối ưu pin** (Doze / battery optimization) của một số hãng máy (Xiaomi, Oppo, Samsung...) có
  thể chặn thông báo. Thêm màn hình hướng dẫn "Để nhắc ổn định" trong Cài đặt.

## Cách đặt lịch
- Với lịch lặp hằng ngày / theo thứ: dùng trigger kiểu lặp (`weekly` với `weekday` + `hour` + `minute`,
  hoặc `daily`) thay vì đặt từng ngày một. Mỗi (thuốc, giờ, thứ) = 1 thông báo.
- Lưu `notification_id` trả về (trong `expo-secure-store` hoặc bảng local) để huỷ đúng khi sửa/xoá lịch.
- Trong `data` của thông báo nhét: `medicationId`, `scheduleId`, `scheduledTime`
  để khi bấm vào biết đang nói về thuốc nào.
- Nội dung thông báo: tiêu đề "Đến giờ uống thuốc", nội dung "Paracetamol 500mg - 1 viên".
  Nếu muốn riêng tư hơn ở màn hình khoá, để nội dung chung chung ("Đến giờ uống thuốc") và
  cho người dùng chọn trong Cài đặt.

## Nút hành động trên thông báo
Đăng ký category có 2 action: **Đã uống** và **Nhắc lại sau 15 phút**.
- "Đã uống" -> ghi 1 dòng vào `dose_logs` (status `taken`, `taken_at = now`).
- "Nhắc lại" -> đặt 1 thông báo một lần sau 15 phút.
- Nếu app đang offline: ghi vào hàng đợi local, đồng bộ lên Supabase khi có mạng.

## Khi nào phải đặt lại toàn bộ (rescheduleAll)
- Thêm / sửa / xoá thuốc hoặc lịch
- Mở app (kiểm tra cho chắc)
- Sau khi đăng nhập
- Người dùng đổi múi giờ
Quy trình: huỷ hết thông báo cũ của app -> đọc `schedules` đang bật -> đặt lại.
Nhờ vậy không bao giờ bị trùng hoặc sót thông báo.

## Sau khi khởi động lại máy
Thông báo local đã đặt thường được hệ thống khôi phục. Phải **tự test thật trên máy**:
đặt nhắc sau 2 phút -> khởi động lại điện thoại -> xem có nhắc không.
Nếu không, thêm tác vụ nền / rescheduleAll khi mở app.

## Ghi nhật ký & trạng thái "quên"
- Khi tới giờ mà không có log -> coi là "chưa uống".
- Khi mở app, quét các giờ đã qua trong hôm nay chưa có log và hỏi nhẹ nhàng
  ("Bạn đã uống liều 8:00 chưa?") hoặc cho đánh dấu `missed` sau 2 giờ.

## Cảnh báo sắp hết thuốc
- Mỗi lần ghi `taken`, trừ `stock` của thuốc (nếu có theo dõi số lượng).
- Khi `stock <= ngưỡng` (ví dụ đủ dùng 3 ngày) -> đặt 1 thông báo "Sắp hết thuốc: <tên>".

## Test bắt buộc trước khi báo xong
1. Đặt nhắc 1-2 phút sau -> có hiện thông báo đúng giờ khi app đóng hẳn?
2. Khoá màn hình, tắt app, chờ -> vẫn nhắc?
3. Sửa giờ -> thông báo cũ không còn, thông báo mới đúng?
4. Xoá thuốc -> không còn thông báo ma?
5. Bấm "Đã uống" từ thông báo -> có dòng log?
6. Tắt mạng -> vẫn nhắc, vẫn ghi log và đồng bộ lại sau?

> Lưu ý: Expo Go **không** test đầy đủ được thông báo trên Android. Phải dùng **development build**
> hoặc bản APK thật. Xem skill `android-apk-release`.
