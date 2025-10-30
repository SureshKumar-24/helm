# Progressive Web App (PWA) Setup Guide

## Overview

Financial Helm is now a Progressive Web App (PWA), which means users can install it on their devices and use it like a native application. This guide covers the PWA features, installation instructions, and technical details.

## Features

### 🚀 Installation
- Install the app on Android, iOS, and desktop devices
- Add to home screen for quick access
- Launch in standalone mode without browser UI

### 📱 Offline Support
- View previously loaded pages without internet connection
- Cached static assets (CSS, JavaScript, images)
- Network-first strategy for API requests with cache fallback
- User-friendly offline page when content is unavailable

### 🔄 Automatic Updates
- Background detection of new app versions
- User-friendly update notification
- One-click update with automatic reload
- Old cache cleanup on update

### 🎨 Platform-Specific Features
- **iOS**: Apple touch icons, status bar styling, standalone mode
- **Android**: Maskable icons, theme color integration, install prompt
- **Desktop**: Standalone window with custom branding

## Installation Instructions

### For Android Users (Chrome)

1. Open Financial Helm in Chrome browser
2. Look for the "Install" prompt at the bottom of the screen
3. Tap "Install" or tap the menu (⋮) and select "Install app"
4. The app icon will be added to your home screen
5. Launch the app from your home screen for the full experience

### For iOS Users (Safari)

1. Open Financial Helm in Safari browser
2. Tap the Share button (square with arrow pointing up)
3. Scroll down and tap "Add to Home Screen"
4. Edit the name if desired and tap "Add"
5. The app icon will appear on your home screen
6. Launch the app from your home screen

### For Desktop Users (Chrome/Edge)

1. Open Financial Helm in Chrome or Edge browser
2. Look for the install icon (⊕) in the address bar
3. Click the icon and select "Install"
4. The app will open in a standalone window
5. Access it from your applications menu or taskbar

## Technical Details

### Architecture

The PWA implementation uses:
- **next-pwa**: Workbox-based PWA plugin for Next.js
- **Service Worker**: Handles caching and offline functionality
- **Web App Manifest**: Defines app metadata and installation behavior

### Caching Strategies

#### Static Assets (Cache First)
- CSS, JavaScript, images
- Cached for 30 days
- Serves from cache first, falls back to network

#### API Requests (Network First)
- API routes (`/api/*`)
- 10-second network timeout
- Falls back to cache if network fails
- Cache expires after 5 minutes

#### Google Fonts (Cache First)
- Cached for 1 year
- Reduces load times and bandwidth usage

### File Structure

```
public/
├── manifest.json              # PWA manifest configuration
├── icon-192x192.svg          # Standard app icon (192x192)
├── icon-512x512.svg          # High-res app icon (512x512)
├── icon-maskable-192x192.svg # Android adaptive icon (192x192)
├── icon-maskable-512x512.svg # Android adaptive icon (512x512)
└── apple-touch-icon.svg      # iOS home screen icon (180x180)

src/
├── app/
│   ├── layout.tsx            # Root layout with PWA metadata
│   └── offline/
│       └── page.tsx          # Offline fallback page
└── components/
    └── PWAUpdatePrompt.tsx   # Update notification component

next.config.ts                # Next.js config with PWA integration
```

### Configuration

#### Manifest (public/manifest.json)
```json
{
  "name": "Financial Helm - Personal Finance Manager",
  "short_name": "Financial Helm",
  "display": "standalone",
  "theme_color": "#1e40af",
  "background_color": "#ffffff",
  "orientation": "portrait"
}
```

#### Service Worker Options (next.config.ts)
```typescript
{
  dest: "public",              // Output directory for service worker
  register: true,              // Auto-register service worker
  skipWaiting: true,          // Activate new SW immediately
  disable: isDevelopment,     // Disable in development mode
}
```

## Customization

### Updating Icons

1. Create your icon designs (square format recommended)
2. Generate the following sizes:
   - 192x192 (standard)
   - 512x512 (high-resolution)
   - 180x180 (iOS)
3. For Android adaptive icons, ensure 80% safe zone for content
4. Replace the SVG files in the `public/` directory
5. Update references in `manifest.json` and `src/app/layout.tsx`

