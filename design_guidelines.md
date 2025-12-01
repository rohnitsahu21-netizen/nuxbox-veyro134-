# NuxBox Design Guidelines

## Design Approach
**Theme**: Dark Neon - A futuristic cyberpunk-inspired aesthetic with glowing neon accents against dark backgrounds, creating a modern Linux/tech-forward identity.

## Core Visual Elements

### Color Strategy
- **Primary Dark**: Deep charcoal/black backgrounds (#0a0a0a, #141414)
- **Neon Accents**: Electric blue (#00f0ff), cyber green (#00ff88), purple (#bf00ff), pink (#ff00aa) for interactive elements, borders, and glows
- **Text**: White (#ffffff) for primary text, light gray (#a0a0a0) for secondary
- **Glass Effects**: Semi-transparent panels with backdrop blur for modern depth

### Typography
- **Headings**: Bold, geometric sans-serif (e.g., Orbitron, Exo 2) - sizes: text-4xl to text-6xl
- **Body**: Clean, readable sans-serif (e.g., Inter, Rubik) - text-base to text-lg
- **Code/Technical**: Monospace font for app names and technical details

### Layout System
**Spacing**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Page padding: px-6 md:px-12 lg:px-20
- Section spacing: py-12 md:py-20
- Component gaps: gap-4 to gap-8

## Navigation & Tab System

### Animated Tab Navigation
- Fixed header with horizontal tab navigation that stays in place
- Tabs switch content panels without page reload (SPA behavior)
- Active tab: Neon underline glow animation (3px thick, matching neon accent)
- Tab hover: Subtle glow effect, smooth color transition (0.3s)
- Tabs: Browse Apps | Downloads | Feedback | Report | Activities | [User/Login]

### Navigation Structure
- Logo placeholder (top-left): 48px × 48px space with "NuxBox" wordmark
- Main tabs (center): Evenly spaced, text-lg, uppercase tracking
- User section (top-right): Profile icon or Login/Signup buttons with neon borders

## Key Pages & Components

### Hero Section (Homepage/Browse)
- Full-width banner (h-96) with subtle animated gradient background
- Neon grid overlay pattern for tech aesthetic
- Headline: "Free Linux Apps & Tools" - text-5xl, bold, with neon glow text-shadow
- Search bar: Glass morphism input with neon border focus state, rounded-lg

### App Cards (Browse Section)
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Card design: Dark background with neon border (border-2), rounded-xl, hover lift effect
- Card content: App icon (64px), name, category tag (neon pill), description (2 lines), download button
- Download button: Neon gradient background with glow, rounded-full

### Login/Signup Pages
- Centered card (max-w-md) with glass morphism effect
- Neon border glow animation on focus for input fields
- "Remember Me" checkbox with custom neon styling
- Social login buttons: Outlined with neon accents
- Toggle between Login/Signup: Smooth slide transition

### Feedback & Report Forms
- Two-column layout on desktop: Form (left) + Submitted items preview (right)
- Input fields: Dark with neon borders, rounded corners
- Submit button: Prominent with neon glow, pulse animation on hover
- Success message: Neon green flash animation

### User Activities Dashboard
- Tab sub-navigation: Downloads | Feedback | Reports
- List items: Dark cards with neon left-border accent (border-l-4)
- Timestamp: Small text with neon color
- Action buttons: Icon buttons with neon hover states

### Admin Upload Interface
- Drag-and-drop zone: Dashed neon border (border-dashed border-4)
- Active drop state: Solid neon border with glow
- File list: Dark cards showing uploaded zips with delete icons

## Component Library

### Buttons
- Primary: Neon gradient background, white text, rounded-lg, shadow-neon-glow
- Secondary: Transparent with neon border-2, hover fills with neon color
- Icon buttons: Circular, neon border, hover glow

### Forms
- Text inputs: bg-dark with border-neon (focus), rounded-md, p-3
- Select dropdowns: Custom styled with neon caret
- Checkboxes/Radio: Custom neon checkmarks

### Cards
- Standard: bg-dark-800, border-neon-subtle, rounded-xl, p-6
- Elevated: shadow-xl with neon glow effect
- Interactive: Hover scale (scale-105), transition-all duration-300

### Loading States
- Skeleton screens: Animated gradient shimmer in neon colors
- Spinners: Circular neon ring with rotating segment
- Progress bars: Neon fill animation, rounded-full

## Animations
- **Page Transitions**: Fade in/out (0.3s)
- **Tab Switching**: Content slide + fade (0.4s ease-in-out)
- **Hover Effects**: Scale, glow intensity changes (0.2s)
- **Neon Pulse**: Subtle glow breathing effect on CTAs (2s loop)
- **Loading**: Smooth shimmer across skeleton elements

## SEO Elements
- Semantic HTML5: header, nav, main, section, article, footer
- Meta tags in head: description, keywords, og:tags
- Alt text for all images
- H1-H6 hierarchy properly implemented

## Images
- **Logo**: Placeholder 128px × 128px (transparent PNG), located in `/static/images/logo.png`
- **App Icons**: 64px × 64px thumbnails for each app listing
- **Hero Background**: Optional abstract tech/circuit pattern overlay (subtle, low opacity)

## Folder Structure Note
Organize CSS in `/static/css/`, JS in `/static/js/`, images in `/static/images/`, uploads in `/downloads/`, with clear naming conventions (kebab-case).

This design creates a striking, modern platform that feels cutting-edge and tech-focused while maintaining excellent usability and smooth interactions throughout.