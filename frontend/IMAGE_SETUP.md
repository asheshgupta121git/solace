# Image Setup Guide for Solace Mental Health App

## Color Palette Applied ✅
Your web app has been completely redesigned with the calm, smooth color palette:

| Color Role | Hex Code | Usage |
|-----------|----------|-------|
| **Primary Blue** | #4A90E2 | Buttons, links, badges, primary accents |
| **Sage Green** | #A8D5BA | Success states, secondary actions, water glass filled |
| **Soft Lavender** | #C7C3E6 | Accent elements, typing indicators, meditation time display |
| **Warm Beige** | #F5F1E7 | Main background color |
| **Misty Gray** | #D9D9D9 | Text/muted elements, borders |

## Images Setup Instructions

Your CSS is configured to use **3 background images**. Follow these steps:

### Step 1: Place Images in Public Folder
Move your images to the `frontend/public/` folder (create if it doesn't exist):

```
frontend/
├── public/
│   ├── img1.jpg    ← Chat section background
│   ├── img2.jpg    ← Breathing overlay background
│   └── img3.jpg    ← Wellness dashboard background
├── src/
└── ...
```

### Step 2: Image Requirements

**Recommended specifications:**

- **Format**: JPG or PNG
- **Size**: 1920x1080px or larger (optimized for performance)
- **Compression**: Optimized (50-200KB per image)
- **Style**: 
  - Calming nature scenes, blurred backgrounds
  - Soft gradients, wellness-themed imagery
  - Subtle textures that don't distract from content

### Step 3: Alternative: Use URLs

If you want to use online images instead, update `global.css`:

```css
/* Example in Chat Area */
.chat-area {
  background: linear-gradient(...),
              url('https://your-image-url.jpg') center/cover no-repeat;
}

/* Example in Breathing Overlay */
.breathing-overlay {
  background: linear-gradient(...),
              url('https://your-image-url.jpg') center/cover no-repeat;
}

/* Example in Wellness Dashboard */
.wellness-main {
  background: linear-gradient(...),
              url('https://your-image-url.jpg') center/cover no-repeat;
}
```

### Step 4: Configure Vite (if using public folder)

Your `vite.config.js` should handle public folder automatically. No changes needed!

## CSS Features Applied

### ✨ Calm & Smooth Design
- Light, airy backgrounds with warm beige base
- Soft shadows and smooth transitions (0.3s cubic-bezier)
- Reduced opacity on overlays for transparency effects
- Semi-transparent glass morphism cards

### 🎨 Color Scheme Implementation
- **Buttons**: Gradient from Primary Blue → Sage Green
- **Borders**: Subtle Primary Blue tints
- **Glows**: Soft shadows with Primary Blue tint
- **Active states**: 10-15% opacity highlights
- **Text**: Dark gray (#2C2C2C) on light backgrounds

### 📱 Section-Specific Backgrounds

#### Chat Section (img1.jpg)
- Overlay: `linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))`
- Layer: `rgba(255, 255, 255, 0.4)`
- Effect: Light, fresh, conversational feel

#### Breathing Overlay (img2.jpg)
- Overlay: `linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))`
- Backdrop filter: `blur(20px)`
- Effect: Meditative, calming, focused

#### Wellness Dashboard (img3.jpg)
- Overlay: `linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))`
- Layer: `rgba(245, 241, 231, 0.2)` + `rgba(255, 255, 255, 0.05)`
- Effect: Warm, nurturing, motivational

## Testing Your Images

After placing images:

1. **Start dev server**: `npm run dev`
2. **Check each page**:
   - Chat page (img1) - Should have your background in chat area
   - Breathing page (img2) - Should have your background during breathing exercise
   - Wellness page (img3) - Should have your background in dashboard

3. **Verify smooth scrolling**: Images have `background-attachment: fixed` for parallax effect

## Image Recommendations

**For Best Results, Use:**
- 🌿 Nature scenes (forests, plants, water)
- ☀️ Soft sunlight and warm tones
- 🌊 Calm, peaceful landscapes
- 📷 High-quality stock images (Unsplash, Pexels, Pixabay)

**Avoid:**
- ❌ Bright, busy patterns
- ❌ High contrast images
- ❌ Text overlays that conflict with content
- ❌ Dark images (white text needs contrast)

## Quick Image Links (Free Resources)

For quick setup, try these sources:
- **Unsplash**: unsplash.com
- **Pexels**: pexels.com
- **Pixabay**: pixabay.com
- **Placeholders**: via CSS gradient overlays

## Done! 🎉

Your Solace app now features:
✅ Calming color palette (Serene Blue, Sage Green, Soft Lavender)  
✅ Smooth transitions and animations  
✅ Light, airy design  
✅ Background image support on all major sections  
✅ Semi-transparent overlays for content legibility  

The app is ready for your custom images!
