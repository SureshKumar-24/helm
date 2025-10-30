# Implementation Plan

- [ ] 1. Install and configure next-pwa package
  - Install @ducanh2912/next-pwa package (latest stable version compatible with Next.js 15)
  - Update next.config.ts to integrate next-pwa with custom caching strategies
  - Configure service worker generation settings (dest, register, skipWaiting)
  - Add .gitignore entries for generated service worker files (sw.js, workbox-*.js)
  - _Requirements: 5.1, 5.2_

- [ ] 2. Create web app manifest and PWA metadata
  - [ ] 2.1 Create manifest.json file in public directory
    - Define app name, short_name, description, and start_url
    - Configure display mode as "standalone" for native app experience
    - Set theme_color (#1e40af) and background_color (#ffffff)
    - Add icons array with references to all required icon sizes
    - Include maskable icons for Android adaptive icon support
    - Set orientation to "portrait" for optimal mobile experience
    - _Requirements: 1.1, 1.2, 4.1, 4.2, 4.5_
  
  - [ ] 2.2 Update root layout with PWA metadata
    - Add manifest reference to metadata object
    - Configure appleWebApp metadata for iOS support
    - Add formatDetection settings to prevent unwanted iOS behaviors
    - Define icon references for standard and Apple touch icons
    - _Requirements: 3.1, 3.4, 5.3_

- [ ] 3. Generate and add PWA icons
  - Create base icon design (512x512) for Financial Helm branding
  - Generate icon-192x192.png for standard PWA icon
  - Generate icon-512x512.png for high-resolution displays
  - Generate icon-maskable-192x192.png for Android adaptive icons
  - Generate icon-maskable-512x512.png for Android adaptive icons (high-res)
  - Generate apple-touch-icon.png (180x180) for iOS home screen
  - Place all icons in public directory
  - Verify icons meet PWA requirements (square, proper safe zones for maskable)
  - _Requirements: 1.4, 3.2, 4.5_

- [ ] 4. Configure caching strategies
  - [ ] 4.1 Set up runtime caching rules in next.config.ts
    - Configure CacheFirst strategy for Google Fonts with 1-year expiration
    - Configure NetworkFirst strategy for API routes with 10s timeout and 5-minute cache
    - Configure CacheFirst strategy for images with 30-day expiration
    - Set appropriate cache names for each resource type
    - Define maxEntries limits to prevent unlimited cache growth
    - _Requirements: 2.1, 2.4, 2.5_
  
  - [ ] 4.2 Configure service worker options
    - Enable automatic registration on page load
    - Enable skipWaiting for immediate service worker activation
    - Disable PWA in development mode for easier debugging
    - Configure workbox options for optimal performance
    - _Requirements: 5.2, 6.3_

- [ ] 5. Create offline fallback page
  - Create src/app/offline/page.tsx with user-friendly offline UI
  - Display clear message explaining offline status
  - Add retry button to check connection and reload
  - Style page to match application branding
  - Ensure page is precached by service worker
  - _Requirements: 2.3_

- [ ] 6. Implement service worker update notification
  - [ ] 6.1 Create PWAUpdatePrompt component
    - Create src/components/PWAUpdatePrompt.tsx
    - Implement useEffect hook to listen for service worker updates
    - Detect when new service worker is waiting to activate
    - Display notification banner when update is available
    - Provide "Update Now" button to trigger skipWaiting
    - Implement page reload after service worker activation
    - _Requirements: 6.1, 6.2, 6.5_
  
  - [ ] 6.2 Integrate update prompt into root layout
    - Import PWAUpdatePrompt component in src/app/layout.tsx
    - Add component to layout to make it available on all pages
    - Ensure component only renders on client side
    - Style notification to be non-intrusive but visible
    - _Requirements: 6.1, 6.2_

- [ ] 7. Add iOS-specific PWA enhancements
  - Add viewport meta tag with viewport-fit=cover for notch support
  - Add apple-mobile-web-app-capable meta tag
  - Add apple-mobile-web-app-status-bar-style meta tag
  - Add apple-mobile-web-app-title meta tag
  - Ensure apple-touch-icon link is properly referenced
  - Test standalone mode behavior on iOS Safari
  - _Requirements: 3.1, 3.3, 3.4, 3.5_

- [ ] 8. Add Android-specific PWA enhancements
  - Verify manifest.json includes all Android-required fields
  - Ensure theme_color is set for Android address bar theming
  - Add maskable icons with proper safe zone (80% content area)
  - Test install prompt behavior on Chrome Android
  - Verify standalone mode launches correctly
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 9. Update .gitignore and build configuration
  - Add /public/sw.js to .gitignore
  - Add /public/workbox-*.js to .gitignore
  - Add /public/sw.js.map to .gitignore
  - Verify service worker generates correctly during build
  - Test production build to ensure PWA assets are created
  - _Requirements: 5.2, 5.4_

- [ ] 10. Create PWA documentation
  - Document PWA features and capabilities in README
  - Add installation instructions for users (Android and iOS)
  - Document caching strategies and offline behavior
  - Add troubleshooting guide for common PWA issues
  - Document how to customize PWA settings for future developers
  - _Requirements: 5.5_

- [ ] 11. Manual testing and validation
  - Test installation flow on Chrome Android
  - Test installation flow on Safari iOS
  - Verify offline functionality with network disabled
  - Test service worker update flow
  - Verify icons display correctly on home screen
  - Test standalone mode on both platforms
  - Run Lighthouse PWA audit and achieve score > 90
  - _Requirements: All requirements_
