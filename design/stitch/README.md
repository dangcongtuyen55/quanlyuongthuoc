# Thư mục thiết kế từ Stitch

Bỏ vào đây mọi thứ export từ Google Stitch:
- Ảnh chụp từng màn hình (png) - đặt tên theo màn hình: `01-hom-nay.png`, `02-them-thuoc.png`...
- Code HTML/CSS mà Stitch xuất ra (nếu có)
- Ghi chú về font, màu chính

Antigravity sẽ đọc thư mục này để:
1. Trích bảng màu, font, bo góc vào `src/theme/`
2. Dựng lại các màn hình bằng React Native

**Lưu ý:** Stitch xuất ra web (HTML/CSS), không phải React Native. Antigravity cần
"dịch" sang component React Native chứ không copy nguyên. Ảnh chụp màn hình là
nguồn tham chiếu quan trọng nhất.

Màn hình mới phát sinh sau này sẽ làm trực tiếp trong Antigravity.
