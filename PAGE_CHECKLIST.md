# Page-by-Page UI Checklist

## Standard Button Sizes (from Next.js Button component):
- **Default**: `h-9 px-4 py-2` (height 36px)
- **Small**: `h-8 px-3` (height 32px)  
- **Large**: `h-10 px-6` (height 40px)
- **Primary**: `bg-primary text-white shadow-xs hover:bg-primary/90`
- **Outline**: `border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground bg-transparent`

## Standard Input Sizes (from Next.js Input component):
- **Height**: `h-10` (40px)
- **Padding**: `px-3 py-2`
- **Border**: `border-2`
- **Background**: `bg-white`
- **Focus**: `border-primary focus-visible:ring-2 focus-visible:ring-primary/20`

## Color Palette:
- Primary: `#00377b`
- Primary Dark: `#001944`
- Secondary: `#d67c40`
- Secondary Dark: `#c26a36`
- Accent: `#f17313`

---

## Pages to Check:

### ✅ 1. index.html (Homepage)
- [x] Hero buttons - Fixed to `h-10 px-6` (large)
- [x] Feature card buttons - Fixed to `h-9 px-4` (default outline)
- [ ] Hero section padding - Should be `py-20` (not `py-16 md:py-24`)
- [ ] Features section padding - Should be `py-20` (not `py-16 md:py-20`)
- [ ] Features section heading - Should be `text-3xl md:text-4xl` (not `text-2xl sm:text-3xl md:text-4xl`)
- [ ] Features section gap - Should be `gap-8` (not `gap-6 md:gap-8`)
- [ ] Search boxes (if any) - Check sizes and colors
- [ ] All colors match Next.js exactly

### 2. client-area/index.html
- [ ] Hero buttons - Check sizes (`h-10 px-6` for large)
- [ ] CTA buttons - Check sizes and colors
- [ ] FAQ search input - Check size (`h-10`) and styling
- [ ] All buttons throughout page
- [ ] Colors match Next.js

### 3. advocate-area/index.html
- [ ] Hero buttons - Check sizes
- [ ] Membership plan buttons - Check sizes
- [ ] All buttons throughout page
- [ ] Colors match Next.js

### 4. contact/index.html
- [ ] Form inputs - Check sizes (`h-10`) and styling
- [ ] Submit button - Check size and color
- [ ] All form elements
- [ ] Colors match Next.js

### 5. law-library/* pages
- [ ] Search inputs - Check sizes
- [ ] Filter buttons - Check sizes
- [ ] Navigation buttons
- [ ] All interactive elements
- [ ] Colors match Next.js

### 6. law-colleges/* pages
- [ ] Search inputs
- [ ] Filter buttons
- [ ] All buttons
- [ ] Colors match Next.js

### 7. sawal-jawab/* pages
- [ ] Search inputs
- [ ] Question form inputs
- [ ] Submit buttons
- [ ] All buttons
- [ ] Colors match Next.js

### 8. blogs/* pages
- [ ] Search inputs
- [ ] Filter buttons
- [ ] All buttons
- [ ] Colors match Next.js

### 9. login/register pages
- [ ] Form inputs - Check sizes (`h-10`)
- [ ] Submit buttons - Check sizes
- [ ] All form elements
- [ ] Colors match Next.js

### 10. dashboard pages
- [ ] All buttons
- [ ] Form inputs
- [ ] Search boxes
- [ ] All UI elements
- [ ] Colors match Next.js

---

## Common Issues to Fix:
1. Button sizes - Many use `px-8 py-4` instead of `h-10 px-6` for large
2. Button shadows - Should use `shadow-xs` not `shadow-lg`
3. Input heights - Should be `h-10` (40px)
4. Border widths - Outline buttons should use `border` not `border-2`
5. Colors - Ensure exact color matches
6. Padding/spacing - Match Next.js exactly
