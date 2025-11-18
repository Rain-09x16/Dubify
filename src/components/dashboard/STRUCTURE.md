# Sidebar Component Structure

## Visual Hierarchy

```
Dashboard Layout
│
├── Mobile Header (< 1024px)
│   ├── Hamburger Menu Button → Opens MobileSidebar
│   ├── Dubai Navigator Logo
│   ├── Demo Mode Badge
│   ├── Back to Home Button
│   └── User Profile Icon
│
├── Desktop Sidebar (>= 1024px)
│   ├── Header Section
│   │   ├── Dubai Navigator Logo (animated pulse)
│   │   ├── Brand Name + "AI Powered" subtitle
│   │   └── Collapse/Expand Button (chevron)
│   │
│   ├── Navigation Section (scrollable)
│   │   ├── Overview (Home icon)
│   │   ├── AI Chat (MessageSquare icon + AI badge)
│   │   ├── Search (Search icon)
│   │   └── Safety Check (Shield icon)
│   │
│   │   Each item has:
│   │   • Active indicator (gradient left border)
│   │   • Hover state (gray background)
│   │   • Icon with color coding
│   │   • Label text (hidden when collapsed)
│   │   • Tooltip (visible when collapsed)
│   │
│   └── Footer Section
│       └── AI Info Card
│           ├── Sparkles icon (animated pulse)
│           ├── "Powered by AI" heading
│           ├── "Gemini • Qdrant • Opus" tech stack
│           └── System status indicator (green pulse)
│
├── Mobile Sidebar Overlay (< 1024px, when open)
│   ├── Backdrop (blur + dismissible)
│   ├── Slide-out Panel
│   │   ├── Header
│   │   │   ├── Logo + Brand name
│   │   │   └── Close button (X)
│   │   │
│   │   ├── Navigation (same items as desktop)
│   │   │   Each item shows:
│   │   │   • Icon (larger, 24px)
│   │   │   • Name + Description
│   │   │   • Badge (if applicable)
│   │   │   • Active state
│   │   │
│   │   └── Footer AI Card (same as desktop)
│   │
│   └── Auto-close behavior
│       • On navigation
│       • On backdrop click
│       • On close button click
│
└── Main Content Area
    ├── Desktop Top Bar (>= 1024px)
    │   ├── Demo Mode Badge
    │   ├── Back to Home Button
    │   └── User Profile Icon
    │
    └── Page Content Container
        └── {children} (dashboard pages)
```

## Component States

### Sidebar (Desktop)
**Expanded** (default)
- Width: 256px (w-64)
- Logo + text visible
- Full navigation labels
- Collapse button: chevron-left icon

**Collapsed**
- Width: 80px (w-20)
- Logo fades out
- Icons centered
- Tooltips appear on hover
- Collapse button: chevron-left icon (rotated 180°)

### MobileSidebar
**Closed** (default)
- Not rendered (returns null)
- No backdrop
- No body scroll lock

**Open**
- Backdrop visible with blur
- Panel slides in from left
- Body scroll locked
- Close triggers: backdrop, X button, navigation

## Active State Logic

```tsx
// Exact match for /dashboard
pathname === item.href

// Starts-with match for subpages (but not /dashboard itself)
pathname.startsWith(item.href) && item.href !== '/dashboard'
```

Examples:
- On `/dashboard` → Overview is active
- On `/dashboard/chat` → AI Chat is active
- On `/dashboard/search` → Search is active
- On `/dashboard/safety` → Safety Check is active

## Responsive Breakpoints

| Viewport Width | Sidebar Variant | Header Variant |
|---------------|----------------|----------------|
| < 1024px      | MobileSidebar  | Mobile Header  |
| >= 1024px     | Desktop Sidebar| Desktop Top Bar|

Breakpoint: `lg` (1024px) - Tailwind default

## Animation Timings

| Element           | Duration | Easing        |
|-------------------|----------|---------------|
| Sidebar collapse  | 300ms    | ease-in-out   |
| Nav item hover    | 200ms    | ease-in-out   |
| Mobile slide-in   | 300ms    | ease-out      |
| Tooltip fade      | 200ms    | ease-in-out   |
| Backdrop fade     | 300ms    | ease-in       |
| Pulse effects     | 2s loop  | ease-in-out   |

## Color System

### Active States
- Background: `from-blue-50 to-cyan-50` (gradient)
- Text: `text-blue-700` (darker blue)
- Border: `from-blue-600 to-cyan-600` (gradient)

### Hover States
- Background: `bg-gray-50` (light gray)
- Text: `text-gray-900` (dark gray)

### Default States
- Background: Transparent
- Text: `text-gray-700` (medium gray)
- Icons: `text-gray-500` (lighter gray)

### Brand Elements
- Logo: `text-blue-600`
- Pulse: `from-blue-500 to-cyan-500` (gradient)
- AI Badge: `from-blue-500 to-cyan-500` (gradient)

## Z-Index Layers

| Element           | Z-Index | Purpose                    |
|-------------------|---------|----------------------------|
| Mobile backdrop   | 50      | Overlay all content        |
| Mobile sidebar    | 50      | Same as backdrop           |
| Mobile header     | 40      | Above content, below modal |
| Desktop top bar   | 30      | Sticky header              |
| Tooltips          | 50      | Above everything           |

## Accessibility Tree

```
<aside> (Sidebar)
  <header> (Logo section)
    <a> (Home link)
      <MapPin icon>
      <span> (Brand name)
    <button aria-label="Collapse/Expand sidebar">
      <ChevronLeft icon>

  <nav> (Navigation)
    <a> (Navigation link) × 4
      <div> (Item wrapper)
        <Icon>
        <span> (Label)
        <div role="tooltip"> (Collapsed tooltip)

  <footer> (AI Info)
    <div> (Info card)
      <Sparkles icon>
      <p> (Heading)
      <p> (Tech stack)
      <div> (Status)
```

## File Dependencies

```
Sidebar.tsx
├── next/link
├── next/navigation (usePathname)
├── lucide-react (6 icons)
├── @/lib/utils/cn
└── useState (React)

MobileSidebar.tsx
├── next/link
├── next/navigation (usePathname)
├── lucide-react (6 icons)
├── @/lib/utils/cn
└── useEffect (React)

layout.tsx
├── @/components/dashboard/Sidebar
├── @/components/dashboard/MobileSidebar
├── @/components/ui/button
├── lucide-react (3 icons)
├── next/link
└── useState (React)
```

## CSS Classes Reference

### Layout
- `min-h-screen` - Full viewport height
- `flex` - Flexbox container
- `flex-1` - Flex grow
- `overflow-auto` - Scrollable content

### Spacing
- `px-3, px-4, px-6` - Horizontal padding
- `py-2, py-4, py-6` - Vertical padding
- `gap-2, gap-3, gap-4` - Flexbox gap

### Borders
- `border-r` - Right border
- `border-b` - Bottom border
- `border-gray-200` - Border color

### Transitions
- `transition-all` - All properties
- `duration-200, duration-300` - Animation duration
- `ease-in-out` - Easing function

### Colors (Custom)
All colors use CSS variables from `globals.css`:
- `--primary` - Blue brand color
- `--border` - Gray border color
- `--background` - White/dark background
