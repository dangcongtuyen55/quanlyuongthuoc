---
name: Accessible Healthcare System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434653'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737784'
  outline-variant: '#c3c6d5'
  surface-tint: '#1d59c1'
  primary: '#003c90'
  on-primary: '#ffffff'
  primary-container: '#0f52ba'
  on-primary-container: '#bcceff'
  inverse-primary: '#b0c6ff'
  secondary: '#006d3d'
  on-secondary: '#ffffff'
  secondary-container: '#97f3b5'
  on-secondary-container: '#047240'
  tertiary: '#00446c'
  on-tertiary: '#ffffff'
  tertiary-container: '#155c8c'
  on-tertiary-container: '#a6d3ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b0c6ff'
  on-primary-fixed: '#001945'
  on-primary-fixed-variant: '#00419c'
  secondary-fixed: '#9af6b8'
  secondary-fixed-dim: '#7ed99e'
  on-secondary-fixed: '#00210f'
  on-secondary-fixed-variant: '#00522d'
  tertiary-fixed: '#cee5ff'
  tertiary-fixed-dim: '#96ccff'
  on-tertiary-fixed: '#001d32'
  on-tertiary-fixed-variant: '#004a75'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  label-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 1.5rem
  space-xs: 0.5rem
  space-sm: 1rem
  space-md: 1.5rem
  space-lg: 2rem
  space-xl: 3rem
---

## Brand & Style

This design system is crafted for a medication management application tailored specifically for seniors. The brand personality is grounded, empathetic, reassuring, and exceptionally clear. The UI evokes a strong sense of safety, reliability, and emotional calm, minimizing cognitive load for older adults and their caregivers. 

The aesthetic draws from a **Corporate / Modern** framework infused with high-accessibility standards: generous whitespace, high-contrast states, large touch targets, and unambiguous visual feedback. Every element is structured to foster independence and reduce anxiety around complex medication schedules.

## Colors

The palette centers on trustworthy medical blues and calming soft greens, set against warm white backgrounds to prevent harsh glare. 

- **Primary (`#0F52BA` - Sapphire Blue):** Used for primary actions, critical headers, and interactive states. It projects clinical authority and dependability.
- **Secondary (`#2E8B57` - Sea Green):** Applied to success states, taken medications, and positive reinforcement indicators.
- **Tertiary (`#4682B4` - Steel Blue):** Supports informational containers and secondary navigation.
- **Neutral (`#F9FBFD` - Warm White/Off-White):** The foundational canvas color, offering softer contrast than pure white to reduce eye strain. Text is set in deep charcoal (`#1A2129`) to guarantee WCAG AAA compliance.

## Typography

Typography is treated as a core accessibility feature. We utilize **Atkinson Hyperlegible Next** for its distinct character forms, wide apertures, and unambiguous letter differentiation (especially distinguishing capital 'I', lowercase 'l', and number '1'). 

Body sizes never drop below 16px, with standard reading text set at 18px. Line heights are generous to prevent tracking fatigue. Scale down large headers gracefully on mobile viewports to avoid awkward wrapping while maintaining strict typographic hierarchy.

## Layout & Spacing

The layout relies on a **Fluid grid** system optimized for single-column and two-column stacking on mobile and tablet devices, preventing horizontal scrolling and complex multi-column reading paths. 

Spacing is intentionally generous. A comfortable rhythm (`space-sm` through `space-xl`) separates interactive targets, ensuring that fingers of all dexterity levels can navigate without accidental mis-taps. Outer margins remain consistent at 24px across viewports, adapting cleanly to larger tablet screens with centered max-width content containers.

## Shapes

The shape language employs a **Rounded (`2`)** standard. UI elements feature a generous base roundedness of 0.5rem, with cards and containers scaling up to `rounded-lg` (1rem) and `rounded-xl` (1.5rem). 

Softly rounded corners remove harsh geometric edges, contributing to a welcoming, non-clinical aesthetic while preserving clear directional boundaries for touch targets.

## Components

- **Buttons:** Designed with a minimum height of 56px to ensure effortless touch interaction. Primary buttons feature solid sapphire fills with high-contrast white bold text. Secondary actions use high-contrast outlined borders.
- **Chips:** Used for filtering schedules or medication types. Generously padded with clear, bold text labels and distinct selected states backed by soft green or blue fills.
- **Checkboxes & Radio Buttons:** Oversized (minimum 32x32px) with unmistakable check or fill indicators. Avoid tiny native inputs entirely in favor of large, tappable list row wrappers.
- **Input Fields:** High-contrast text inputs featuring thick structural borders (2px), clear floating or persistent above-field labels, and large 18px input text. Error states use bold red borders with direct, helpful helper text.
- **Cards:** Medication reminder cards use structured tonal layering with clear iconography, large drug names, explicit dosage instructions, and prominent action buttons ("Take" / "Snooze").
- **Additional Components:** Include high-contrast time-picker wheels with enlarged center selection text, emergency caregiver call banners fixed at the base of the screen, and visual dose-remaining progress rings.