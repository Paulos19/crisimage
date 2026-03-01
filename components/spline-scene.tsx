'use client';

import { Suspense, lazy, useState } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
    /** URL to the Spline scene (.splinecode file) */
    scene: string;
    /** CSS class to apply to the Spline canvas */
    className?: string;
    /** Callback fired when the scene finishes loading */
    onLoad?: (app: any) => void;
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative w-full h-full">
            {/* Loading spinner */}
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="spline-spinner" />
                </div>
            )}

            <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                    <span className="spline-spinner" />
                </div>
            }>
                <Spline
                    scene={scene}
                    className={className}
                    onLoad={(app) => {
                        setLoaded(true);
                        onLoad?.(app);
                    }}
                    style={{
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 0.6s ease-in-out',
                    }}
                />
            </Suspense>

            <style jsx global>{`
        @keyframes spline-spin {
          to { transform: rotate(360deg); }
        }
        .spline-spinner {
          display: inline-block;
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #4ade80;
          border-radius: 50%;
          animation: spline-spin 0.8s linear infinite;
        }
      `}</style>
        </div>
    );
}
