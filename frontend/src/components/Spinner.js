/*
 * Spinner.js
 *
 * Purpose:
 * This React component displays a fullscreen loading spinner overlay.
 * It is used to indicate loading or processing states in the application.
 *
 * Features:
 * - Fullscreen overlay with semi-transparent background.
 * - Centered animated spinner using Tailwind CSS classes.
 *
 * Usage:
 * Import and render this component when an operation is in progress.
 * Example: <Spinner />
 *
 * Dependencies:
 * - Tailwind CSS for styling and animation.
 *
 * Notes:
 * - Designed to be reusable for any loading state in the app.
 */

import React from 'react';

// Main Spinner component for loading overlay
export default function Spinner(){
    return(
        // Fullscreen overlay with animated spinner
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
        </div>
    );
}
