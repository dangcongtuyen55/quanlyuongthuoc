/**
 * Bảng màu trích xuất từ thiết kế Stitch (Accessible Healthcare System)
 * Tối ưu độ tương phản cho người cao tuổi, dễ nhìn, chống loá mắt.
 */
export const colors = {
  // Màu chính (Primary) - Xanh Sapphire: Thể hiện độ tin cậy, y khoa chuẩn mực
  primary: '#003C90',
  primaryContainer: '#0F52BA',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#BCCEFF',
  primaryFixed: '#D9E2FF',
  onPrimaryFixed: '#001945',
  onPrimaryFixedVariant: '#00419C',

  // Màu phụ (Secondary) - Xanh lá cây (Sea Green): Đã uống thuốc, an tâm, thành công
  secondary: '#006D3D',
  secondaryContainer: '#97F3B5',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#047240',
  secondaryFixed: '#9AF6B8',
  onSecondaryFixed: '#00210F',

  // Màu phụ thứ 3 (Tertiary) - Xanh thép
  tertiary: '#00446C',
  tertiaryContainer: '#155C8C',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#A6D3FF',

  // Trạng thái cảnh báo, chưa uống, lỗi (Error / Missed)
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  onError: '#FFFFFF',
  onErrorContainer: '#93000A',

  // Nền & Khung chứa (Warm White chống chói mắt)
  background: '#F7F9FB',
  onBackground: '#191C1E',
  surface: '#F7F9FB',
  onSurface: '#191C1E',
  onSurfaceVariant: '#434653',
  outline: '#737784',
  outlineVariant: '#C3C6D5',

  // Các lớp nền thẻ (Card Containers)
  surfaceContainerLowest: '#FFFFFF', // Thẻ trắng nổi bật
  surfaceContainerLow: '#F2F4F6',    // Thẻ nhóm xám nhạt ấm
  surfaceContainer: '#ECEEF0',       // Thẻ phụ
  surfaceContainerHigh: '#E6E8EA',
  surfaceContainerHighest: '#E0E3E5',
} as const;

export type ColorTheme = typeof colors;