### Modifying Caching Strategies

Edit `next.config.ts` to adjust caching behavior:

```typescript
runtimeCaching: [
  {
    urlPattern: /your-pattern/,
    handler: "CacheFirst" | "NetworkFirst" | "StaleWhileRevalidate",
    options: {
      cacheName: "your-cache-name",
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 86400, // 1 day
      },
    },
  },
]
```

### Changing Theme Colors

1. Update `theme_color` in `public/manifest.json`
2. Update the `theme-color` meta tag in `src/app/layout.tsx`
3. Ensure colors match your brand identity

## Troubleshooting

### App Not Installing

**Android:**
- Ensure you're using Chrome or a Chromium-based browser
- Check that the site is served over HTTPS
- Clear browser cache and try again

**iOS:**
- Use Safari browser (other browsers don't support PWA installation on iOS)
- Ensure you're following the "Add to Home Screen" steps correctly
- iOS doesn't show automatic install prompts

### Offline Features Not Working

1. Check that service worker is registered:
   - Open DevTools → Application → Service Workers
   - Verify service worker is active
2. Clear cache and reload:
   - DevTools → Application → Clear storage
   - Reload the page
3. Ensure you've visited pages while online first (they need to be cached)

### Update Not Appearing

1. Service worker updates check every 60 seconds
2. Force update check:
   - DevTools → Application → Service Workers
   - Click "Update" button
3. Clear old service workers if stuck:
   - Unregister all service workers
   - Clear cache
   - Reload page

### Icons Not Displaying

1. Verify icon files exist in `public/` directory
2. Check file paths in `manifest.json` match actual files
3. Clear browser cache
4. For iOS, ensure apple-touch-icon is properly linked

## Testing

### Manual Testing Checklist

- [ ] Install app on Android device
- [ ] Install app on iOS device
- [ ] Install app on desktop browser
- [ ] Test offline functionality (disable network)
- [ ] Verify update notification appears
- [ ] Check icons display correctly on home screen
- [ ] Test standalone mode (no browser UI)
- [ ] Verify splash screen on mobile

### Lighthouse PWA Audit

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Progressive Web App" category
4. Run audit
5. Target score: 90+

### Service Worker Testing

```javascript
// Check if service worker is registered
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('Service Worker registered:', reg);
});

// Check cache contents
caches.keys().then(keys => {
  console.log('Cache names:', keys);
});
```

## Best Practices

### Do's ✅
- Keep icons simple and recognizable at small sizes
- Test on real devices, not just emulators
- Monitor cache sizes to avoid excessive storage use
- Update service worker when making significant changes
- Provide clear offline messaging to users

### Don'ts ❌
- Don't cache sensitive user data
- Don't cache authentication tokens
- Don't make the app unusable when offline
- Don't ignore service worker update errors
- Don't forget to test on both iOS and Android

## Performance Optimization

### Cache Size Management
- Set appropriate `maxEntries` for each cache
- Use `maxAgeSeconds` to expire old content
- Regularly audit cache usage in DevTools

### Network Efficiency
- Precache only essential assets
- Use network-first for dynamic content
- Implement background sync for failed requests (future enhancement)

### Load Time Optimization
- Lazy load non-critical resources
- Compress images before caching
- Use SVG icons when possible (smaller file size)

## Future Enhancements

Planned PWA features for future releases:

- **Push Notifications**: Budget alerts and financial insights
- **Background Sync**: Sync transactions when connection restored
- **Periodic Background Sync**: Fetch latest data periodically
- **Web Share API**: Share financial reports
- **Shortcuts**: Quick actions from home screen icon
- **Badging API**: Show notification count on app icon

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [next-pwa GitHub](https://github.com/DuCanhGH/next-pwa)
- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## Support

For issues or questions about the PWA implementation:
1. Check this documentation first
2. Review the troubleshooting section
3. Check browser console for errors
4. Test in incognito/private mode to rule out extension conflicts
5. Contact the development team with specific error messages

---

**Last Updated**: October 30, 2025
**PWA Version**: 1.0.0
**Compatible Browsers**: Chrome 90+, Safari 14+, Edge 90+
