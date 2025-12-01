# Dashboard Sidebar Components

Modern, responsive sidebar navigation system for Dubai Navigator dashboard.

## Components

### Sidebar (Desktop)
- **Location**: `src/components/dashboard/Sidebar.tsx`
- **Features**:
  - Collapsible/expandable functionality with smooth animations
  - Active page highlighting with gradient indicators
  - Icon-based navigation with lucide-react icons
  - Tooltips in collapsed state for better UX
  - AI-powered badge on footer with status indicator
  - Gradient backgrounds and hover effects
  - Fully accessible keyboard navigation

### MobileSidebar
- **Location**: `src/components/dashboard/MobileSidebar.tsx`
- **Features**:
  - Slide-out overlay navigation
  - Backdrop blur and dismiss on outside click
  - Auto-close on navigation
  - Body scroll lock when open
  - Touch-friendly interface with larger targets
  - Detailed navigation with descriptions
  - Smooth entrance/exit animations

## Navigation Structure

The sidebar includes these pages:
1. **Overview** (`/dashboard`) - Dashboard home with analytics
2. **AI Chat** (`/dashboard/chat`) - Chat with AI assistant (has AI badge)
3. **Search** (`/dashboard/search`) - Semantic search functionality
4. **Safety Check** (`/dashboard/safety`) - Area safety analyzer

## Usage

The components are automatically integrated into `src/app/dashboard/layout.tsx`:

```tsx
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileSidebar } from '@/components/dashboard/MobileSidebar';

// Desktop sidebar (hidden on mobile)
<div className="hidden lg:block">
  <Sidebar />
</div>

// Mobile sidebar (shown only on mobile)
<MobileSidebar
  isOpen={mobileMenuOpen}
  onClose={() => setMobileMenuOpen(false)}
/>
```

## Design Features

### Color Scheme
- **Primary**: Blue (#0066FF) for active states and branding
- **Accent**: Cyan for gradients and highlights
- **Neutral**: Gray scale for text and backgrounds
- **System**: Green for status indicators

### Animations
- Smooth transitions (200-300ms) for state changes
- Collapse/expand with rotation and scale transforms
- Fade-in effects for tooltips
- Pulse animations for status indicators

### Responsive Breakpoints
- **Mobile**: < 1024px (lg breakpoint)
  - Full-screen overlay sidebar
  - Hamburger menu in header
- **Desktop**: >= 1024px
  - Fixed sidebar with collapse functionality
  - Width: 64px (collapsed) to 256px (expanded)

## Accessibility

- Semantic HTML with proper ARIA labels
- Keyboard navigation support
- Focus indicators on interactive elements
- Screen reader announcements for state changes
- Sufficient color contrast ratios (WCAG AA compliant)

## Testing

To test the sidebar:

1. **Desktop View** (>1024px):
   - Click the collapse button to toggle sidebar width
   - Hover over collapsed icons to see tooltips
   - Click navigation items to navigate
   - Verify active state highlighting

2. **Mobile View** (<1024px):
   - Click hamburger menu to open sidebar
   - Click backdrop or X button to close
   - Tap navigation items to navigate (sidebar auto-closes)
   - Verify no body scroll when sidebar is open

3. **Active State Testing**:
   - Navigate to each page
   - Verify the corresponding nav item is highlighted
   - Check gradient indicator appears on active item

## Customization

### Adding New Navigation Items

Edit `navigationItems` array in both components:

```tsx
const navigationItems: NavigationItem[] = [
  {
    name: 'New Page',
    href: '/dashboard/new-page',
    icon: IconComponent, // from lucide-react
    badge: 'NEW', // optional
    description: 'Page description', // optional
  },
];
```

### Changing Colors

The sidebar uses Tailwind CSS classes. Key color classes:
- Active state: `from-blue-50 to-cyan-50` (background), `text-blue-700` (text)
- Hover state: `hover:bg-gray-50`
- Brand colors: `text-blue-600`, `bg-blue-500`

### Adjusting Collapse Width

Change the `w-20` (collapsed) and `w-64` (expanded) classes in `Sidebar.tsx`.

## Dependencies

- **lucide-react**: Icons
- **next/link**: Client-side navigation
- **next/navigation**: `usePathname` hook for active state
- **clsx + tailwind-merge**: Conditional styling via cn utility
- **Tailwind CSS v4**: Styling

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Chrome Android

## Performance

- Minimal re-renders with proper React hooks
- CSS transitions (GPU-accelerated)
- Lazy tooltip rendering
- Optimized mobile sidebar with portal pattern
