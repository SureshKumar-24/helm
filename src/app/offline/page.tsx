"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
            <WifiOff className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            You&apos;re Offline
          </h1>
          <p className="text-gray-600 mb-6">
            It looks like you&apos;ve lost your internet connection. Some features may not be available until you&apos;re back online.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            What you can do:
          </h2>
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>View previously loaded pages and data</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Check your internet connection</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Try again once you&apos;re back online</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleRetry}
          disabled={!isOnline}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isOnline
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <RefreshCw className="w-5 h-5" />
          {isOnline ? "Retry Connection" : "Waiting for Connection..."}
        </button>

        {isOnline && (
          <p className="mt-4 text-sm text-green-600 font-medium">
            ✓ Connection restored! Click retry to continue.
          </p>
        )}
      </div>
    </div>
  );
}
