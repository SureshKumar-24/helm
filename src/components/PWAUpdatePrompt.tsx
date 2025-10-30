"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export default function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const checkForUpdates = async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (!registration) return;

        // Check if there's a waiting service worker
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowPrompt(true);
        }

        // Listen for new service worker installing
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setShowPrompt(true);
            }
          });
        });

        // Listen for controller change (new service worker activated)
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error checking for service worker updates:", error);
      }
    };

    checkForUpdates();

    // Check for updates periodically (every 60 seconds)
    const interval = setInterval(() => {
      navigator.serviceWorker.getRegistration().then((registration) => {
        registration?.update();
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdate = () => {
    if (!waitingWorker) return;

    // Send skip waiting message to the waiting service worker
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Update Available
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              A new version of Financial Helm is available. Update now to get the latest features and improvements.
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Update Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
