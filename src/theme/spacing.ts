/**
 * Khoảng cách và bo góc chuẩn từ Stitch
 * Vùng bấm rộng rãi (nút >= 56dp) để bấm dễ trúng, không bấm nhầm.
 */
export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  gutter: 20, // lề 2 bên màn hình
} as const;

export const rounded = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

export const touchTarget = {
  minHeight: 56, // chiều cao tối thiểu cho nút bấm chính
  minTarget: 48, // vùng chạm tối thiểu cho icon / chip
} as const;

