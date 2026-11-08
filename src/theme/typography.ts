/**
 * Cỡ chữ và kiểu chữ trích từ thiết kế Stitch
 * Chữ to, rõ ràng, tối thiểu 16sp để người lớn tuổi đọc dễ dàng không mỏi mắt.
 */
export const typography = {
  headlineXl: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700' as const,
    letterSpacing: -0.36,
  },
  headlineLg: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
  },
  headlineMd: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  bodyLg: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400' as const,
  },
  bodyMd: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  labelLg: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  labelMd: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  labelSm: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
} as const;

