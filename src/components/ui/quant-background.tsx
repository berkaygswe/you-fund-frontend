import React from "react";

export const QuantBackground = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none aria-hidden:true">
            {/* Blue center fading to almost-white blue at the ends */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#f5f8ff] via-[#e6efff] to-[#f5f8ff] dark:from-background dark:via-background/95 dark:to-background" />

            {/* Ambient Gradient Mesh - Concentrated in the Core */}
            <div className="absolute inset-0 opacity-[0.22] dark:opacity-[0.28]">
                {/* Primary Blob: Top-Right - Blue/Indigo */}
                <div
                    className="absolute top-[5%] -right-[5%] w-[90%] h-[40%] rounded-[100%] bg-blue-500/20 blur-[130px] animate-float"
                />

                {/* Secondary Blob: Mid-Left - Deep Indigo */}
                <div
                    className="absolute top-[30%] -left-[15%] w-[80%] h-[50%] rounded-[100%] bg-indigo-500/15 blur-[110px] animate-float [animation-duration:32s] [animation-delay:4s]"
                />

                {/* Tertiary Blob: Mid-Right */}
                <div
                    className="absolute top-[50%] -right-[10%] w-[70%] h-[40%] rounded-[100%] bg-blue-600/10 blur-[120px] animate-float [animation-duration:40s] [animation-delay:6s]"
                />

                {/* Quaternary Blob: Center Bottom */}
                <div
                    className="absolute bottom-[5%] left-[5%] w-[90%] h-[45%] rounded-[100%] bg-indigo-500/20 blur-[130px] animate-float [animation-duration:35s] [animation-delay:2s]"
                />
            </div>

            {/* Precision Grid: Watermark professional aesthetic */}
            <div
                className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, currentColor 1px, transparent 1px),
                        linear-gradient(to bottom, currentColor 1px, transparent 1px)
                    `,
                    backgroundSize: '64px 64px',
                    backgroundAttachment: 'local'
                }}
            />

            {/* Fine Dot Overlay */}
            <div
                className="absolute inset-0 opacity-[0.06] dark:opacity-[0.1]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                    backgroundSize: '32px 32px',
                    backgroundAttachment: 'local'
                }}
            />

            {/* Fades to near-white blue (#f5f8ff) so it's smooth but not completely white */}
            <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#f5f8ff] via-[#f5f8ff]/60 to-transparent dark:from-background dark:via-background/40 opacity-95" />
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#f5f8ff] via-[#f5f8ff]/60 to-transparent dark:from-background dark:via-background/40 opacity-95" />

            {/* Premium Grain Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.18] dark:opacity-[0.25] pointer-events-none mix-blend-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <filter id="quantNoise">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.82"
                            numOctaves="4"
                            stitchTiles="stitch"
                        />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#quantNoise)" />
                </svg>
            </div>
        </div>
    );
};
