# Financial Helm - Design System

## Color Palette

### Primary Colors
- **Navy Blue** `#0A3D62` - Primary brand color, represents trust and stability
- **Green** `#22C55E` - Success, income, positive growth
- **Red** `#EF4444` - Expenses, warnings, alerts

### Secondary Colors
- **Sky Blue** `#3B82F6` - Information, links
- **Amber** `#F59E0B` - Warnings, approaching limits
- **Purple** `#8B5CF6` - Special features, premium

### Neutral Colors
- **Gray 50** `#F9FAFB` - Background
- **Gray 100** `#F3F4F6` - Card backgrounds
- **Gray 600** `#4B5563` - Secondary text
- **Gray 900** `#111827` - Primary text
- **White** `#FFFFFF` - Card surface

## Typography

### Font Family
- **Primary**: Inter (sans-serif)
- Clean, modern, highly legible

### Font Sizes
- **Heading 1**: 3rem (48px) - Page titles
- **Heading 2**: 2.25rem (36px) - Section titles
- **Heading 3**: 1.5rem (24px) - Card titles
- **Body**: 1rem (16px) - Regular text
- **Small**: 0.875rem (14px) - Secondary information
- **Extra Small**: 0.75rem (12px) - Labels, captions

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Components

### Button Variants
1. **Primary** - Navy blue background, white text
2. **Secondary** - Green background, white text (CTA)
3. **Outline** - Navy border, transparent background
4. **Ghost** - No border, transparent background with hover effect

### Button Sizes
- **Small**: px-3 py-1.5
- **Medium**: px-6 py-2.5
- **Large**: px-8 py-3.5

### Cards
- **Base**: White background, rounded-xl, shadow-md
- **Hover**: Adds shadow-lg on hover for interactive cards
- **Padding**: 1.5rem (24px) default

### Icons & Emojis
Using emojis for MVP simplicity:
- 💰 Money/Balance
- 📈 Growth/Income
- 📉 Expenses
- 🎯 Goals/Targets
- ⎈ Helm (logo symbol)
- 📊 Charts/Analytics
- ⚙️ Settings
- ⚠️ Warnings
- ✓ Success

## Layout

### Container
- **Max Width**: 1280px (max-w-7xl)
- **Padding**: 4-8 (1-2rem responsive)

### Grid Systems
- **2 Column**: md:grid-cols-2
- **3 Column**: lg:grid-cols-3
- **4 Column**: lg:grid-cols-4

### Spacing Scale
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

## Responsive Breakpoints

- **Mobile**: < 768px (default)
- **Tablet**: ≥ 768px (md:)
- **Desktop**: ≥ 1024px (lg:)
- **Large Desktop**: ≥ 1280px (xl:)

## Interactions

### Transitions
- **Duration**: 200-300ms
- **Easing**: ease-in-out
- **Properties**: colors, opacity, transform, shadow

### Hover States
- Buttons: Darker shade + scale-95 on active
- Cards: Increased shadow
- Links: Color change + underline

### Active States
- Scale down slightly (scale-95)
- Darker background color

## Accessibility

### Contrast Ratios
- All text meets WCAG AA standards (4.5:1 for normal text)
- Large text and UI elements meet AAA standards (7:1)

### Focus States
- Visible focus rings on all interactive elements
- Color: Primary blue with 2px width

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order throughout the application

## Design Principles

1. **Clarity**: Information should be easy to understand at a glance
2. **Consistency**: Use same patterns throughout the app
3. **Feedback**: Provide immediate visual feedback for user actions
4. **Hierarchy**: Clear visual hierarchy guides user attention
5. **Simplicity**: Remove unnecessary elements, keep it clean
6. **Responsive**: Works seamlessly on all device sizes

## Iconography Guidelines

- **Size**: Consistent sizing (16px, 20px, 24px)
- **Style**: Outline style for UI icons
- **Color**: Inherit from parent or use semantic colors
- **Spacing**: 8px minimum padding around clickable icons

## Data Visualization

### Progress Bars
- **Height**: 8-12px
- **Rounded**: Full rounded corners
- **Colors**: 
  - < 25%: Red (#EF4444)
  - 25-50%: Amber (#F59E0B)
  - 50-75%: Blue (#3B82F6)
  - > 75%: Green (#22C55E)

### Charts
- Use consistent colors from palette
- Clear labels and legends
- Responsive sizing
- Tooltips on hover

## Animation Guidelines

### Micro-interactions
- Button clicks: Scale down (0.95)
- Loading: Gentle pulse or spin
- Success: Quick scale up then down
- Error: Shake animation

### Page Transitions
- Fade in on page load (300ms)
- Smooth scrolling for anchor links
- No jarring movements

---
*Design System v1.0 - October 2025*




